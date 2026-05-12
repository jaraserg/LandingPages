import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Draw a leaf alpha mask on a canvas
function makeLeafTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(64, 118);
  ctx.bezierCurveTo(10, 85, 20, 18, 64, 8);
  ctx.bezierCurveTo(108, 18, 118, 85, 64, 118);
  ctx.fill();
  // Midrib
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 118);
  ctx.lineTo(64, 8);
  ctx.stroke();
  return new THREE.CanvasTexture(c);
}

// Draw a simple 5-petal flower alpha mask on a canvas
function makeFlowerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#fff';
  const cx = 64, cy = 64, petals = 5, petalLen = 38, petalW = 20;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -petalLen / 2, petalW / 2, petalLen / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // Centre circle
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(c);
}

interface Particle {
  x: number; y: number; z: number;
  vy: number; vx: number;
  rotZ: number; rotX: number;
  rotZspeed: number; rotXspeed: number;
  size: number;
}

function makeParticles(count: number, slow = false): Particle[] {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 50,
    y: Math.random() * 40,
    z: (Math.random() - 0.5) * 10 - 3,
    // Wide spread of slow speeds — some drift gently, some float
    vy: slow
      ? Math.random() * 0.018 + 0.006   // flowers: 0.006–0.024 (very slow)
      : Math.random() * 0.030 + 0.008,  // leaves:  0.008–0.038 (slow-medium)
    vx: (Math.random() - 0.5) * 0.012,
    rotZ: Math.random() * Math.PI * 2,
    rotX: Math.random() * Math.PI * 2,
    rotZspeed: (Math.random() - 0.5) * 0.018,
    rotXspeed: (Math.random() - 0.5) * 0.022,
    size: slow
      ? Math.random() * 0.35 + 0.2      // flowers slightly smaller
      : Math.random() * 0.45 + 0.25,
  }));
}

function buildMesh(
  count: number,
  alphaMap: THREE.CanvasTexture,
  palette: string[],
  scene: THREE.Scene
): THREE.InstancedMesh {
  const geo = new THREE.PlaneGeometry(1, 1);
  const mat = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    alphaMap,
    alphaTest: 0.01,
    depthWrite: false,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const col = new THREE.Color();
  for (let i = 0; i < count; i++) {
    col.set(palette[Math.floor(Math.random() * palette.length)]);
    mesh.setColorAt(i, col);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  scene.add(mesh);
  return mesh;
}

export default function ThreeFallingFlowers() {
  const mountRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current || startedRef.current) return;
    startedRef.current = true;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    // ── Textures ───────────────────────────────────────────────────────────────
    const leafTex   = makeLeafTexture();
    const flowerTex = makeFlowerTexture();

    // ── Palettes ───────────────────────────────────────────────────────────────
    const leafPalette   = ['#c0392b', '#e67e22', '#d35400', '#f39c12', '#922b21', '#ca6f1e', '#6e2f0f'];
    const flowerPalette = ['#f4a7b9', '#f9c6d0', '#fad4e8', '#ffe0f0', '#fff0a0', '#e8b4f8', '#ffc8e0'];

    // ── Particle counts ────────────────────────────────────────────────────────
    const LEAF_COUNT   = 75;
    const FLOWER_COUNT = 45;

    const leafMesh   = buildMesh(LEAF_COUNT,   leafTex,   leafPalette,   scene);
    const flowerMesh = buildMesh(FLOWER_COUNT, flowerTex, flowerPalette, scene);

    const leafParticles   = makeParticles(LEAF_COUNT,   false);
    const flowerParticles = makeParticles(FLOWER_COUNT, true);

    // ── Wind ───────────────────────────────────────────────────────────────────
    let targetWind = 0, wind = 0;
    let lastX = -1, lastT = Date.now();

    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now(), dt = now - lastT;
      if (dt > 0 && lastX !== -1) {
        const dx = e.clientX - lastX;
        targetWind = Math.max(-0.5, Math.min(0.5, targetWind + (dx / dt) * 0.022));
      }
      lastX = e.clientX; lastT = now;
    };
    window.addEventListener('mousemove', onMouseMove);
    const windDecay = setInterval(() => { targetWind *= 0.92; }, 50);

    // ── Resize ─────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation ──────────────────────────────────────────────────────────────
    const dummy = new THREE.Object3D();

    function stepParticles(particles: Particle[], mesh: THREE.InstancedMesh) {
      particles.forEach((p, i) => {
        p.y -= p.vy;
        // Each particle has unique sway frequency (index offset gives variety)
        p.x += p.vx + wind + Math.sin(p.y * 0.12 + i * 0.7) * 0.015;
        p.rotZ += p.rotZspeed;
        p.rotX += p.rotXspeed;

        if (p.y < -22) { p.y = 22 + Math.random() * 8; p.x = (Math.random() - 0.5) * 50; }
        if (p.x >  28) p.x = -28;
        if (p.x < -28) p.x =  28;

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rotX, 0, p.rotZ);
        dummy.scale.setScalar(p.size);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    let raf: number;
    const animate = () => {
      wind += (targetWind - wind) * 0.07;
      stepParticles(leafParticles,   leafMesh);
      stepParticles(flowerParticles, flowerMesh);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      startedRef.current = false;
      cancelAnimationFrame(raf);
      clearInterval(windDecay);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      leafTex.dispose();
      flowerTex.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div ref={mountRef} className="absolute inset-0" style={{ zIndex: 1 }} />
    </div>
  );
}

// Theme toggle
const toggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
let theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.dataset.theme = theme;
toggle.textContent = theme === 'dark' ? '☀︎' : '🌙';

toggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  toggle.textContent = theme === 'dark' ? '☀︎' : '🌙';
  try { updateColors(); } catch (e) { console.warn('Color update failed', e); }
});

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  try { initCursor(); } catch (e) { console.error('Cursor init failed', e); }
  try { initThreeJS(); } catch (e) { console.error('ThreeJS init failed', e); }
  try { initGSAP(); } catch (e) { console.error('GSAP init failed', e); }
  try { initHeroPixel(); } catch (e) { console.error('HeroPixel init failed', e); }
  try { initTypewriter(); } catch (e) { console.error('Typewriter init failed', e); }
});

// Custom Cursor — Particles + dot/ring
function initCursor() {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Inject cursor dot + ring elements
  const dot  = document.createElement('div');
  dot.id = 'cursor-dot';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // Smooth lag for ring
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  const particles = [];
  let isHovering = false;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * (isHovering ? 6 : 3) + 0.5;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
      const isDark = html.dataset.theme === 'dark';
      this.color = isDark ? '0, 212, 255' : '0, 60, 180';
      this.life  = 1.0;
      this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.size *= 0.94;
      this.life -= this.decay;
    }
    draw() {
      ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const count = isHovering ? 4 : 2;
    for (let i = 0; i < count; i++) particles.push(new Particle(mouseX, mouseY));
  });

  const hoverTargets = document.querySelectorAll('a, button, .card');
  hoverTargets.forEach(t => {
    t.addEventListener('mouseenter', () => { isHovering = true;  document.body.classList.add('cursor-hover'); });
    t.addEventListener('mouseleave', () => { isHovering = false; document.body.classList.remove('cursor-hover'); });
  });

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Lag ring toward mouse
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
    ring.style.left = ringX  + 'px';
    ring.style.top  = ringY  + 'px';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0 || particles[i].size <= 0.2) { particles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}


// ─── HERO PIXEL ASSEMBLY ANIMATION ───────────────────────────────────────────
function initHeroPixel() {
  const canvas = document.getElementById('hero-pixel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas to match header
  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Render the h1 text invisibly onto an offscreen canvas to sample pixel positions
  function sampleTextPixels() {
    const words    = ['EL', 'SOLAR', 'BELLO'];
    const offscreen = document.createElement('canvas');
    offscreen.width  = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext('2d');

    // Mirror the real h1 style
    const fontSize = Math.min(canvas.width * 0.18, 180);
    octx.fillStyle = '#ffffff';
    octx.textAlign = 'center';
    octx.textBaseline = 'alphabetic';
    octx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;

    const lineH = fontSize * 0.92;
    const totalH = lineH * words.length;
    let startY = (canvas.height - totalH) / 2 + fontSize * 0.8;

    words.forEach((word, i) => {
      octx.fillText(word, canvas.width / 2, startY + i * lineH);
    });

    const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height).data;
    const pixels  = [];
    const step    = 4; // sample every N pixels for performance
    for (let y = 0; y < offscreen.height; y += step) {
      for (let x = 0; x < offscreen.width; x += step) {
        const idx = (y * offscreen.width + x) * 4;
        if (imgData[idx + 3] > 128) {
          pixels.push({ tx: x, ty: y });
        }
      }
    }
    return pixels;
  }

  const ACCENT   = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4ff';
  const targets  = sampleTextPixels();
  if (!targets.length) return;

  // Create particle objects — each starts off-screen at a random scatter position
  const particles = targets.map(t => ({
    tx: t.tx, ty: t.ty,
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6,
    size: Math.random() * 1.4 + 0.4,     // smaller pixels
    color: ACCENT,
    arrived: false,
    delay: Math.random() * 100,           // more staggered start
    frame: 0
  }));

  let allArrived  = false;
  let holdFrames  = 0;
  let dispersing  = false;
  let dispersed   = false;
  let rafId;

  function drawPixelFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let arrivedCount = 0;

    particles.forEach(p => {
      if (p.frame < p.delay) { p.frame++; return; }

      if (!dispersing) {
        // Ease toward target — slow and cinematic
        const ease = 0.045;
        p.vx = (p.tx - p.x) * ease;
        p.vy = (p.ty - p.y) * ease;
        p.x += p.vx;
        p.y += p.vy;

        const dist = Math.hypot(p.tx - p.x, p.ty - p.y);
        if (dist < 1.5) { p.x = p.tx; p.y = p.ty; p.arrived = true; }
        if (p.arrived) arrivedCount++;
      } else {
        // Scatter outward
        p.vx += (Math.random() - 0.5) * 0.8;
        p.vy -= Math.random() * 0.6;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x  += p.vx * 3;
        p.y  += p.vy * 3;
        p.size *= 0.97;
      }

      if (p.size < 0.2) return;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.fill();
    });

    if (!allArrived && arrivedCount === particles.length) {
      allArrived = true;
    }

    if (allArrived && !dispersing) {
      holdFrames++;
      if (holdFrames > 80) {   // hold longer before dispersing
        // Reveal the real h1 slowly and start dispersal
        document.querySelectorAll('.hero-word').forEach(el => {
          el.style.transition = 'opacity 2.5s ease';  // very slow reveal
          el.style.opacity = '1';
        });
        dispersing = true;
      }
    }

    if (dispersing && !dispersed) {
      const anyVisible = particles.some(p => p.size >= 0.2);
      if (!anyVisible) {
        dispersed = true;
        cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
    }

    rafId = requestAnimationFrame(drawPixelFrame);
  }

  // Small delay so page layout settles
  setTimeout(() => { rafId = requestAnimationFrame(drawPixelFrame); }, 300);
}

// ─── ABOUT TYPEWRITER ANIMATION ───────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('about-typewriter');
  if (!el) return;

  const fullText = el.dataset.text || '';
  // Convert encoded newlines back to line breaks shown as <br>
  const display  = fullText.replace(/\n/g, '\n');
  let   charIdx  = 0;
  let   twTimer  = null;
  let   started  = false;

  function typeNext() {
    if (charIdx >= display.length) {
      el.classList.add('tw-done');
      clearInterval(twTimer);
      return;
    }
    const ch = display[charIdx];
    if (ch === '\n') {
      el.innerHTML += '<br/>';
    } else {
      el.innerHTML += ch;
    }
    charIdx++;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started  = true;
        // Start after a short delay for drama
        setTimeout(() => {
          twTimer = setInterval(typeNext, 28);
        }, 400);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(el);
}


function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Marquee
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner) {
    gsap.to(marqueeInner, {
      xPercent: -50,
      ease: 'none',
      duration: 50, // Slower (was 30)
      repeat: -1
    });
  }

  // Scroll Animations
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1.5, // Smoother
        ease: 'power3.out'
      });
    });

    // Card stagger (Disabled for visibility debugging)
    /*
    gsap.utils.toArray('.grid').forEach(grid => {
      const cards = grid.querySelectorAll('.card');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });
    });
    */

    // Header Animations (hero-title is handled by the pixel assembly animation)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.subtitle', { y: 20, opacity: 0, duration: 1.4, delay: 2.0 })
      .from('.tagline', { y: 20, opacity: 0, duration: 1.2 }, '-=1.0')
      .from('.hero-image', { scale: 0.9, opacity: 0, duration: 1.8, ease: 'power2.out' }, '-=1.5')
      .from('.buttons .btn', { y: 20, opacity: 0, duration: 1.0, stagger: 0.2 }, '-=0.8');
  }
}

// Three.js Logic
let scene, camera, renderer, material, points, coreMesh, lineMesh, geometry, positions, velocities, sizes, pulsePhases;

// Constants
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const PARTICLE_COUNT = isMobile ? 800 : 1800;
const MAX_PIXEL_RATIO = isMobile ? 1.5 : 2;
const CONNECTION_DISTANCE = isMobile ? 3.2 : 4.0;

function initThreeJS() {
  if (typeof THREE === 'undefined') return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

  // Particles
  positions = new Float32Array(PARTICLE_COUNT * 3);
  velocities = new Float32Array(PARTICLE_COUNT * 3);
  sizes = new Float32Array(PARTICLE_COUNT);
  pulsePhases = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 14;
    positions[i3 + 1] = (Math.random() - 0.5) * 14;
    positions[i3 + 2] = (Math.random() - 0.5) * 14;

    velocities[i3] = (Math.random() - 0.5) * 0.006;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.006;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.006;

    sizes[i] = 0.8 + Math.random() * 1.4;
    pulsePhases[i] = Math.random() * Math.PI * 2;
  }

  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  material = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    sizeAttenuation: true
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  // Core Mesh - Morphing Sphere
  // Increase detail for smoother morphing (radius 2, detail 10)
  // Check for mobile to adjust detail level for performance
  const detail = isMobile ? 4 : 10;
  const coreGeometry = new THREE.IcosahedronGeometry(2, detail);

  // Store original positions for morphing calculations
  const posAttribute = coreGeometry.attributes.position;
  const originalPositions = new Float32Array(posAttribute.count * 3);
  for (let i = 0; i < posAttribute.count; i++) {
    originalPositions[i * 3] = posAttribute.getX(i);
    originalPositions[i * 3 + 1] = posAttribute.getY(i);
    originalPositions[i * 3 + 2] = posAttribute.getZ(i);
  }
  coreGeometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));

  const coreMaterial = new THREE.MeshBasicMaterial({
    color: theme === 'dark' ? 0x00d4ff : 0x0066ff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(coreMesh);

  // Lines
  window.lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start Animation Loop
  animate();
}

// Shared helpers
const pointer = { x: 0, y: 0 };
let pointerActive = false;
window.addEventListener('mousemove', (e) => {
  pointerActive = true;
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('touchstart', () => pointerActive = true);
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
  }
});

const timeStart = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = (performance.now() - timeStart) * 0.001;

  // Particle updates
  if (geometry && positions) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      positions[i3 + 1] += Math.sin(elapsed * 0.6 + positions[i3] * 1.8) * 0.002;
      positions[i3] += Math.cos(elapsed * 0.8 + positions[i3 + 2] * 1.2) * 0.0015;

      if (Math.abs(positions[i3]) > 7) velocities[i3] *= -0.98;
      if (Math.abs(positions[i3 + 1]) > 7) velocities[i3 + 1] *= -0.98;
      if (Math.abs(positions[i3 + 2]) > 7) velocities[i3 + 2] *= -0.98;
    }

    // Mouse Interaction
    if (pointerActive) {
      const mousePos = new THREE.Vector3(pointer.x * 10, pointer.y * 10, 4);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const dx = positions[i3] - mousePos.x;
        const dy = positions[i3 + 1] - mousePos.y;
        const dz = positions[i3 + 2] - mousePos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 36 && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const force = 1.0 / dist;
          positions[i3] += dx / dist * force * 0.09;
          positions[i3 + 1] += dy / dist * force * 0.09;
          positions[i3 + 2] += dz / dist * force * 0.07;
        }
      }
    }

    geometry.attributes.position.needsUpdate = true;
  }

  // Connections
  if (Math.floor(elapsed * 12) % 4 === 0) updateConnections();

  // Core Morphing Animation
  if (coreMesh && coreMesh.geometry.attributes.originalPosition) {
    coreMesh.rotation.y += 0.002;
    coreMesh.rotation.z += 0.001;

    const positions = coreMesh.geometry.attributes.position;
    const originalPositions = coreMesh.geometry.attributes.originalPosition;
    const count = positions.count;
    const time = elapsed * 0.8; // Speed of morphing

    for (let i = 0; i < count; i++) {
      const px = originalPositions.getX(i);
      const py = originalPositions.getY(i);
      const pz = originalPositions.getZ(i);

      // Create organic noise using multiple sine waves
      // We displace along the normal vector (which for a sphere/icosahedron at 0,0,0 is just the normalized position)
      // Since our base is an icosahedron, the normal is roughly the position vector normalized.
      // But we can just add offsets to the coordinates directly for a gooey effect.

      const noise = Math.sin(px * 0.5 + time) * Math.cos(py * 0.3 + time) * Math.sin(pz * 0.5 + time);
      const intensity = 0.4; // How much it morphs

      // Apply displacement based on original position direction
      const scale = 1 + noise * intensity;

      positions.setXYZ(i, px * scale, py * scale, pz * scale);
    }

    positions.needsUpdate = true;
  }

  // Colors
  const pulseSpeed = 1.2;
  const baseHue = theme === 'dark' ? 195 : 210;
  const baseSat = theme === 'dark' ? 0.85 : 0.75;
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phase = pulsePhases[i] + elapsed * pulseSpeed;
    const brightness = 0.65 + Math.sin(phase) * 0.35;
    const hsl = { h: baseHue / 360, s: baseSat, l: brightness };
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const i3 = i * 3;
    colors[i3] = rgb.r;
    colors[i3 + 1] = rgb.g;
    colors[i3 + 2] = rgb.b;
  }

  if (geometry) {
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    material.vertexColors = true;
    material.needsUpdate = true;
  }

  if (points) points.rotation.y += 0.0003;

  if (renderer && scene && camera) renderer.render(scene, camera);
}

function updateConnections() {
  if (!geometry || !geometry.attributes.position) return;

  const pos = geometry.attributes.position.array;
  const linePositions = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const j3 = j * 3;
      const dx = pos[i3] - pos[j3];
      const dy = pos[i3 + 1] - pos[j3 + 1];
      const dz = pos[i3 + 2] - pos[j3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < CONNECTION_DISTANCE) {
        linePositions.push(pos[i3], pos[i3 + 1], pos[i3 + 2]);
        linePositions.push(pos[j3], pos[j3 + 1], pos[j3 + 2]);
      }
    }
  }

  if (lineMesh) scene.remove(lineMesh);

  if (linePositions.length > 0 && window.lineMaterial) {
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineMesh = new THREE.LineSegments(lineGeo, window.lineMaterial);
    scene.add(lineMesh);
  }
}

function updateColors() {
  const isDark = html.dataset.theme === 'dark';
  const particleBase = isDark ? 0x00d4ff : 0x0066ff;
  if (material) material.color.setHex(particleBase);
  if (coreMesh) coreMesh.material.color.setHex(particleBase);
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) { r = g = b = l; } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r, g, b };
}
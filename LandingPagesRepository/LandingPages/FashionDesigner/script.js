/**
 * Fashion Designer Landing Page — script.js
 * - Section navigation (pill tabs)
 * - Floating Action Button (FAB)
 * - Background canvas: fabric threads + bokeh
 * - Sewing machine canvas animation
 */

/* ============================================================
   1. NAVIGATION
   ============================================================ */
(function initNav() {
    const pills = document.querySelectorAll('.pill');

    pills.forEach(pill => {
        pill.addEventListener('click', function (e) {
            e.preventDefault();
            const id = 'section-' + this.dataset.section;
            const target = document.getElementById(id);
            if (!target) return;

            document.querySelectorAll('.frame-panel').forEach(p => p.classList.remove('active'));
            target.classList.add('active');

            pills.forEach(p => p.classList.remove('active-pill'));
            this.classList.add('active-pill');
        });
    });
})();

/* ============================================================
   2. FLOATING ACTION BUTTON
   ============================================================ */
(function initFAB() {
    const btn = document.getElementById('fab-btn');
    const menu = document.getElementById('fab-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
})();

/* ============================================================
   3. BACKGROUND CANVAS — Floating fabric threads & bokeh
   ============================================================ */
(function initBgCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
        'rgba(245,197,24,',   // yellow
        'rgba(26,26,26,',     // black
        'rgba(200,185,165,',  // beige-mid
        'rgba(34,197,94,',    // green
    ];

    const COUNT = 22;
    const threads = Array.from({ length: COUNT }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        len: 20 + Math.random() * 80,
        angle: Math.random() * Math.PI * 2,
        dAngle: (Math.random() - 0.5) * 0.005,
        speed: 0.15 + Math.random() * 0.3,
        alpha: 0.04 + Math.random() * 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: Math.random() > 0.5 ? 'thread' : 'dot',
        r: 4 + Math.random() * 18,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        threads.forEach(t => {
            t.angle += t.dAngle;
            t.y += t.speed;
            if (t.y > canvas.height + t.len) t.y = -t.len;

            ctx.save();
            ctx.globalAlpha = t.alpha;

            if (t.type === 'thread') {
                const ex = t.x + Math.cos(t.angle) * t.len;
                const ey = t.y + Math.sin(t.angle) * t.len;
                ctx.strokeStyle = t.color + '1)';
                ctx.lineWidth = 1.2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            } else {
                const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.r);
                g.addColorStop(0, t.color + t.alpha + ')');
                g.addColorStop(1, t.color + '0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    draw();
})();

/* ============================================================
   4. SEWING MACHINE CANVAS ANIMATION
   ============================================================ */
(function initSewingMachine() {
    const canvas = document.getElementById('sewing-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width = canvas.offsetWidth || 340;
    const H = canvas.height = canvas.offsetHeight || 260;

    // Re-sync size when CSS loads
    const ro = new ResizeObserver(() => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    // ── Colors ──
    const C = {
        body: '#2D2D2D',
        chrome: '#888',
        arm: '#1A1A1A',
        head: '#333',
        plate: '#C0A040',
        needle: '#BBBBBB',
        thread: '#F5C518',
        stitch: '#F5C518',
        fabric1: '#E8DFD0',
        fabric2: '#D9CCBA',
        shine: 'rgba(255,255,255,0.18)',
        shadow: 'rgba(0,0,0,0.18)',
    };

    let t = 0; // animation time

    function round(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // Stitch trail data
    const stitches = [];

    function frame() {
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Scale to virtual 340×260
        const sx = W / 340;
        const sy = H / 260;
        ctx.save();
        ctx.scale(sx, sy);
        const vW = 340, vH = 260;

        // ── Fabric ──
        const fabY = 170;
        const fabH = 50;
        ctx.fillStyle = C.fabric1;
        round(10, fabY, 320, fabH, 4);
        ctx.fill();
        // Stripes
        for (let xi = 0; xi < 320; xi += 18) {
            ctx.fillStyle = C.fabric2;
            round(10 + xi, fabY, 9, fabH, 0);
            ctx.fill();
        }
        // Fabric shadow
        const fabGrad = ctx.createLinearGradient(0, fabY, 0, fabY + fabH);
        fabGrad.addColorStop(0, 'rgba(0,0,0,0.06)');
        fabGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fabGrad;
        round(10, fabY, 320, fabH, 4);
        ctx.fill();

        // ── Stitch trail ──
        const needleX = 120;
        const needleY = fabY + 10;
        // Record stitches every 12° of phase
        if (Math.floor(t * 30) % 12 === 0) {
            stitches.push({ x: needleX, alpha: 1 });
        }
        stitches.forEach(s => {
            // Move left to simulate fabric feeding right
            s.x -= 0.28;
            s.alpha -= 0.003;
        });
        // Remove old stitches
        while (stitches.length && stitches[0].alpha <= 0) stitches.shift();

        stitches.forEach(s => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, s.alpha);
            ctx.strokeStyle = C.stitch;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(s.x, needleY);
            ctx.lineTo(s.x, needleY + 12);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        });

        // ── Machine body ──
        // Base
        ctx.fillStyle = C.body;
        round(40, 100, 200, 80, 12);
        ctx.fill();

        // Body shine
        const bGrad = ctx.createLinearGradient(40, 100, 40, 180);
        bGrad.addColorStop(0, C.shine);
        bGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = bGrad;
        round(40, 100, 200, 80, 12);
        ctx.fill();

        // Arm (horizontal top)
        ctx.fillStyle = C.arm;
        round(80, 60, 160, 44, 10);
        ctx.fill();
        const aGrad = ctx.createLinearGradient(80, 60, 80, 104);
        aGrad.addColorStop(0, C.shine);
        aGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = aGrad;
        round(80, 60, 160, 44, 10);
        ctx.fill();

        // Head (right side)
        ctx.fillStyle = C.head;
        round(210, 50, 50, 120, 10);
        ctx.fill();

        // Head shine
        const hGrad = ctx.createLinearGradient(210, 50, 260, 50);
        hGrad.addColorStop(0, C.shine);
        hGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hGrad;
        round(210, 50, 50, 120, 10);
        ctx.fill();

        // Presser foot plate
        ctx.fillStyle = C.plate;
        round(110, 156, 24, 18, 4);
        ctx.fill();

        // Handwheel (right side of head)
        const wheelCx = 240, wheelCy = 80, wheelR = 22;
        // Outer ring
        ctx.beginPath();
        ctx.arc(wheelCx, wheelCy, wheelR, 0, Math.PI * 2);
        ctx.fillStyle = '#555';
        ctx.fill();
        // Spokes
        for (let i = 0; i < 6; i++) {
            const ang = t + (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(wheelCx, wheelCy);
            ctx.lineTo(
                wheelCx + Math.cos(ang) * (wheelR - 4),
                wheelCy + Math.sin(ang) * (wheelR - 4)
            );
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        // Center knob
        ctx.beginPath();
        ctx.arc(wheelCx, wheelCy, 7, 0, Math.PI * 2);
        ctx.fillStyle = C.chrome;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wheelCx, wheelCy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#CCC';
        ctx.fill();

        // ── Needle ──
        const needleBob = Math.sin(t * 6) * 18; // bob up/down
        const nx = needleX;
        const nyTop = 104;
        const nyBot = 155 + needleBob;
        ctx.beginPath();
        ctx.moveTo(nx, nyTop);
        ctx.lineTo(nx, nyBot);
        ctx.strokeStyle = C.needle;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Needle eye
        ctx.beginPath();
        ctx.ellipse(nx, nyBot - 4, 2.5, 5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // ── Thread from spool down to needle ──
        const spoolX = 165, spoolY = 55;
        ctx.beginPath();
        ctx.moveTo(spoolX, spoolY);
        ctx.quadraticCurveTo(spoolX - 20, 90, nx, nyBot - 4);
        ctx.strokeStyle = C.thread;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // ── Spool/bobbin (on top arm) ──
        ctx.fillStyle = C.plate;
        round(spoolX - 10, spoolY - 16, 20, 20, 4);
        ctx.fill();
        // Spool thread layers
        for (let layer = 0; layer < 4; layer++) {
            const ly = spoolY - 14 + layer * 4;
            ctx.fillStyle = C.thread;
            ctx.fillRect(spoolX - 8, ly, 16, 2);
        }

        // ── Small indicator lights ──
        [{ x: 60, y: 120, col: '#22C55E' }, { x: 76, y: 120, col: '#F5C518' }].forEach(led => {
            ctx.beginPath();
            ctx.arc(led.x, led.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = led.col;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(led.x - 1, led.y - 1, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fill();
        });

        // ── Drop shadow under machine ──
        const shadowGrad = ctx.createRadialGradient(140, 182, 5, 140, 182, 100);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.22)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(140, 185, 100, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        t += 0.022;
        requestAnimationFrame(frame);
    }

    frame();
})();

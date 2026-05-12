/**
 * Enfermera Landing Page – script.js
 * Características:
 *  - Navegación entre secciones (mostrar/ocultar paneles)
 *  - Botón de Acción Flotante (FAB) para redes sociales
 *  - Animación de fondo con canvas (partículas y cruces médicas)
 */

/* ============================================================
   1. NAVEGACIÓN
   ============================================================ */
(function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = 'section-' + this.dataset.section;
            const targetPanel = document.getElementById(targetId);
            if (!targetPanel) return;

            // Desactivar todos los paneles
            document.querySelectorAll('.content-panel').forEach(p => {
                p.classList.remove('active');
            });

            // Activar el panel objetivo
            targetPanel.classList.add('active');

            // Actualizar enlace activo
            navItems.forEach(n => n.classList.remove('active-link'));
            this.classList.add('active-link');
        });
    });
})();

/* ============================================================
   2. BOTÓN DE ACCIÓN FLOTANTE (FAB)
   ============================================================ */
(function initFAB() {
    const fabMain = document.getElementById('fab-main');
    const fabLinks = document.getElementById('fab-links');

    if (!fabMain || !fabLinks) return;

    fabMain.addEventListener('click', function () {
        const isOpen = fabLinks.classList.toggle('open');
        fabMain.classList.toggle('open', isOpen);
        fabMain.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!fabMain.contains(e.target) && !fabLinks.contains(e.target)) {
            fabLinks.classList.remove('open');
            fabMain.classList.remove('open');
            fabMain.setAttribute('aria-expanded', 'false');
        }
    });
})();

/* ============================================================
   3. CANVAS DE FONDO ANIMADO
   ============================================================ */
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ---- Sistema de partículas / orbes ---- */
    const PARTICLE_COUNT = 28;
    const particles = [];

    const COLORS = [
        'rgba(74,155,142,',   // sage
        'rgba(201,168,76,',   // gold
        'rgba(26,63,104,',    // navy-mid
        'rgba(110,198,184,',  // sage-light
    ];

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createParticle() {
        return {
            x: randomBetween(0, canvas.width),
            y: randomBetween(0, canvas.height),
            r: randomBetween(30, 110),
            dx: randomBetween(-0.25, 0.25),
            dy: randomBetween(-0.25, 0.25),
            alpha: randomBetween(0.04, 0.12),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            type: Math.random() > 0.75 ? 'cross' : 'circle',
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
    }

    /* Dibujar una cruz médica suave */
    function drawCross(x, y, size, color, alpha) {
        const arm = size * 0.28;
        const thickness = size * 0.1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color + '1)';
        ctx.beginPath();
        ctx.rect(x - thickness / 2, y - arm, thickness, arm * 2);
        ctx.rect(x - arm, y - thickness / 2, arm * 2, thickness);
        ctx.fill();
        ctx.restore();
    }

    /* Dibujar un orbe difuminado */
    function drawOrb(p) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.color + p.alpha + ')');
        grad.addColorStop(1, p.color + '0)');
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;

            if (p.x < -p.r) p.x = canvas.width + p.r;
            if (p.x > canvas.width + p.r) p.x = -p.r;
            if (p.y < -p.r) p.y = canvas.height + p.r;
            if (p.y > canvas.height + p.r) p.y = -p.r;

            if (p.type === 'cross') {
                drawCross(p.x, p.y, p.r, p.color, p.alpha * 1.4);
            } else {
                drawOrb(p);
            }
        });

        requestAnimationFrame(tick);
    }

    tick();
})();

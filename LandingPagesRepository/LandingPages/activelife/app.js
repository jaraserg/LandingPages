// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});


// ─── ELEMENTAL BACKGROUND ANIMATION ────────────────────────────────
(function () {
    const canvas = document.getElementById('elemental-bg');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    // SOUL — breathing luminous centre, deep violet
    function drawSoul(t) {
        const cx = W * 0.5, cy = H * 0.48;
        const p = (Math.sin(t * 0.00028) + 1) / 2;   // ~22s breath
        const r = 220 + p * 110, a = 0.032 * p + 0.008;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(180,120,255,${a})`);
        g.addColorStop(0.5, `rgba(110,60,200,${a * 0.4})`);
        g.addColorStop(1, 'rgba(60,20,120,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    }

    // FIRE — amber warmth, lower-right, 16s inhale
    function drawFire(t) {
        const cx = W * 0.78, cy = H * 0.7;
        const p = (Math.sin(t * 0.00038) + 1) / 2;
        const flick = Math.sin(t * 0.0013) * 0.012;
        const r = 160 + p * 90, a = (0.045 + flick) * p + 0.005;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(255,155,50,${a})`);
        g.addColorStop(0.45, `rgba(210,80,20,${a * 0.5})`);
        g.addColorStop(1, 'rgba(140,30,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    }

    // EARTH — mossy green, lower-left, 35s pulse
    function drawEarth(t) {
        const cx = W * 0.18, cy = H * 0.82;
        const p = (Math.sin(t * 0.00018) + 1) / 2;
        const r = 200 + p * 70, a = 0.05 * p + 0.008;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(60,130,50,${a})`);
        g.addColorStop(0.6, `rgba(35,90,30,${a * 0.5})`);
        g.addColorStop(1, 'rgba(15,50,10,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    }

    // AIR — translucent orbs drifting slowly upward
    const ORBS = Array.from({ length: 7 }, () => ({
        x: Math.random(), y: Math.random(),
        r: 50 + Math.random() * 70,
        sx: (Math.random() - 0.5) * 0.025,
        sy: -(0.018 + Math.random() * 0.022),
        ph: Math.random() * Math.PI * 2,
    }));
    function drawAir(t) {
        ORBS.forEach(o => {
            o.x += o.sx / W + Math.sin(t * 0.0003 + o.ph) * 0.00008;
            o.y += o.sy / H;
            if (o.y < -o.r / H) { o.y = 1 + o.r / H; o.x = Math.random(); }
            const a = Math.max(0, 0.018 + Math.sin(t * 0.0007 + o.ph) * 0.01);
            const g = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
            g.addColorStop(0, `rgba(210,235,255,${a})`);
            g.addColorStop(1, 'rgba(180,220,255,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2); ctx.fill();
        });
    }

    // WIND — slow sinusoidal curves (element of movement)
    const LINES = Array.from({ length: 4 }, (_, i) => ({
        yF: 0.15 + (i / 3) * 0.65, ph: Math.random() * Math.PI * 2,
        sp: 0.00008 + Math.random() * 0.00006,
        amp: 25 + Math.random() * 45, fr: 0.006 + Math.random() * 0.003,
    }));
    function drawWind(t) {
        ctx.save();
        LINES.forEach(l => {
            const a = Math.max(0, 0.028 + Math.sin(t * 0.0004 + l.ph) * 0.014);
            ctx.strokeStyle = `rgba(200,235,215,${a})`; ctx.lineWidth = 1;
            ctx.beginPath();
            for (let px = 0; px <= W; px += 3) {
                const py = l.yF * H + Math.sin(px * l.fr + t * l.sp + l.ph) * l.amp;
                px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.stroke();
        });
        ctx.restore();
    }

    function draw(ts) {
        ctx.clearRect(0, 0, W, H);
        drawEarth(ts); drawFire(ts); drawSoul(ts); drawAir(ts); drawWind(ts);
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}());

// Flip Card Interaction
const flipCards = document.querySelectorAll('.flip-card-container');
flipCards.forEach(cardContainer => {
    cardContainer.addEventListener('click', () => {
        cardContainer.classList.toggle('flipped');
    });
});

// Floating Action Button (FAB) toggle
const fabContainer = document.getElementById('fabContainer');
const fabMain = document.getElementById('fabMain');
const fabMap = document.getElementById('fabMap');
const mapModal = document.getElementById('mapModal');
const mapModalClose = document.getElementById('mapModalClose');

if (fabMain) {
    fabMain.addEventListener('click', (e) => {
        e.stopPropagation();
        fabContainer.classList.toggle('open');
    });

    // Close FAB when clicking anywhere else on the page
    document.addEventListener('click', () => {
        fabContainer.classList.remove('open');
    });

    // Prevent FAB items from closing when clicking inside the container
    fabContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Map modal functionality
if (fabMap && mapModal && mapModalClose) {
    // Open map modal
    fabMap.addEventListener('click', (e) => {
        e.stopPropagation();
        mapModal.classList.add('active');
        fabContainer.classList.remove('open');

        // Initialize map if not already initialized
        if (!window.mapInitialized) {
            initializeMap();
            window.mapInitialized = true;
        }
    });

    // Close map modal
    mapModalClose.addEventListener('click', () => {
        mapModal.classList.remove('active');
    });

    // Close modal when clicking outside content
    mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.classList.remove('active');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mapModal.classList.contains('active')) {
            mapModal.classList.remove('active');
        }
    });
}

// Initialize Leaflet map
function initializeMap() {
    // Medellin coordinates: 6.2442° N, 75.5812° W
    const medellinCoords = [6.2442, -75.5812];

    // Create map instance
    const map = L.map('map').setView(medellinCoords, 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add custom marker for Medellin
    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div style="
                background: #2196F3;
                color: white;
                padding: 10px;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
            ">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    L.marker(medellinCoords, { icon: customIcon }).addTo(map)
        .bindPopup('<b>Medellín, Colombia</b><br>Ciudad de la eternal primavera')
        .openPopup();

    // Add circle around Medellin to highlight the area
    L.circle(medellinCoords, {
        color: '#2196F3',
        fillColor: '#2196F3',
        fillOpacity: 0.1,
        radius: 3000
    }).addTo(map);

    // Store map instance for later use
    window.activeLifeMap = map;
}



// Header scroll effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections with reveal animation
const revealSections = document.querySelectorAll('.section-reveal');
revealSections.forEach(section => observer.observe(section));

// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('.nav-link, .cta-button, .footer-menu a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});



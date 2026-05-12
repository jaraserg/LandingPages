/* ─────────────────────────────────────────────────────────
   app.js — Background animation + scroll effects + typing
───────────────────────────────────────────────────────── */

/* ══════════════════════════════════════════════════════
   1. CANVAS BACKGROUND ANIMATION
══════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  const COLORS = ['#6c63ff', '#f5c518', '#00d4aa', '#ff6b6b'];
  const PARTICLE_COUNT = 70;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  window.addEventListener('resize', () => { resize(); });
  init();
})();


/* ══════════════════════════════════════════════════════
   2. TYPING EFFECT
══════════════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = ['Desarrollador', 'Diseñador', 'Creador', 'Innovador'];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }

  setTimeout(type, 1200);
})();


/* ══════════════════════════════════════════════════════
   3. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════════════════ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-child');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        const delay = entry.target.classList.contains('reveal-child')
          ? (Array.from(entry.target.parentElement.querySelectorAll('.reveal-child')).indexOf(entry.target)) * 100
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Animate skill bars when visible
          const bar = entry.target.querySelector('.skill-bar-fill');
          if (bar) bar.style.width = bar.dataset.width + '%';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Also trigger skill bars inside already-visible sections
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const parentReveal = bar.closest('.reveal-child');
    if (!parentReveal) {
      // Observe the bar itself
      const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.width + '%';
            barObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      barObserver.observe(bar);
    }
  });
})();


/* ══════════════════════════════════════════════════════
   4. NAVBAR — scroll class + active link + hamburger
══════════════════════════════════════════════════════ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link highlight
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  updateActiveLink();
})();


/* ══════════════════════════════════════════════════════
   5. FOOTER YEAR
══════════════════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ══════════════════════════════════════════════════════
   6. SMOOTH SCROLL (fallback for older browsers)
══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

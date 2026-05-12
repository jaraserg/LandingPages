document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Smooth lag for dot
        dotX += (mouseX - dotX) * 0.4;
        dotY += (mouseY - dotY) * 0.4;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        // More lag for outline
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn-primary, .btn-secondary');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
    });

    // Hero Parallax Move
    const heroSection = document.querySelector('#hero');
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroBg) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroBg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
            heroContent.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    // Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // Simple Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Transmission Received...';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.pointerEvents = 'all';
                submitBtn.style.opacity = '1';
                alert('Project inquiry successfully transmitted to StructCore.');
            }, 1500);
        });
    }
});

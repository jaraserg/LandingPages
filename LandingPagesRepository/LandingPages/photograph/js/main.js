/**
 * Studio Noir - Photography Portfolio
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all modules
    initThemeToggle();
    initCustomCursor();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initWorksFilter();
    initContactForm();
    initCounters();
    initParallax();
});

/**
 * Theme Toggle (Light/Dark Mode)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Add transition class for smooth color changes
            document.body.classList.add('theme-transitioning');
            
            // Update theme
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Remove transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 400);
            
            // Animate the toggle button
            gsap.fromTo(themeToggle, 
                { rotation: 0 },
                { rotation: 360, duration: 0.5, ease: 'power2.out' }
            );
        });
    }
    
    // Check for system preference on first load
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
        }
    });
}

/**
 * Custom Cursor with Shutter Effect
 */
function initCustomCursor() {
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        document.body.style.cursor = 'auto';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    let innerX = 0;
    let innerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Outer cursor follows with delay
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
        cursorOuter.style.left = outerX + 'px';
        cursorOuter.style.top = outerY + 'px';

        // Inner cursor follows closely
        innerX += (mouseX - innerX) * 0.25;
        innerY += (mouseY - innerY) * 0.25;
        cursorInner.style.left = innerX + 'px';
        cursorInner.style.top = innerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('[data-cursor="hover"]');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOuter.classList.add('hover');
            cursorInner.style.opacity = '0';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOuter.classList.remove('hover');
            cursorInner.style.opacity = '1';
        });
    });
}

/**
 * Navigation
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;
    let ticking = false;

    // Hide/show navigation on scroll
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    if (currentScroll > lastScroll) {
                        nav.classList.add('hidden');
                    } else {
                        nav.classList.remove('hidden');
                    }
                } else {
                    nav.classList.remove('hidden');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navToggle) {
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
}

/**
 * Hero Animations
 */
function initHeroAnimations() {
    const heroTitle = document.querySelectorAll('.title-line');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const heroImage = document.querySelector('.hero-image');
    const imageReveal = document.querySelector('.image-reveal');

    // Timeline for hero entrance
    const heroTl = gsap.timeline({ delay: 0.3 });

    // Image reveal
    heroTl.fromTo(imageReveal, 
        { clipPath: 'inset(0 100% 0 0)' },
        { 
            clipPath: 'inset(0 0% 0 0)', 
            duration: 1.2, 
            ease: 'power3.inOut' 
        }
    );

    // Title lines stagger
    heroTl.fromTo(heroTitle, 
        { y: '100%', opacity: 0 },
        { 
            y: '0%', 
            opacity: 1, 
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out'
        },
        '-=0.8'
    );

    // Subtitle
    heroTl.fromTo(heroSubtitle,
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            ease: 'power2.out'
        },
        '-=0.6'
    );

    // CTA button
    heroTl.fromTo(heroCta,
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            ease: 'power2.out'
        },
        '-=0.4'
    );

    // Scroll parallax for hero image
    if (heroImage) {
        gsap.to(heroImage, {
            y: 150,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // Text fade out on scroll
    gsap.to('.hero-content', {
        opacity: 0,
        y: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '50% top',
            scrub: 1
        }
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    // About section animations
    gsap.fromTo('.about-image', 
        { x: -100, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.about-content > *', 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Works section animations
    gsap.fromTo('.works-header > *', 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.works-header',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.works-filter', 
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.works-filter',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Work items stagger
    gsap.fromTo('.work-item', 
        { y: 80, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.works-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Contact section animations
    gsap.fromTo('.contact-info > *', 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.contact-form-wrapper', 
        { x: 100, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
}

/**
 * Works Filter
 */
function initWorksFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Animate items
            workItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        display: 'block'
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.5,
                        ease: 'power2.in',
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // Work item hover effects
    workItems.forEach(item => {
        const img = item.querySelector('img');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.1,
                filter: 'grayscale(0%)',
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                filter: 'grayscale(100%)',
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form?.querySelector('.btn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (submitBtn) {
            submitBtn.classList.add('loading');
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            // Reset after showing success
            setTimeout(() => {
                submitBtn.classList.remove('success');
                form.reset();
            }, 2000);
        }
    });

    // Form field animations
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        
        input.addEventListener('focus', () => {
            gsap.to(group.querySelector('.form-line'), {
                width: '100%',
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                gsap.to(group.querySelector('.form-line'), {
                    width: '0%',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    });
}

/**
 * Counter Animation
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeProgress * (target - start) + start);
            
            counter.textContent = current + '+';
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        // Start animation when in view
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                requestAnimationFrame(updateCounter);
            },
            once: true
        });
    });
}

/**
 * Parallax Effects
 */
function initParallax() {
    // About image parallax
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        gsap.to(aboutImage, {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    // Stats parallax
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        gsap.to(stat, {
            y: (index % 2 === 0 ? -30 : 30),
            ease: 'none',
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

/**
 * Smooth Scroll for Back to Top
 */
document.querySelector('.back-to-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/**
 * Reduced Motion Support
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable GSAP animations
    gsap.globalTimeline.clear();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Show all elements immediately
    document.querySelectorAll('[data-reveal]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

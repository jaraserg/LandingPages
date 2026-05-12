/**
 * Systems Engineer Portfolio - Main JavaScript
 * Jarvis AI Animation, Non-linear Transitions, Interactive Features
 */

(function () {
    'use strict';

    // ==========================================
    // Jarvis AI Animation (Three.js)
    // ==========================================
    class JarvisAnimation {
        constructor() {
            this.canvas = document.getElementById('jarvis-canvas');
            this.init();
        }

        init() {
            if (!this.canvas) return;

            this.scene = new THREE.Scene();
            const aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
            this.camera.position.z = 5;

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            this.createCore();
            this.createOrbits();
            this.createParticles();
            this.setupLighting();

            this.animate();
            window.addEventListener('resize', () => this.onResize());
        }

        createCore() {
            // Main glowing core
            const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32);
            const coreMaterial = new THREE.MeshBasicMaterial({
                color: 0x22d3ee,
                transparent: true,
                opacity: 0.9
            });
            this.core = new THREE.Mesh(coreGeometry, coreMaterial);
            this.scene.add(this.core);

            // Inner glow
            const innerGlow = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                })
            );
            this.core.add(innerGlow);

            // Outer ring
            const ringGeometry = new THREE.TorusGeometry(0.6, 0.02, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x22d3ee,
                transparent: true,
                opacity: 0.6
            });
            this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
            this.ring.rotation.x = Math.PI / 2;
            this.scene.add(this.ring);

            // Second ring
            this.ring2 = new THREE.Mesh(
                new THREE.TorusGeometry(0.7, 0.015, 16, 100),
                new THREE.MeshBasicMaterial({
                    color: 0x3b82f6,
                    transparent: true,
                    opacity: 0.4
                })
            );
            this.ring2.rotation.x = Math.PI / 3;
            this.ring2.rotation.y = Math.PI / 4;
            this.scene.add(this.ring2);
        }

        createOrbits() {
            this.orbits = [];
            const colors = [0x22d3ee, 0x3b82f6, 0x06b6d4];

            for (let i = 0; i < 3; i++) {
                const orbitGroup = new THREE.Group();

                const pathGeometry = new THREE.TorusGeometry(1 + i * 0.3, 0.005, 8, 100);
                const pathMaterial = new THREE.MeshBasicMaterial({
                    color: colors[i],
                    transparent: true,
                    opacity: 0.2
                });
                const path = new THREE.Mesh(pathGeometry, pathMaterial);
                path.rotation.x = Math.PI / 2 + i * 0.3;
                orbitGroup.add(path);

                const electronGeometry = new THREE.SphereGeometry(0.05, 16, 16);
                const electronMaterial = new THREE.MeshBasicMaterial({
                    color: colors[i]
                });
                const electron = new THREE.Mesh(electronGeometry, electronMaterial);
                electron.position.x = 1 + i * 0.3;
                orbitGroup.add(electron);

                this.orbits.push({
                    group: orbitGroup,
                    electron: electron,
                    angle: (i * Math.PI * 2) / 3,
                    speed: 0.5 + i * 0.2,
                    radius: 1 + i * 0.3,
                    tilt: Math.PI / 2 + i * 0.3
                });

                this.scene.add(orbitGroup);
            }
        }

        createParticles() {
            const particleCount = 80;
            const positions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                color: 0x22d3ee,
                size: 0.02,
                transparent: true,
                opacity: 0.6
            });

            this.particles = new THREE.Points(geometry, material);
            this.scene.add(this.particles);
        }

        setupLighting() {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            this.scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0x22d3ee, 1, 10);
            pointLight.position.set(2, 2, 2);
            this.scene.add(pointLight);
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            const time = Date.now() * 0.001;

            if (this.core) {
                this.core.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
                this.core.material.opacity = 0.7 + Math.sin(time * 2) * 0.2;
            }

            if (this.ring) this.ring.rotation.z = time * 0.5;
            if (this.ring2) this.ring2.rotation.z = -time * 0.3;

            this.orbits.forEach((orbit) => {
                orbit.angle += orbit.speed * 0.02;
                orbit.electron.position.x = Math.cos(orbit.angle) * orbit.radius;
                orbit.electron.position.y = Math.sin(orbit.angle) * orbit.radius;
                orbit.group.rotation.x = orbit.tilt + Math.sin(time * 0.5) * 0.1;
                orbit.group.rotation.z = time * 0.2;
            });

            if (this.particles) {
                this.particles.rotation.y = time * 0.05;
            }

            this.camera.position.x = Math.sin(time * 0.2) * 0.3;
            this.camera.position.y = Math.cos(time * 0.15) * 0.2;
            this.camera.lookAt(0, 0, 0);

            this.renderer.render(this.scene, this.camera);
        }

        onResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }

    // ==========================================
    // Mobile Menu
    // ==========================================
    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuBtn || !mobileMenu) return;

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
            menuBtn.setAttribute('aria-expanded', !mobileMenu.classList.contains('hidden'));
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ==========================================
    // Reveal on Scroll
    // ==========================================
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-text');

        if (!revealElements.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            revealElements.forEach(el => observer.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('revealed'));
        }
    }

    // ==========================================
    // Header Scroll
    // ==========================================
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ==========================================
    // Smooth Scroll
    // ==========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 64;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    // ==========================================
    // Form Validation
    // ==========================================
    function initForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const submitBtn = document.getElementById('submit-btn');
        const successMessage = document.getElementById('success-message');

        const validators = {
            name: (value) => {
                if (!value.trim()) return 'Name is required';
                return null;
            },
            email: (value) => {
                if (!value.trim()) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email required';
                return null;
            },
            message: (value) => {
                if (!value.trim()) return 'Message is required';
                return null;
            }
        };

        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            const errorEl = formGroup.querySelector('.error-message');
            formGroup.classList.add('error');
            if (errorEl) errorEl.textContent = message;
        }

        function clearError(input) {
            input.closest('.form-group').classList.remove('error');
        }

        [nameInput, emailInput, messageInput].forEach(input => {
            if (!input) return;
            input.addEventListener('blur', () => {
                const error = validators[input.name](input.value);
                if (error) showError(input, error);
                else clearError(input);
            });
            input.addEventListener('input', () => clearError(input));
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let hasError = false;
            [nameInput, emailInput, messageInput].forEach(input => {
                if (!input) return;
                const error = validators[input.name](input.value);
                if (error) {
                    showError(input, error);
                    hasError = true;
                }
            });

            if (hasError) return;

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } catch (error) {
                console.error('Form error:', error);
                alert('Something went wrong. Please try again.');
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    // ==========================================
    // Lazy Loading
    // ==========================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px' });

            images.forEach(img => observer.observe(img));
        } else {
            images.forEach(img => img.classList.add('loaded'));
        }
    }

    // ==========================================
    // Initialize
    // ==========================================
    function init() {
        new JarvisAnimation();
        initMobileMenu();
        initRevealAnimations();
        initHeaderScroll();
        initSmoothScroll();
        initForm();
        initLazyLoading();

        console.log('%c🚀 Systems Engineer Portfolio', 'color: #22d3ee; font-size: 16px; font-weight: bold;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

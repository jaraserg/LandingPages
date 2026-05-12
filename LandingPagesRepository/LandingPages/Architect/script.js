// script.js - Solar Bello Architecture - Minimalist Design

(function() {
    'use strict';

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
            
            const isExpanded = !mobileMenu.classList.contains('hidden');
            menuBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================
    // Service Flip Cards
    // ==========================================
    function initServiceFlipCards() {
        const cards = document.querySelectorAll('.service-flip-card');
        
        cards.forEach(card => {
            // Click to flip
            card.addEventListener('click', function(e) {
                // Don't flip if clicking the back button
                if (e.target.closest('button')) return;
                this.classList.toggle('flipped');
            });
            
            // Keyboard accessibility
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Don't flip if clicking the back button
                    if (e.target.closest('button')) return;
                    this.classList.toggle('flipped');
                }
            });
        });
    }

    // ==========================================
    // Form Validation & Submission
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
                if (!value.trim()) return 'El nombre es requerido';
                if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
                return null;
            },
            email: (value) => {
                if (!value.trim()) return 'El email es requerido';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Por favor ingresa un email válido';
                return null;
            },
            message: (value) => {
                if (!value.trim()) return 'El mensaje es requerido';
                if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
                return null;
            }
        };

        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            const errorEl = formGroup.querySelector('.error-message');
            
            formGroup.classList.add('error');
            if (errorEl) {
                errorEl.textContent = message;
            }
        }

        function clearError(input) {
            const formGroup = input.closest('.form-group');
            formGroup.classList.remove('error');
        }

        // Real-time validation on blur
        [nameInput, emailInput, messageInput].forEach(input => {
            if (!input) return;
            
            input.addEventListener('blur', () => {
                const field = input.name;
                const error = validators[field](input.value);
                if (error) {
                    showError(input, error);
                } else {
                    clearError(input);
                }
            });

            input.addEventListener('input', () => {
                clearError(input);
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let hasError = false;
            [nameInput, emailInput, messageInput].forEach(input => {
                if (!input) return;
                const field = input.name;
                const error = validators[field](input.value);
                if (error) {
                    showError(input, error);
                    hasError = true;
                }
            });

            if (hasError) {
                // Focus first error
                const firstError = form.querySelector('.error input, .error textarea');
                if (firstError) firstError.focus();
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            // Simulate API call
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Algo salió mal. Por favor intenta de nuevo.');
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }



    // ==========================================
    // Watercolor Image Reveal Effect
    // ==========================================
    function initWatercolorReveal() {
        const heroImage = document.querySelector('.hero-image');
        const projectImages = document.querySelectorAll('#projects article .aspect-\\[4\\/5\\]');
        const flipCards = document.querySelectorAll('.service-flip-card-front');
        const aboutImage = document.querySelector('#about .aspect-\\[4\\/5\\]');

        // Hero image reveal - slow and delayed
        if (heroImage) {
            setTimeout(() => {
                heroImage.classList.add('revealed');
            }, 800);
        }

        // Project cards reveal with stagger - slower
        projectImages.forEach((container, index) => {
            setTimeout(() => {
                container.classList.add('revealed');
            }, 1200 + (index * 400));
        });

        // Flip cards reveal with stagger - slower
        flipCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('revealed');
            }, 2000 + (index * 300));
        });

        // About section image reveal - slower
        if (aboutImage) {
            setTimeout(() => {
                aboutImage.classList.add('revealed');
            }, 1500);
        }

        // Intersection Observer for scroll-triggered reveals
        const revealElements = document.querySelectorAll('.service-flip-card-front, #projects article .aspect-\\[4\\/5\\], #about .aspect-\\[4\\/5\\]');
        
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        }
    }

    // ==========================================
    // Header Shadow on Scroll
    // ==========================================
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 10) {
                header.classList.add('shadow-sm');
            } else {
                header.classList.remove('shadow-sm');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ==========================================
    // Initialize Everything
    // ==========================================
    function init() {
        initMobileMenu();
        initServiceFlipCards();
        initForm();
        initWatercolorReveal();
        initHeaderScroll();

        // Console greeting
        console.log('%c🏛️ Solar Bello Architecture', 'color: #059669; font-size: 18px; font-weight: bold;');
        console.log('%cSustainable by design. Built with passion.', 'color: #737373; font-size: 12px;');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

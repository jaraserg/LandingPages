/**
 * Blade & Co. - Landing Page con Scroll Horizontal Suave
 * Transiciones no lineales con física de resorte
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        scrollSpeed: 0.8,
        springTension: 100,
        springFriction: 20,
        snapThreshold: 0.3,
        touchSensitivity: 1.2
    };

    // Elementos DOM
    const container = document.querySelector('.horizontal-scroll-container');
    const sections = document.querySelectorAll('.section');
    const indicators = document.querySelectorAll('.indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressFill = document.querySelector('.progress-fill');
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Estado
    let currentSection = 0;
    let isScrolling = false;
    let targetScroll = 0;
    let currentScroll = 0;
    let scrollVelocity = 0;
    let animationId = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchX = 0;
    let isTouching = false;

    // Física de resorte para transiciones suaves no lineales
    class SpringAnimation {
        constructor(tension = 170, friction = 26) {
            this.tension = tension;
            this.friction = friction;
        }

        update(current, target, velocity) {
            const displacement = target - current;
            const springForce = displacement * this.tension;
            const dampingForce = velocity * this.friction;
            const acceleration = springForce - dampingForce;
            
            const newVelocity = velocity + acceleration * 0.016;
            const newPosition = current + newVelocity * 0.016;
            
            return { position: newPosition, velocity: newVelocity };
        }
    }

    const spring = new SpringAnimation(CONFIG.springTension, CONFIG.springFriction);

    // Inicialización
    function init() {
        setupEventListeners();
        setupFaceShapeGuide();
        setupBookingForm();
        setupNavbarScroll();
        updateProgress();
        animate();
    }

    // Event Listeners
    function setupEventListeners() {
        // Eventos de rueda/scroll con listener pasivo para rendimiento
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        // Eventos táctiles para móvil
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Navegación por teclado
        document.addEventListener('keydown', handleKeyboard);
        
        // Clicks en indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => scrollToSection(index));
        });
        
        // Clicks en enlaces de navegación y botón Reservar
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const index = Array.from(sections).indexOf(targetSection);
                    scrollToSection(index);
                }
                // Cerrar menú móvil si está abierto
                mobileMenu.classList.remove('active');
            });
        });
        
        // Botón Reservar en navbar
        const navCta = document.querySelector('.nav-cta');
        if (navCta) {
            navCta.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = navCta.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const index = Array.from(sections).indexOf(targetSection);
                    scrollToSection(index);
                }
            });
        }
        
        // Toggle menú móvil
        mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
        
        // Enlaces del menú móvil
        document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const index = Array.from(sections).indexOf(targetSection);
                    scrollToSection(index);
                }
                mobileMenu.classList.remove('active');
            });
        });

        // Manejar redimensionamiento de ventana y zoom
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalcular posición de scroll
                targetScroll = currentSection * window.innerWidth;
                currentScroll = targetScroll;
                container.style.transform = `translateX(-${currentScroll}px)`;
                
                // Ajustar altura de secciones si es necesario
                sections.forEach(section => {
                    section.style.minHeight = window.innerHeight + 'px';
                });
            }, 100);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Detectar cambios de zoom
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        // Manejar cambio de visibilidad para rendimiento
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // Manejador de rueda con interpolación suave
    function handleWheel(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const delta = Math.sign(e.deltaY || e.deltaX);
        const newSection = Math.max(0, Math.min(sections.length - 1, currentSection + delta));
        
        if (newSection !== currentSection) {
            scrollToSection(newSection);
        }
    }

    // Manejadores táctiles para gestos de deslizamiento
    function handleTouchStart(e) {
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastTouchX = touchStartX;
    }

    function handleTouchMove(e) {
        if (!isTouching) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;
        
        // Prevenir scroll vertical cuando hay scroll horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
        }
        
        lastTouchX = touchX;
    }

    function handleTouchEnd(e) {
        if (!isTouching) return;
        
        isTouching = false;
        const deltaX = touchStartX - lastTouchX;
        const threshold = window.innerWidth * 0.15;
        
        if (Math.abs(deltaX) > threshold) {
            const direction = deltaX > 0 ? 1 : -1;
            const newSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
            scrollToSection(newSection);
        }
    }

    // Navegación por teclado
    function handleKeyboard(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            const newSection = Math.min(sections.length - 1, currentSection + 1);
            scrollToSection(newSection);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const newSection = Math.max(0, currentSection - 1);
            scrollToSection(newSection);
        } else if (e.key === 'Home') {
            e.preventDefault();
            scrollToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            scrollToSection(sections.length - 1);
        } else if (e.key === 'Escape') {
            mobileMenu.classList.remove('active');
        }
    }

    // Scroll a sección específica con física de resorte
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        currentSection = index;
        targetScroll = index * window.innerWidth;
        isScrolling = true;
        
        // Actualizar estados activos
        updateActiveStates();
        
        // Reiniciar velocidad para animación fresca
        scrollVelocity = 0;
    }

    // Bucle de animación con física de resorte
    function animate() {
        const { position, velocity } = spring.update(currentScroll, targetScroll, scrollVelocity);
        
        currentScroll = position;
        scrollVelocity = velocity;
        
        // Aplicar transformación
        container.style.transform = `translateX(-${currentScroll}px)`;
        
        // Verificar si la animación está completa
        const isSettled = Math.abs(targetScroll - currentScroll) < 0.5 && Math.abs(scrollVelocity) < 0.5;
        
        if (isSettled && isScrolling) {
            currentScroll = targetScroll;
            container.style.transform = `translateX(-${currentScroll}px)`;
            isScrolling = false;
            scrollVelocity = 0;
        }
        
        // Actualizar progreso
        updateProgress();
        
        // Continuar animación
        animationId = requestAnimationFrame(animate);
    }

    // Actualizar estados activos para indicadores y nav
    function updateActiveStates() {
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSection);
        });
        
        // Actualizar enlaces de navegación
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const targetSection = document.querySelector(href);
            const index = Array.from(sections).indexOf(targetSection);
            link.classList.toggle('active', index === currentSection);
        });
    }

    // Actualizar barra de progreso
    function updateProgress() {
        const maxScroll = (sections.length - 1) * window.innerWidth;
        const progress = (currentScroll / maxScroll) * 100;
        progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }

    // Configurar Guía de Formas Faciales
    function setupFaceShapeGuide() {
        const shapeBtns = document.querySelectorAll('.shape-btn');
        const shapeContents = document.querySelectorAll('.shape-content');
        
        shapeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const shape = btn.dataset.shape;
                
                // Actualizar botón activo
                shapeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Actualizar contenido activo con animación
                shapeContents.forEach(content => {
                    if (content.dataset.shape === shape) {
                        content.classList.add('active');
                        animateShapeContent(content);
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Animar entrada de contenido de forma
    function animateShapeContent(content) {
        const elements = content.querySelectorAll('.shape-image, .shape-info > *');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Configurar Formulario de Reserva con WhatsApp
    function setupBookingForm() {
        const form = document.getElementById('bookingForm');
        const whatsappBtn = document.getElementById('whatsappBtn');
        const phoneNumber = '15551234567'; // Reemplazar con número real de WhatsApp
        
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                const name = document.getElementById('name').value;
                const phone = document.getElementById('phone').value;
                const service = document.getElementById('service').value;
                const date = document.getElementById('date').value;
                
                if (!name || !phone || !service || !date) {
                    e.preventDefault();
                    alert('Por favor completa todos los campos');
                    return;
                }
                
                const message = `¡Hola! Quiero agendar una cita en Blade & Co.

📋 Detalles de la reserva:
👤 Nombre: ${name}
📱 Teléfono: ${phone}
✂️ Servicio: ${service}
📅 Fecha: ${date}

Espero confirmación. ¡Gracias!`;
                
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                whatsappBtn.href = whatsappUrl;
            });
        }
    }

    // Configurar efecto de scroll en navbar
    function setupNavbarScroll() {
        let lastScrollY = 0;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navbar.classList.remove('scrolled');
                    } else {
                        navbar.classList.add('scrolled');
                    }
                });
            },
            { threshold: 0.9 }
        );
        
        // Observar sección hero
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    // Toggle menú móvil
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        
        // Animar hamburguesa
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    }

    // Intersection Observer para animaciones de sección
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    animateSection(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animar elementos de sección
    function animateSection(section) {
        const animatedElements = section.querySelectorAll(
            '.service-card, .barber-card, .gallery-item, .shape-content'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Polyfill de scroll suave para navegadores antiguos
    if (!('scrollBehavior' in document.documentElement.style)) {
        import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
            .then(() => {
                window.__forceSmoothScrollPolyfill__ = true;
            })
            .catch(() => {
                console.log('Polyfill de scroll suave no cargado');
            });
    }

    // Inicializar cuando el DOM está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer función de scroll globalmente para depuración
    window.scrollToSection = scrollToSection;

})();

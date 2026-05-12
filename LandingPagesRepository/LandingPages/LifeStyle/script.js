/* ========================================
   Vibrant Life - Lifestyle Community
   JavaScript - Zoom Scroll & Game Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Section Navigation with Zoom Scroll
    // ========================================

    const sections = ['hero', 'about', 'events', 'game', 'contact'];
    let currentSectionIndex = 0;
    let isScrolling = false;
    let scrollTimeout;

    const sectionElements = document.querySelectorAll('.section');
    const progressDots = document.querySelectorAll('.progress-dot');
    const navLinks = document.querySelectorAll('.nav-link');
    const footer = document.querySelector('.main-footer');

    // Initialize sections
    function initSections() {
        sectionElements.forEach((section, index) => {
            section.classList.remove('active', 'prev', 'next');
            if (index === currentSectionIndex) {
                section.classList.add('active');
            } else if (index < currentSectionIndex) {
                section.classList.add('prev');
            } else {
                section.classList.add('next');
            }
        });

        updateProgressDots();
        updateNavLinks();
        updateFooterVisibility();
    }

    // Navigate to specific section
    function navigateToSection(sectionId) {
        const targetIndex = sections.indexOf(sectionId);
        if (targetIndex === -1 || targetIndex === currentSectionIndex) return;

        const direction = targetIndex > currentSectionIndex ? 'next' : 'prev';

        // Remove all classes first
        sectionElements.forEach(section => {
            section.classList.remove('active', 'prev', 'next');
        });

        // Set appropriate classes based on direction
        sectionElements.forEach((section, index) => {
            if (index === targetIndex) {
                section.classList.add('active');
            } else if (index < targetIndex) {
                section.classList.add('prev');
            } else {
                section.classList.add('next');
            }
        });

        currentSectionIndex = targetIndex;
        updateProgressDots();
        updateNavLinks();
        updateFooterVisibility();
    }

    // Update progress dots
    function updateProgressDots() {
        progressDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSectionIndex);
        });
    }

    // Update navigation links
    function updateNavLinks() {
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('data-section');
            link.classList.toggle('active', sections.indexOf(sectionId) === currentSectionIndex);
        });
    }

    // Update footer visibility
    function updateFooterVisibility() {
        const isContactSection = currentSectionIndex === sections.indexOf('contact');
        footer.classList.toggle('visible', isContactSection);
    }

    // Handle scroll/wheel events for zoom navigation
    function handleWheel(event) {
        event.preventDefault();

        if (isScrolling) return;

        const delta = event.deltaY;
        const threshold = 50;

        if (Math.abs(delta) < threshold) return;

        isScrolling = true;

        if (delta > 0 && currentSectionIndex < sections.length - 1) {
            // Scroll down - go to next section
            navigateToSection(sections[currentSectionIndex + 1]);
        } else if (delta < 0 && currentSectionIndex > 0) {
            // Scroll up - go to previous section
            navigateToSection(sections[currentSectionIndex - 1]);
        }

        // Reset scrolling flag after animation
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // Touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchEnd(event) {
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0 && currentSectionIndex < sections.length - 1) {
            // Swipe up - go to next section
            navigateToSection(sections[currentSectionIndex + 1]);
        } else if (diff < 0 && currentSectionIndex > 0) {
            // Swipe down - go to previous section
            navigateToSection(sections[currentSectionIndex - 1]);
        }
    }

    // Keyboard navigation
    function handleKeydown(event) {
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
            event.preventDefault();
            if (currentSectionIndex < sections.length - 1) {
                navigateToSection(sections[currentSectionIndex + 1]);
            }
        } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
            event.preventDefault();
            if (currentSectionIndex > 0) {
                navigateToSection(sections[currentSectionIndex - 1]);
            }
        } else if (event.key === 'Home') {
            event.preventDefault();
            navigateToSection(sections[0]);
        } else if (event.key === 'End') {
            event.preventDefault();
            navigateToSection(sections[sections.length - 1]);
        }
    }

    // Event listeners for navigation
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeydown);

    // Progress dot click navigation
    progressDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionId = dot.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Nav link click navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Footer link navigation
    const footerLinks = document.querySelectorAll('.footer-links a[data-section]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // ========================================
    // Mobile Menu
    // ========================================

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
            closeMobileMenu();
        });
    });

    // ========================================
    // Memory Card Game
    // ========================================

    const gameCards = document.querySelectorAll('.game-card');
    const matchCountEl = document.getElementById('match-count');
    const tipRevealEl = document.getElementById('tip-reveal');
    const tipTextEl = document.getElementById('tip-text');
    const resetGameBtn = document.getElementById('reset-game');

    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;

    // Wellness tips for each match
    const wellnessTips = {
        1: "Start your day with 10 minutes of morning sunlight to boost your mood and energy levels naturally.",
        2: "Practice gratitude daily - write down 3 things you're thankful for each morning.",
        3: "Stay hydrated! Aim for 8 glasses of water daily for optimal health and glowing skin.",
        4: "Take regular breaks from screens - follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds."
    };

    // Shuffle cards
    function shuffleCards() {
        const gameBoard = document.querySelector('.game-board');
        const cardsArray = Array.from(gameCards);

        // Fisher-Yates shuffle
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            gameBoard.appendChild(cardsArray[j]);
        }
    }

    // Flip card
    function flipCard(card) {
        if (!canFlip) return;
        if (card.classList.contains('flipped')) return;
        if (card.classList.contains('matched')) return;
        if (flippedCards.length >= 2) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    // Check for match
    function checkMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;
        const tip1 = card1.getAttribute('data-tip');
        const tip2 = card2.getAttribute('data-tip');

        if (tip1 === tip2) {
            // Match found!
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                matchCountEl.textContent = matchedPairs;

                // Show tip
                showTip(parseInt(tip1));

                flippedCards = [];
                canFlip = true;

                // Check for game completion
                if (matchedPairs === 4) {
                    setTimeout(() => {
                        tipTextEl.textContent = "Congratulations! You've revealed all wellness tips. Keep practicing these daily for a healthier, happier life!";
                    }, 500);
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    // Show wellness tip
    function showTip(tipNumber) {
        const tip = wellnessTips[tipNumber];
        tipTextEl.textContent = tip;
        tipRevealEl.style.animation = 'none';
        tipRevealEl.offsetHeight; // Trigger reflow
        tipRevealEl.style.animation = 'fadeIn 0.5s ease';
    }

    // Reset game
    function resetGame() {
        gameCards.forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
        flippedCards = [];
        matchedPairs = 0;
        canFlip = true;
        matchCountEl.textContent = '0';
        tipTextEl.textContent = 'Match cards to reveal your wellness tip!';

        setTimeout(shuffleCards, 300);
    }

    // Event listeners for game
    gameCards.forEach(card => {
        card.addEventListener('click', () => flipCard(card));
    });

    resetGameBtn.addEventListener('click', resetGame);

    // Initialize game
    shuffleCards();

    // ========================================
    // Contact Form Handling
    // ========================================

    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #6BCB77 0%, #4ECDC4 100%)';

            // Reset form
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // ========================================
    // Button Animations
    // ========================================

    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });

    // ========================================
    // Floating Cards Animation Enhancement
    // ========================================

    const floatingCards = document.querySelectorAll('.floating-card');

    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * -2}s`;
    });

    // ========================================
    // Parallax Effect for Background Shapes
    // ========================================

    const shapes = document.querySelectorAll('.shape');
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    function animateShapes() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translate(${targetX * speed}px, ${targetY * speed}px)`;
        });

        requestAnimationFrame(animateShapes);
    }

    animateShapes();

    // ========================================
    // Initialize
    // ========================================

    initSections();

    // Add CSS animation for tip reveal
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// ========================================
// Smooth Scroll for Touch Devices
// ========================================

if ('ontouchstart' in window) {
    document.body.style.overscrollBehavior = 'none';
}
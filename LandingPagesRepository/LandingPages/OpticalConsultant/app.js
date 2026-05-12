/**
 * OPTICAL CONSULTANT - MAIN SCRIPT
 * Performance Optimized | Modern ES6+ | Advanced Animations
 */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==========================================
// NAVIGATION
// ==========================================

const nav = document.querySelector('nav');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

// Sticky nav on scroll
const handleScroll = throttle(() => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', handleScroll);

// Mobile menu toggle
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
}

if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileMenu);
}

// Active section highlighting
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const highlightNav = throttle(() => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, 100);

window.addEventListener('scroll', highlightNav);

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// ==========================================
// PARTICLE SYSTEM
// ==========================================

function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.insertBefore(particlesContainer, hero.firstChild);

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');

        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// PARALLAX EFFECT FOR LENSES
// ==========================================

function initParallax() {
    const lenses = document.querySelectorAll('.lens');

    const handleMouseMove = throttle((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;

        lenses.forEach((lens, index) => {
            const depth = (index + 1) * 0.3;
            lens.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    }, 50);

    document.addEventListener('mousemove', handleMouseMove);
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger card animations
                if (entry.target.classList.contains('horizontal-scroll-container')) {
                    const cards = entry.target.querySelectorAll('.service-card, .flip-card, .tip-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animationDelay = `${index * 0.1}s`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all sections except hero
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        observer.observe(section);
    });
}

// ==========================================
// HORIZONTAL SCROLL WITH MOUSE WHEEL
// ==========================================

function initHorizontalScroll() {
    document.querySelectorAll('.horizontal-scroll-container').forEach(container => {
        container.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    });
}

// ==========================================
// 3D TILT EFFECT ON CARDS
// ==========================================

function init3DTilt() {
    const cards = document.querySelectorAll('.service-card, .flip-card-front');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ==========================================
// COLOR MATCHING GAME
// ==========================================

const baseColors = [
    { name: 'rojo', hex: '#FF6B6B' },
    { name: 'rosa', hex: '#FF8E8E' },
    { name: 'salmon', hex: '#FFA07A' },
    { name: 'naranja', hex: '#FFB347' },
    { name: 'coral', hex: '#FF7F50' },
    { name: 'amarillo', hex: '#F7DC6F' },
    { name: 'dorado', hex: '#F4D03F' },
    { name: 'lima', hex: '#C7EA46' },
    { name: 'verde', hex: '#52B788' },
    { name: 'menta', hex: '#98D8C8' },
    { name: 'turquesa', hex: '#4ECDC4' },
    { name: 'cyan', hex: '#45B7D1' },
    { name: 'celeste', hex: '#85C1E2' },
    { name: 'azul', hex: '#5DADE2' },
    { name: 'lavanda', hex: '#BB8FCE' },
    { name: 'lila', hex: '#D7BDE2' }
];

let gameState = {
    currentTargetColor: '',
    score: 0,
    level: 1,
    streak: 0,
    earnedDiscount: 0,
    timeLeft: 10,
    timerInterval: null,
    gameActive: true,
    currentRound: 0,
    maxRounds: 10
};

function generateSimilarColor(baseHex) {
    const r = parseInt(baseHex.slice(1, 3), 16);
    const g = parseInt(baseHex.slice(3, 5), 16);
    const b = parseInt(baseHex.slice(5, 7), 16);

    const variation = 15;
    const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation * 2));
    const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation * 2));
    const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation * 2));

    return '#' +
        Math.round(newR).toString(16).padStart(2, '0') +
        Math.round(newG).toString(16).padStart(2, '0') +
        Math.round(newB).toString(16).padStart(2, '0');
}

function generateColorGame() {
    if (!gameState.gameActive) return;

    // Check if max rounds reached
    if (gameState.currentRound >= gameState.maxRounds) {
        endGame();
        return;
    }

    gameState.currentRound++;
    clearInterval(gameState.timerInterval);

    // Determine difficulty
    let numOptions = 6;
    let timeLimit = 10;

    if (gameState.level >= 3) {
        numOptions = 8;
        timeLimit = 8;
    }
    if (gameState.level >= 5) {
        numOptions = 9;
        timeLimit = 6;
    }
    if (gameState.level >= 7) {
        numOptions = 12;
        timeLimit = 5;
    }

    gameState.timeLeft = timeLimit;

    // Select target color
    const targetIndex = Math.floor(Math.random() * baseColors.length);
    const targetColorObj = baseColors[targetIndex];
    gameState.currentTargetColor = targetColorObj.hex;

    const targetColorEl = document.getElementById('targetColor');
    if (targetColorEl) {
        targetColorEl.style.backgroundColor = gameState.currentTargetColor;
    }

    // Generate options
    const options = [targetColorObj];

    while (options.length < numOptions) {
        let similarColor;
        if (gameState.level >= 4 && Math.random() > 0.5) {
            similarColor = generateSimilarColor(targetColorObj.hex);
        } else {
            const randomIdx = Math.floor(Math.random() * baseColors.length);
            similarColor = baseColors[randomIdx];
        }

        if (!options.some(opt => opt.hex === (similarColor.hex || similarColor))) {
            options.push(typeof similarColor === 'string' ? { hex: similarColor } : similarColor);
        }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Render options
    const optionsContainer = document.getElementById('colorOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';

        if (numOptions > 6) {
            optionsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            optionsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }

        options.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color.hex || color;
            btn.onclick = () => checkColorMatch(color.hex || color);
            optionsContainer.appendChild(btn);
        });
    }

    startTimer(timeLimit);
}

function startTimer(limit) {
    gameState.timeLeft = limit;
    updateTimerDisplay();

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerSpan = document.getElementById('timer');
    const targetDiv = document.getElementById('targetColor');

    if (timerSpan) {
        timerSpan.textContent = gameState.timeLeft;
        timerSpan.style.color = gameState.timeLeft <= 3 ? '#FF6B6B' : 'var(--accent)';
    }

    if (targetDiv) {
        const glowSize = Math.max(0, (10 - gameState.timeLeft) * 2);
        const glowColor = gameState.timeLeft <= 3 ? '#FF6B6B' : 'var(--accent)';
        targetDiv.style.boxShadow = `0 15px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1), 0 0 0 ${glowSize}px ${glowColor}40`;
    }
}

function endGame(message = '¡Juego completado!') {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);

    // Hide game area
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
        gameArea.style.display = 'none';
    }

    // Show game over screen
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.style.display = 'block';

        // Update final score
        document.getElementById('finalScore').textContent = gameState.score;

        // Update discount
        if (gameState.earnedDiscount > 0) {
            document.getElementById('finalDiscount').textContent = gameState.earnedDiscount + '%';
            document.getElementById('finalDiscountBox').style.display = 'block';
        } else {
            document.getElementById('finalDiscountBox').style.display = 'none';
        }

        // Set game over message
        const messageEl = document.getElementById('gameOverMessage');
        if (messageEl) {
            let fullMessage = message;
            if (gameState.earnedDiscount > 0) {
                fullMessage += ` ¡Ganaste un ${gameState.earnedDiscount}% de descuento! Usa el código EYE2024 al reservar.`;
            } else if (gameState.score >= 50) {
                fullMessage += ' ¡Buen intento! Juega de nuevo para ganar descuentos.';
            } else {
                fullMessage += ' Sigue practicando para ganar descuentos en tu próxima consulta.';
            }
            messageEl.textContent = fullMessage;
        }
    }
}

function handleTimeout() {
    gameState.streak = 0;
    if (gameState.score > 0) {
        gameState.score = Math.max(0, gameState.score - 5);
    }

    document.getElementById('score').textContent = gameState.score;

    // End game on timeout
    endGame('¡Se acabó el tiempo!');
}

function checkColorMatch(selectedColor) {
    if (!gameState.gameActive) return;

    if (selectedColor === gameState.currentTargetColor) {
        clearInterval(gameState.timerInterval);

        // Calculate score
        const timeBonus = Math.max(0, gameState.timeLeft * 2);
        gameState.score += (10 * gameState.level) + timeBonus;
        gameState.streak++;

        // Level up
        if (gameState.streak % (gameState.level >= 5 ? 2 : 3) === 0) {
            gameState.level++;
        }

        // Update discounts
        if (gameState.score >= 80) gameState.earnedDiscount = 5;
        if (gameState.score >= 150) gameState.earnedDiscount = 10;
        if (gameState.score >= 250) gameState.earnedDiscount = 15;
        if (gameState.score >= 400) gameState.earnedDiscount = 20;
        if (gameState.score >= 600) gameState.earnedDiscount = 25;

        // Update display
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('level').textContent = gameState.level;

        if (gameState.earnedDiscount > 0) {
            document.getElementById('discountPercent').textContent = gameState.earnedDiscount + '%';
            document.getElementById('discountDisplay').classList.add('show');
        }

        // Visual feedback
        const targetDiv = document.getElementById('targetColor');
        if (targetDiv) {
            targetDiv.style.transform = 'scale(1.1)';
            setTimeout(() => targetDiv.style.transform = 'scale(1)', 200);
        }

        generateColorGame();
    } else {
        clearInterval(gameState.timerInterval);
        gameState.streak = 0;
        gameState.score = Math.max(0, gameState.score - 10);
        document.getElementById('score').textContent = gameState.score;

        // Show feedback and continue to next round
        const targetDiv = document.getElementById('targetColor');
        if (targetDiv) {
            targetDiv.style.transform = 'scale(0.9)';
            targetDiv.style.filter = 'grayscale(1)';
            setTimeout(() => {
                targetDiv.style.transform = 'scale(1)';
                targetDiv.style.filter = 'grayscale(0)';
                generateColorGame();
            }, 800);
        } else {
            generateColorGame();
        }
    }
}

function restartGame() {
    gameState = {
        currentTargetColor: '',
        score: 0,
        level: 1,
        streak: 0,
        earnedDiscount: 0,
        timeLeft: 10,
        timerInterval: null,
        gameActive: true,
        currentRound: 0,
        maxRounds: 10
    };

    document.getElementById('score').textContent = 0;
    document.getElementById('level').textContent = 1;
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('discountDisplay').classList.remove('show');

    generateColorGame();
}

// ==========================================
// FORM HANDLING
// ==========================================

function initContactForm() {
    const form = document.getElementById('bookingForm');
    const dateInput = document.getElementById('date');

    // Set minimum date to today
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const message = document.getElementById('message').value;

            let discountText = '';
            if (gameState.earnedDiscount > 0) {
                discountText = `%0A%0ADescuento ganado en el juego: ${gameState.earnedDiscount}% (Código: EYE2024)`;
            }

            const whatsappMessage =
                `¡Hola! Me gustaría agendar una cita:%0A%0A` +
                `Nombre: ${firstName} ${lastName}%0A` +
                `Teléfono: ${phone}%0A` +
                `Servicio: ${service}%0A` +
                `Fecha Preferida: ${date}%0A` +
                `Hora Preferida: ${time}%0A` +
                (message ? `Mensaje: ${message}` : '') +
                discountText;

            const whatsappNumber = '1234567890'; // Replace with actual number
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    }
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================

function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================

function initCursorGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 217, 165, 0.15) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
        opacity: 0;
        z-index: 5;
    `;
    hero.appendChild(glow);

    hero.addEventListener('mousemove', throttle((e) => {
        const rect = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
        glow.style.opacity = '1';
    }, 50));

    hero.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
    console.log('🚀 Optical Consultant - Initializing...');

    // Initialize all features
    createParticles();
    initParallax();
    initScrollReveal();
    initHorizontalScroll();
    init3DTilt();
    initContactForm();
    initLazyLoading();
    initCursorGlow();

    // Start game
    if (document.getElementById('gameArea')) {
        generateColorGame();
    }

    console.log('✅ All features initialized successfully!');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for inline usage
window.toggleMobileMenu = toggleMobileMenu;
window.restartGame = restartGame;

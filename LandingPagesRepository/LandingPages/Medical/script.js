/**
 * Executive Assistant Portfolio - Interactive Features
 * Unique Editorial Design
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initGame();
});

/**
 * Custom Cursor with Paper Clip Effect
 */
function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Click effect - transform to paper clip
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        
        setTimeout(() => {
            cursor.classList.add('paper-clip');
            cursor.classList.remove('clicking');
            
            setTimeout(() => {
                cursor.classList.remove('paper-clip');
            }, 1500);
        }, 150);
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * Navigation
 */
function initNavigation() {
    const menuTrigger = document.getElementById('menu-trigger');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuTrigger && navOverlay) {
        menuTrigger.addEventListener('click', () => {
            menuTrigger.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuTrigger.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
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

    document.querySelectorAll('.expertise-card, .work-item, .info-card, .contact-block').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/**
 * Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Mensaje enviado</span>';
                submitBtn.style.background = '#2D5016';
                
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2500);
            }, 1500);
        });
    }
}

/**
 * Priority Challenge Game - Fixed Version
 * Simple button-based interaction instead of drag-and-drop
 */
function initGame() {
    // Game scenarios database
    const scenarios = [
        {
            id: 1,
            text: "El CEO recibe un email de un cliente VIP que amenaza con cancelar un contrato millonario",
            emoji: "📧",
            correct: "urgent",
            explanation: "Un cliente VIP en riesgo de cancelar requiere atención inmediata del máximo nivel."
        },
        {
            id: 2,
            text: "Revisión trimestral del presupuesto departamental programada para la próxima semana",
            emoji: "📊",
            correct: "important",
            explanation: "Impacta los objetivos financieros pero no requiere acción inmediata."
        },
        {
            id: 3,
            text: "Pedir suministros de oficina (papel, bolígrafos, café)",
            emoji: "✏️",
            correct: "delegate",
            explanation: "Tarea operativa rutinaria que puede asignarse a personal de apoyo."
        },
        {
            id: 4,
            text: "Llamada entrante del board de directores solicitando información urgente",
            emoji: "📞",
            correct: "urgent",
            explanation: "El board tiene prioridad máxima y requiere respuesta inmediata."
        },
        {
            id: 5,
            text: "Planificación estratégica para el próximo trimestre",
            emoji: "🎯",
            correct: "important",
            explanation: "Crítica para el éxito futuro pero no tiene deadline inmediato."
        },
        {
            id: 6,
            text: "Actualizar la base de datos de contactos del CRM",
            emoji: "💾",
            correct: "delegate",
            explanation: "Tarea de mantenimiento que puede realizarse de forma asíncrona."
        },
        {
            id: 7,
            text: "Problema técnico crítico en el sistema que impide operaciones",
            emoji: "🚨",
            correct: "urgent",
            explanation: "Bloquea operaciones - requiere escalación inmediata."
        },
        {
            id: 8,
            text: "Desarrollo profesional y capacitación del equipo",
            emoji: "📚",
            correct: "important",
            explanation: "Impacta el rendimiento a largo plazo del equipo."
        },
        {
            id: 9,
            text: "Organizar archivos físicos antiguos del almacén",
            emoji: "📁",
            correct: "delegate",
            explanation: "Tarea que no requiere supervisión directa ejecutiva."
        },
        {
            id: 10,
            text: "Reunión de crisis con departamento legal por demanda inminente",
            emoji: "⚖️",
            correct: "urgent",
            explanation: "Riesgo legal inminente - máxima prioridad."
        },
        {
            id: 11,
            text: "Investigar nuevas herramientas de productividad para el equipo",
            emoji: "🔍",
            correct: "important",
            explanation: "Mejora procesos pero no es urgente."
        },
        {
            id: 12,
            text: "Responder emails de newsletters y suscripciones",
            emoji: "📰",
            correct: "delegate",
            explanation: "Baja prioridad - puede gestionarse asistente virtual o filtros."
        },
        {
            id: 13,
            text: "Confirmar reservas de viaje para reunión mañana a primera hora",
            emoji: "✈️",
            correct: "urgent",
            explanation: "Timeline inminente - riesgo de cancelación costosa."
        },
        {
            id: 14,
            text: "Preparar informe anual de resultados para stakeholders",
            emoji: "📈",
            correct: "important",
            explanation: "Crítico para la transparencia pero con deadline conocido."
        },
        {
            id: 15,
            text: "Hacer café y preparar sala para reuniones",
            emoji: "☕",
            correct: "delegate",
            explanation: "Logística de apoyo - no requiere perfil ejecutivo."
        }
    ];

    // Game state
    let gameState = {
        currentScenario: 0,
        score: 0,
        timeLeft: 90,
        level: 1,
        answers: [],
        shuffledScenarios: [],
        timerInterval: null,
        isPlaying: false
    };

    // DOM elements
    const screens = {
        start: document.getElementById('game-start'),
        play: document.getElementById('game-play'),
        result: document.getElementById('game-result')
    };

    const displays = {
        score: document.getElementById('game-score'),
        time: document.getElementById('game-time'),
        level: document.getElementById('game-level'),
        scenarioIcon: document.getElementById('scenario-icon'),
        scenarioText: document.getElementById('scenario-text'),
        progressCurrent: document.getElementById('progress-current'),
        progressTotal: document.getElementById('progress-total'),
        progressFill: document.getElementById('progress-fill')
    };

    const buttons = {
        start: document.getElementById('btn-start-game'),
        restart: document.getElementById('btn-restart-game'),
        urgent: document.getElementById('btn-urgent'),
        important: document.getElementById('btn-important'),
        delegate: document.getElementById('btn-delegate')
    };

    // Initialize button listeners
    if (buttons.start) {
        buttons.start.addEventListener('click', startGame);
    }

    if (buttons.restart) {
        buttons.restart.addEventListener('click', startGame);
    }

    // Answer button listeners
    ['urgent', 'important', 'delegate'].forEach(type => {
        if (buttons[type]) {
            buttons[type].addEventListener('click', () => handleAnswer(type));
        }
    });

    function startGame() {
        // Reset state
        gameState = {
            currentScenario: 0,
            score: 0,
            timeLeft: 90,
            level: 1,
            answers: [],
            shuffledScenarios: shuffleArray([...scenarios]).slice(0, 10),
            timerInterval: null,
            isPlaying: true
        };

        // Reset UI
        updateStats();
        enableAnswerButtons();
        
        // Switch screens
        showScreen('play');
        
        // Load first scenario
        loadScenario();
        
        // Start timer
        startTimer();
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            if (screen) screen.style.display = 'none';
        });
        if (screens[screenName]) {
            screens[screenName].style.display = 'block';
        }
    }

    function loadScenario() {
        const scenario = gameState.shuffledScenarios[gameState.currentScenario];
        
        if (!scenario) {
            endGame();
            return;
        }

        // Update displays
        displays.scenarioIcon.textContent = scenario.emoji;
        displays.scenarioText.textContent = scenario.text;
        displays.progressCurrent.textContent = gameState.currentScenario + 1;
        displays.progressTotal.textContent = gameState.shuffledScenarios.length;
        
        // Update progress bar
        const progress = (gameState.currentScenario / gameState.shuffledScenarios.length) * 100;
        displays.progressFill.style.width = progress + '%';

        // Reset button states
        enableAnswerButtons();
    }

    function handleAnswer(answer) {
        if (!gameState.isPlaying) return;

        const scenario = gameState.shuffledScenarios[gameState.currentScenario];
        const isCorrect = answer === scenario.correct;

        // Disable all buttons temporarily
        disableAnswerButtons();

        // Record answer
        gameState.answers.push({
            scenario: scenario,
            userAnswer: answer,
            isCorrect: isCorrect
        });

        // Update score
        if (isCorrect) {
            gameState.score += 100;
            // Visual feedback for correct
            highlightButton(answer, true);
        } else {
            gameState.score = Math.max(0, gameState.score - 30);
            gameState.timeLeft = Math.max(0, gameState.timeLeft - 5);
            // Visual feedback for wrong
            highlightButton(answer, false);
            // Show correct answer
            setTimeout(() => highlightButton(scenario.correct, true), 500);
        }

        updateStats();

        // Move to next scenario after delay
        setTimeout(() => {
            gameState.currentScenario++;
            
            if (gameState.currentScenario >= gameState.shuffledScenarios.length) {
                endGame();
            } else {
                loadScenario();
            }
        }, 1200);
    }

    function highlightButton(type, isCorrect) {
        const btn = buttons[type];
        if (!btn) return;
        
        btn.classList.remove('correct', 'wrong');
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
    }

    function enableAnswerButtons() {
        ['urgent', 'important', 'delegate'].forEach(type => {
            if (buttons[type]) {
                buttons[type].classList.remove('disabled', 'correct', 'wrong');
                buttons[type].disabled = false;
            }
        });
    }

    function disableAnswerButtons() {
        ['urgent', 'important', 'delegate'].forEach(type => {
            if (buttons[type]) {
                buttons[type].classList.add('disabled');
                buttons[type].disabled = true;
            }
        });
    }

    function startTimer() {
        clearInterval(gameState.timerInterval);
        
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            updateStats();

            // Visual warning
            if (gameState.timeLeft <= 10) {
                displays.time.style.color = '#C75B39';
            } else {
                displays.time.style.color = '';
            }

            if (gameState.timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function updateStats() {
        if (displays.score) displays.score.textContent = gameState.score;
        if (displays.time) displays.time.textContent = gameState.timeLeft;
        if (displays.level) displays.level.textContent = gameState.level;
    }

    function endGame() {
        gameState.isPlaying = false;
        clearInterval(gameState.timerInterval);

        // Calculate stats
        const correct = gameState.answers.filter(a => a.isCorrect).length;
        const total = gameState.answers.length;
        const timeBonus = Math.floor(gameState.timeLeft / 10) * 50;
        const finalScore = gameState.score + timeBonus;

        // Determine rank
        let medal, title, description;
        const accuracy = correct / total;
        
        if (accuracy >= 0.9 && gameState.timeLeft > 30) {
            medal = '🏆';
            title = '¡Maestría Ejecutiva!';
            description = 'Tienes un instinto excepcional para la priorización. Eres material C-level.';
        } else if (accuracy >= 0.7) {
            medal = '🥇';
            title = '¡Excelente trabajo!';
            description = 'Demuestras un gran entendimiento de la gestión del tiempo ejecutiva.';
        } else if (accuracy >= 0.5) {
            medal = '🥈';
            title = '¡Buen intento!';
            description = 'Tienes una base sólida. Con práctica, dominarás la priorización.';
        } else {
            medal = '📚';
            title = 'Sigue practicando';
            description = 'La priorización es un arte que se perfecciona con el tiempo. ¡No te rindas!';
        }

        // Update result screen
        document.getElementById('result-medal').textContent = medal;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-desc').textContent = description;
        document.getElementById('result-correct').textContent = `${correct}/${total}`;
        document.getElementById('result-score').textContent = finalScore;
        document.getElementById('result-time').textContent = `${gameState.timeLeft}s`;

        // Generate breakdown
        const breakdownEl = document.getElementById('result-breakdown');
        breakdownEl.innerHTML = '';
        
        gameState.answers.forEach((answer, index) => {
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <span class="breakdown-status ${answer.isCorrect ? 'correct' : 'wrong'}">
                    ${answer.isCorrect ? '✓' : '✗'}
                </span>
                <span class="breakdown-text">${answer.scenario.text.substring(0, 50)}...</span>
                <span class="breakdown-answer">${getAnswerLabel(answer.scenario.correct)}</span>
            `;
            breakdownEl.appendChild(item);
        });

        showScreen('result');
    }

    function getAnswerLabel(answer) {
        const labels = {
            urgent: 'Urgente',
            important: 'Importante',
            delegate: 'Delegable'
        };
        return labels[answer] || answer;
    }
}

// Add stagger animations on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.portrait-placeholder, .work-pattern');
    
    parallaxElements.forEach(el => {
        const speed = 0.05;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Magnetic button effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Konami Code Easter Egg
let konamiSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.key);
    konamiSequence = konamiSequence.slice(-10);
    
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        // Party mode!
        document.body.style.animation = 'partyMode 3s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes partyMode {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 3000);
    }
});
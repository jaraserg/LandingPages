// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeEmoji = themeToggle.querySelector('.theme-emoji');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        themeEmoji.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    } else {
        html.setAttribute('data-theme', 'dark');
        themeEmoji.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeEmoji.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Navbar Scroll
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Floating Emojis
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('floating-emojis');
    const emojis = ['📚', '💬', '🗣️', '🎯', '🚀', '✨', '💡', '🎓', '🌍', '🔥'];
    
    for (let i = 0; i < 15; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `${Math.random() * 100}%`;
        emoji.style.animationDelay = `${Math.random() * 10}s`;
        emoji.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(emoji);
    }
});

// Animated Stats Counter
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        
        update();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
});

// Smooth Scroll
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
});

// GAME: Fix The Sentence
const gameData = {
    streak: 0,
    current: null,
    selectedWords: [],
    
    sentences: [
        { scrambled: ['I', 'am', '25', 'years', 'have', 'old'], correct: ['I', 'am', '25', 'years', 'old'], hint: 'Age expression' },
        { scrambled: ['She', 'dont', 'like', "doesn't", 'coffee'], correct: ['She', "doesn't", 'like', 'coffee'], hint: 'Negative form' },
        { scrambled: ['I', 'agree', 'am', 'with', 'you'], correct: ['I', 'agree', 'with', 'you'], hint: 'No "to be" verb needed' },
        { scrambled: ['He', 'go', 'to', 'goes', 'school'], correct: ['He', 'goes', 'to', 'school'], hint: 'Third person singular' },
        { scrambled: ['They', 'watching', 'are', 'TV', 'now'], correct: ['They', 'are', 'watching', 'TV', 'now'], hint: 'Present continuous' },
        { scrambled: ['I', 'have', 'never', 'been', 'to', 'Paris'], correct: ['I', 'have', 'never', 'been', 'to', 'Paris'], hint: 'Present perfect' },
        { scrambled: ['She', 'is', 'more', 'taller', 'than', 'me'], correct: ['She', 'is', 'taller', 'than', 'me'], hint: 'Comparative form' },
        { scrambled: ['We', 'enjoy', 'to', 'play', 'playing', 'games'], correct: ['We', 'enjoy', 'playing', 'games'], hint: 'Verb pattern' }
    ],
    
    init() {
        this.loadNewSentence();
        this.bindEvents();
    },
    
    loadNewSentence() {
        this.current = this.sentences[Math.floor(Math.random() * this.sentences.length)];
        this.selectedWords = [];
        this.render();
    },
    
    render() {
        const display = document.getElementById('sentence-display');
        const bank = document.getElementById('word-bank');
        const answer = document.getElementById('your-answer');
        
        // Show hint in display
        display.innerHTML = `<span style="color: var(--text-muted)">Hint: ${this.current.hint}</span>`;
        
        // Render word bank
        bank.innerHTML = this.current.scrambled.map((word, idx) => 
            `<button class="word-option ${this.selectedWords.includes(idx) ? 'used' : ''}" 
                     data-idx="${idx}" ${this.selectedWords.includes(idx) ? 'disabled' : ''}>${word}</button>`
        ).join('');
        
        // Render answer area
        if (this.selectedWords.length === 0) {
            answer.innerHTML = '<span class="placeholder">Click words to build sentence ↓</span>';
        } else {
            answer.innerHTML = this.selectedWords.map(idx => 
                `<span class="word-selected">${this.current.scrambled[idx]}</span>`
            ).join('');
        }
        
        document.getElementById('streak').textContent = this.streak;
    },
    
    bindEvents() {
        document.getElementById('word-bank').addEventListener('click', (e) => {
            if (e.target.classList.contains('word-option') && !e.target.classList.contains('used')) {
                this.selectedWords.push(parseInt(e.target.dataset.idx));
                this.render();
            }
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.selectedWords = [];
            this.render();
            this.showFeedback('', '');
        });
        
        document.getElementById('check-btn').addEventListener('click', () => {
            this.checkAnswer();
        });
        
        document.getElementById('skip-btn').addEventListener('click', () => {
            this.streak = 0;
            this.loadNewSentence();
            this.showFeedback('Skipped!', 'wrong');
        });
    },
    
    checkAnswer() {
        const userSentence = this.selectedWords.map(idx => this.current.scrambled[idx]);
        const isCorrect = JSON.stringify(userSentence) === JSON.stringify(this.current.correct);
        
        const feedback = document.getElementById('game-feedback');
        
        if (isCorrect) {
            this.streak++;
            this.showFeedback('✓ Correct! 🎉', 'correct');
            
            if (this.streak >= 5) {
                setTimeout(() => {
                    alert('🔥 5 in a row! You\'re on fire! Keep going!');
                }, 300);
            }
            
            setTimeout(() => {
                this.loadNewSentence();
                this.showFeedback('', '');
            }, 1500);
        } else {
            this.streak = 0;
            feedback.innerHTML = `✗ Not quite! Try: "${this.current.correct.join(' ')}"`;
            feedback.className = 'game-feedback wrong';
            
            // Shake animation
            document.querySelector('.game-card').style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.querySelector('.game-card').style.animation = '';
            }, 500);
        }
    },
    
    showFeedback(message, type) {
        const feedback = document.getElementById('game-feedback');
        feedback.textContent = message;
        feedback.className = `game-feedback ${type}`;
    }
};

document.addEventListener('DOMContentLoaded', () => gameData.init());

// Multi-step Booking Form with Calendar
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const steps = form.querySelectorAll('.form-step');
    let currentStep = 1;
    let bookingData = { date: null, time: null };
    
    // Navigation
    form.querySelectorAll('.btn-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.next) {
                // Validation
                if (currentStep === 1) {
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    if (!name || !email) {
                        alert('Please fill in your name and email!');
                        return;
                    }
                }
                if (currentStep === 2) {
                    const struggle = document.querySelector('input[name="struggle"]:checked');
                    if (!struggle) {
                        alert('Please select your biggest struggle!');
                        return;
                    }
                }
                if (currentStep === 3 && (!bookingData.date || !bookingData.time)) {
                    alert('Please select a date and time!');
                    return;
                }
                
                currentStep = parseInt(btn.dataset.next);
            } else if (btn.dataset.prev) {
                currentStep = parseInt(btn.dataset.prev);
            }
            
            updateStep();
        });
    });
    
    function updateStep() {
        steps.forEach(step => step.classList.remove('active'));
        form.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        
        if (currentStep === 4) {
            updateSummary();
        }
    }
    
    function updateSummary() {
        const name = document.getElementById('name').value;
        const struggle = document.querySelector('input[name="struggle"]:checked')?.value;
        const struggleMap = {
            'speaking': 'Speaking fluency',
            'confidence': 'Confidence issues',
            'grammar': 'Grammar confusion',
            'listening': 'Listening comprehension',
            'all': 'All of the above'
        };
        
        document.getElementById('booking-summary').innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Goal:</strong> ${struggleMap[struggle]}</p>
            <p><strong>Date:</strong> ${bookingData.date}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
        `;
    }
    
    // Mini Calendar
    const calGrid = document.getElementById('mini-cal-grid');
    const calMonth = document.getElementById('cal-month');
    let calDate = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    function generateMiniCalendar(year, month) {
        calGrid.innerHTML = '';
        
        // Day labels
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        days.forEach(day => {
            const label = document.createElement('div');
            label.className = 'day-label';
            label.textContent = day;
            calGrid.appendChild(label);
        });
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Empty days
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            calGrid.appendChild(empty);
        }
        
        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.textContent = day;
            
            const date = new Date(year, month, day);
            
            if (date < new Date(today.setHours(0, 0, 0, 0))) {
                dayEl.classList.add('disabled');
            } else if (Math.random() < 0.3) {
                dayEl.classList.add('booked');
            } else {
                dayEl.addEventListener('click', () => selectDate(dayEl, date));
            }
            
            calGrid.appendChild(dayEl);
        }
        
        calMonth.textContent = `${monthNames[month]} ${year}`;
    }
    
    function selectDate(el, date) {
        document.querySelectorAll('.mini-cal-grid .day').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        
        bookingData.date = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        showTimeSlots();
    }
    
    function showTimeSlots() {
        const slots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];
        const container = document.getElementById('time-slots-mini');
        
        container.innerHTML = slots.map(time => 
            `<button type="button" class="time-slot-btn ${bookingData.time === time ? 'selected' : ''}" data-time="${time}">${time}</button>`
        ).join('');
        
        container.querySelectorAll('.time-slot-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                bookingData.time = btn.dataset.time;
            });
        });
    }
    
    document.getElementById('cal-prev').addEventListener('click', () => {
        calDate.setMonth(calDate.getMonth() - 1);
        generateMiniCalendar(calDate.getFullYear(), calDate.getMonth());
    });
    
    document.getElementById('cal-next').addEventListener('click', () => {
        calDate.setMonth(calDate.getMonth() + 1);
        generateMiniCalendar(calDate.getFullYear(), calDate.getMonth());
    });
    
    generateMiniCalendar(calDate.getFullYear(), calDate.getMonth());
    
    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('success-modal').classList.add('active');
        form.reset();
        currentStep = 1;
        updateStep();
        bookingData = { date: null, time: null };
        document.getElementById('time-slots-mini').innerHTML = '<p class="slots-hint">Pick a date first ↑</p>';
        generateMiniCalendar(calDate.getFullYear(), calDate.getMonth());
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('active');
    });
});

// Pain Cards Interaction
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.pain-card').forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
});

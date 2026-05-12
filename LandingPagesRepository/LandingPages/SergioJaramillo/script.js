// script.js

// -------------------------------------------------------------
// Interactive Vibe Piano Audio Engine (B flat minor pentatonic)
// -------------------------------------------------------------
const notes = [233.08, 277.18, 311.13, 349.23, 415.30, 466.16, 554.37, 622.25, 698.46, 830.61]; 
let audioCtx;
let audioActive = false;

// Global mouse tracking
let globalMouseX = window.innerWidth / 2;
let globalMouseY = window.innerHeight / 2;
document.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
});

// Native Web Audio Context Initialization
function initAudio() {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        audioActive = true;
        console.log("Native Audio Engine Started (CORS Safe)");
    } catch (e) {
        console.warn("Audio init failed:", e);
    }
}

// -------------------------------------------------------------
// Invisible Audio Trigger Nodes (Replaces p5.js physics)
// -------------------------------------------------------------
class AudioTriggerNode {
    constructor() {
        this.reset();
        this.cooldown = 0;
    }
    
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        // Slow drifting movement
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.freq = notes[Math.floor(Math.random() * notes.length)];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off screen edges
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;

        // Calculate distance to mouse
        const dx = this.x - globalMouseX;
        const dy = this.y - globalMouseY;
        const d = Math.sqrt(dx * dx + dy * dy);
        
        // Interaction radius
        if (d < 150) {
            // Gentle magnetic push/pull effect
            const attract = (150 - d) / 150 * 0.2;
            const angle = Math.atan2(globalMouseY - this.y, globalMouseX - this.x);
            this.x += Math.cos(angle) * attract;
            this.y += Math.sin(angle) * attract;

            // Trigger audio if very close
            if (d < 40 && audioActive && this.cooldown <= 0) {
                this.playNode();
            }
        }
        
        if (this.cooldown > 0) this.cooldown--;
    }
    
    playNode() {
        if (!audioActive || !audioCtx) return;
        try {
            // Main body oscillator (sine)
            let oscMain = audioCtx.createOscillator();
            // Harmonic "bell" oscillator (triangle) mapped to octave up
            let oscHarm = audioCtx.createOscillator();
            
            oscMain.type = 'sine';
            oscHarm.type = 'triangle';
            
            oscMain.frequency.setValueAtTime(this.freq, audioCtx.currentTime);
            oscHarm.frequency.setValueAtTime(this.freq * 2, audioCtx.currentTime);
            
            // Limit volume to prevent clipping distortion
            let gainMain = audioCtx.createGain();
            let gainHarm = audioCtx.createGain();
            gainMain.gain.value = 0.05; // 5% volume for body
            gainHarm.gain.value = 0.005; // 0.5% volume for bell harmonic
            
            oscMain.connect(gainMain);
            oscHarm.connect(gainHarm);

            // Master envelope for the percussive strike (Vibraphone shape)
            let masterEnv = audioCtx.createGain();
            gainMain.connect(masterEnv);
            gainHarm.connect(masterEnv);
            
            // Envelope Profile
            masterEnv.gain.setValueAtTime(0, audioCtx.currentTime);
            masterEnv.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.05);
            masterEnv.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.4);
            masterEnv.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.0);
            
            masterEnv.connect(audioCtx.destination);
            
            oscMain.start(audioCtx.currentTime);
            oscHarm.start(audioCtx.currentTime);
            
            oscMain.stop(audioCtx.currentTime + 3.5);
            oscHarm.stop(audioCtx.currentTime + 3.5);
            
            this.cooldown = 180; 
        } catch (e) {
            console.error("Audio playback error:", e);
        }
    }
}

// Initialize and animate invisible nodes
const audioNodes = [];
const nodeCount = 45;

for (let i = 0; i < nodeCount; i++) {
    audioNodes.push(new AudioTriggerNode());
}

function animatePhysics() {
    for (let i = 0; i < audioNodes.length; i++) {
        audioNodes[i].update();
    }
    requestAnimationFrame(animatePhysics);
}

// -------------------------------------------------------------
// UI & Interaction Bootstrapper
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Start invisible physics loop
    animatePhysics();

    const carousel = document.getElementById('carousel');
    const navLinks = document.querySelectorAll('.nav-link');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const logo = document.getElementById('logo');
    
    // Audio Toggle functionality
    const prompt = document.getElementById('audio-prompt');
    const audioIcon = document.getElementById('audio-icon');
    const audioText = document.getElementById('audio-text');
    
    if (prompt) {
        prompt.addEventListener('click', () => {
            if (!audioActive) {
                initAudio();
                prompt.classList.add('active');
                if (audioIcon) audioIcon.className = 'fas fa-volume-up';
                if (audioText) audioText.textContent = 'Disable Sound';
            } else {
                audioActive = false;
                if (audioCtx && audioCtx.state === 'running') {
                    audioCtx.suspend();
                }
                prompt.classList.remove('active');
                if (audioIcon) audioIcon.className = 'fas fa-volume-mute';
                if (audioText) audioText.textContent = 'Enable Sound';
            }
        });
    }

    const scrollToIdx = (idx) => {
        if (carousel) {
            carousel.scrollTo({ left: idx * window.innerWidth, behavior: 'smooth' });
        }
    };

    navLinks.forEach((link, idx) => {
        link.addEventListener('click', () => scrollToIdx(idx));
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const current = Math.round(carousel.scrollLeft / window.innerWidth);
            scrollToIdx((current + 1) % 4);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const current = Math.round(carousel.scrollLeft / window.innerWidth);
            scrollToIdx((current - 1 + 4) % 4);
        });
    }

    if (logo) logo.addEventListener('click', () => scrollToIdx(0));

    if (carousel) {
        carousel.addEventListener('scroll', () => {
            const current = Math.round(carousel.scrollLeft / window.innerWidth);
            navLinks.forEach((link, idx) => link.classList.toggle('active', idx === current));
            const ind = document.getElementById('indicator');
            if (ind) ind.textContent = `0${current + 1} / 04`;
        });
        
        carousel.addEventListener('wheel', (e) => {
            // Horizontal scroll translation
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                carousel.scrollLeft += e.deltaY;
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Remove Spline watermark from Shadow DOM
    const splineViewer = document.getElementById('bg-canvas');
    if (splineViewer) {
        let attempts = 0;
        let SplineLogoInterval = setInterval(() => {
            if (splineViewer.shadowRoot) {
                const logo = splineViewer.shadowRoot.querySelector('#logo');
                if (logo) {
                    logo.style.display = 'none';
                    logo.remove();
                    clearInterval(SplineLogoInterval);
                }
            }
            attempts++;
            if (attempts > 50) clearInterval(SplineLogoInterval); // Timeout after 5 seconds to free memory
        }, 100);
    }
});

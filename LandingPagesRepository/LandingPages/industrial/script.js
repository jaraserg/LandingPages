// Industrial Engineer Portfolio - Transformer Engine
const cube = document.getElementById('cube');
const navBtns = document.querySelectorAll('.nav-btn');
const progressBar = document.querySelector('.progress-bar');
const skillHexes = document.querySelectorAll('.skill-hex');
const totalFaces = 6;

let currentFace = 0;
let isAnimating = false;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cubeRotationX = 0;
let cubeRotationY = 0;

// Initialize
function init() {
  cube.className = 'transformer-cube show-0';
  updateProgress(0);
  updateActiveNav(0);
  animateSkillHexes();
}

// Navigation
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const face = parseInt(btn.getAttribute('data-face'));
    if (face !== currentFace && !isAnimating) {
      navigateToFace(face);
    }
  });
});

function navigateToFace(face) {
  isAnimating = true;
  currentFace = face;
  
  // Clear any inline drag transform
  cube.style.transform = '';
  cube.style.transition = '';
  
  // Rotate cube
  cube.className = `transformer-cube show-${face}`;
  
  // Update UI
  updateActiveNav(face);
  updateProgress(face);
  
  // Trigger animations
  setTimeout(() => {
    if (face === 4) animateSkillHexes();
    isAnimating = false;
  }, 1200);
}

function updateActiveNav(face) {
  navBtns.forEach(btn => {
    const btnFace = parseInt(btn.getAttribute('data-face'));
    btn.classList.toggle('active', btnFace === face);
  });
}

function updateProgress(face) {
  const percentage = ((face + 1) / totalFaces) * 100;
  progressBar.style.width = `${percentage}%`;
}

// Skill Hex Animation
function animateSkillHexes() {
  skillHexes.forEach((hex, index) => {
    const fill = hex.querySelector('.hex-fill');
    const level = hex.getAttribute('data-level');
    
    fill.style.height = '0%';
    setTimeout(() => {
      fill.style.height = level + '%';
    }, index * 150);
  });
}

// Hex hover effect with gear sound simulation
skillHexes.forEach(hex => {
  hex.addEventListener('mouseenter', () => {
    hex.style.transform = 'scale(1.15) rotate(30deg)';
  });
  hex.addEventListener('mouseleave', () => {
    hex.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    const next = (currentFace + 1) % totalFaces;
    navigateToFace(next);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = (currentFace - 1 + totalFaces) % totalFaces;
    navigateToFace(prev);
  }
});

// Mouse wheel navigation
let wheelTimeout;
document.addEventListener('wheel', (e) => {
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY > 0) {
      navigateToFace((currentFace + 1) % totalFaces);
    } else {
      navigateToFace((currentFace - 1 + totalFaces) % totalFaces);
    }
  }, 100);
}, { passive: true });

// Contact form
const contactForm = document.querySelector('.contact-form-ie');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.submit-btn');
  btn.textContent = 'SENDING...';
  btn.style.opacity = '0.7';
  
  setTimeout(() => {
    btn.textContent = 'MESSAGE SENT ✓';
    btn.style.background = 'linear-gradient(135deg, #0969DA, #2EA043)';
    setTimeout(() => {
      btn.textContent = 'SEND MESSAGE';
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, var(--industrial-blue), var(--industrial-orange))';
      contactForm.reset();
    }, 2000);
  }, 1500);
});

// Parallax effect on face hover
const faces = document.querySelectorAll('.cube-face');
faces.forEach(face => {
  face.addEventListener('mousemove', (e) => {
    const rect = face.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const bg = face.querySelector('.face-bg');
    bg.style.transform = `scale(1.05) translate(${x * 20}px, ${y * 20}px)`;
  });
  
  face.addEventListener('mouseleave', (e) => {
    const bg = face.querySelector('.face-bg');
    bg.style.transform = 'scale(1)';
  });
});

// Initialize on load
window.addEventListener('load', init);

// Touch swipe support
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      navigateToFace((currentFace + 1) % totalFaces);
    } else {
      navigateToFace((currentFace - 1 + totalFaces) % totalFaces);
    }
  }
});

// Mouse drag rotation
cube.addEventListener('mousedown', (e) => {
  if (isAnimating) return;
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  cube.classList.add('dragging');
  cube.style.transition = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const deltaX = e.clientX - lastMouseX;
  const deltaY = e.clientY - lastMouseY;
  
  cubeRotationY += deltaX * 0.5;
  cubeRotationX -= deltaY * 0.5;
  
  cube.style.transform = `translateZ(-500px) rotateX(${cubeRotationX}deg) rotateY(${cubeRotationY}deg)`;
  
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    cube.classList.remove('dragging');
    cube.style.transition = 'transform 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  }
});

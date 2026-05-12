// script.js
// Theme toggle with sun/moon icons
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggle.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
});

// Set initial icon based on mode (default light)
toggle.textContent = '☀️';

// Fade-in sections on scroll
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
sections.forEach(section => observer.observe(section));

// Custom cursor with minimal glow
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});
document.addEventListener('mouseover', () => cursor.classList.add('glow'));
document.addEventListener('mouseout', () => cursor.classList.remove('glow'));

// Mini-game
const skillSelect = document.getElementById('skill-select');
const impactDisplay = document.getElementById('impact-display');
const impacts = {
    'solar-design': 'Impact: Optimizes panel placement to increase energy yield by up to 25%, reducing costs for large installations.',
    'energy-modeling': 'Impact: Predicts energy production accurately, preventing over 10% wastage in grid integrations.',
    'project-management': 'Impact: Delivers projects on time and under budget, boosting ROI by 15% for stakeholders.',
    'sustainable-innovation': 'Impact: Develops eco-friendly tech that cuts emissions equivalent to planting 100,000 trees annually.'
};
skillSelect.addEventListener('change', () => {
    impactDisplay.textContent = impacts[skillSelect.value] || '';
});
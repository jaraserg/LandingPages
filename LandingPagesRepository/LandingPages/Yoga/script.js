// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Schedule Tabs
function showSchedule(day) {
    const scheduleDays = document.querySelectorAll('.schedule-day');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    scheduleDays.forEach(scheduleDay => {
        scheduleDay.classList.remove('active');
    });
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeSchedule = document.getElementById(day + '-schedule');
    const activeButton = Array.from(tabButtons).find(btn => 
        btn.textContent.toLowerCase().includes(day) || 
        (day === 'weekend' && btn.textContent === 'Weekend')
    );
    
    if (activeSchedule) {
        activeSchedule.classList.add('active');
    }
    
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Booking Modal
let currentBooking = {
    class: '',
    time: ''
};

function bookClass(className, time) {
    currentBooking = { class: className, time: time };
    
    document.getElementById('bookingClass').textContent = className;
    document.getElementById('bookingTime').textContent = time;
    document.getElementById('bookingModal').style.display = 'block';
    
    // Scroll to top to show modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('bookingName').value = '';
    document.getElementById('bookingEmail').value = '';
    document.getElementById('bookingPhone').value = '';
}

function confirmBooking(event) {
    event.preventDefault();
    
    const name = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const phone = document.getElementById('bookingPhone').value;
    
    // In a real application, you would send this data to a server
    const bookingData = {
        name,
        email,
        phone,
        class: currentBooking.class,
        time: currentBooking.time,
        timestamp: new Date().toISOString()
    };
    
    console.log('Booking confirmed:', bookingData);
    
    // Show success message
    showNotification('Booking confirmed! We will send you a confirmation email shortly.');
    
    // Reset form and close modal
    closeModal();
}

// Contact Form
function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    const contactData = {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString()
    };
    
    console.log('Contact form submitted:', contactData);
    
    // Show success message
    showNotification('Message sent! We will get back to you soon.');
    
    // Reset form
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('message').value = '';
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #6B8E23;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.class-card, .instructor-card, .pricing-card, .schedule-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
});

// Generate additional schedule data
function generateScheduleData() {
    const scheduleData = {
        tuesday: [
            { time: '6:30 AM', class: 'Vinyasa Flow', instructor: 'Sarah Johnson' },
            { time: '10:00 AM', class: 'Beginner Yoga', instructor: 'Emma Davis' },
            { time: '5:30 PM', class: 'Restorative Yoga', instructor: 'Michael Chen' },
            { time: '7:00 PM', class: 'Meditation', instructor: 'Sarah Johnson' }
        ],
        wednesday: [
            { time: '7:00 AM', class: 'Beginner Yoga', instructor: 'Emma Davis' },
            { time: '12:15 PM', class: 'Meditation', instructor: 'Michael Chen' },
            { time: '6:00 PM', class: 'Vinyasa Flow', instructor: 'Sarah Johnson' }
        ],
        thursday: [
            { time: '6:30 AM', class: 'Vinyasa Flow', instructor: 'Emma Davis' },
            { time: '10:00 AM', class: 'Beginner Yoga', instructor: 'Sarah Johnson' },
            { time: '5:30 PM', class: 'Restorative Yoga', instructor: 'Michael Chen' },
            { time: '7:30 PM', class: 'Meditation', instructor: 'Emma Davis' }
        ],
        friday: [
            { time: '7:00 AM', class: 'Beginner Yoga', instructor: 'Sarah Johnson' },
            { time: '12:00 PM', class: 'Meditation', instructor: 'Michael Chen' },
            { time: '6:00 PM', class: 'Vinyasa Flow', instructor: 'Emma Davis' },
            { time: '8:00 PM', class: 'Restorative Yoga', instructor: 'Sarah Johnson' }
        ],
        weekend: [
            { time: '8:00 AM', class: 'Beginner Yoga', instructor: 'Emma Davis' },
            { time: '10:00 AM', class: 'Vinyasa Flow', instructor: 'Sarah Johnson' },
            { time: '12:00 PM', class: 'Meditation', instructor: 'Michael Chen' },
            { time: '2:00 PM', class: 'Restorative Yoga', instructor: 'Emma Davis' },
            { time: '4:00 PM', class: 'Vinyasa Flow', instructor: 'Michael Chen' }
        ]
    };
    
    return scheduleData;
}

// Create schedule elements for all days
function createScheduleElements() {
    const scheduleData = generateScheduleData();
    const scheduleContainer = document.querySelector('.schedule-content');
    
    Object.keys(scheduleData).forEach(day => {
        const daySchedule = document.createElement('div');
        daySchedule.className = 'schedule-day';
        daySchedule.id = day + '-schedule';
        
        scheduleData[day].forEach(item => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            
            scheduleItem.innerHTML = `
                <div class="time">${item.time}</div>
                <div class="class-info">
                    <h4>${item.class}</h4>
                    <p>${item.instructor}</p>
                </div>
                <button class="book-btn" onclick="bookClass('${item.class}', '${day.charAt(0).toUpperCase() + day.slice(1)} ${item.time}')">Book</button>
            `;
            
            daySchedule.appendChild(scheduleItem);
        });
        
        scheduleContainer.appendChild(daySchedule);
    });
}

// Initialize schedule when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createScheduleElements();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Smooth reveal for hero content
function revealHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Initialize hero animation
document.addEventListener('DOMContentLoaded', () => {
    revealHeroContent();
});

// Add hover effects for class cards
document.addEventListener('DOMContentLoaded', () => {
    const classCards = document.querySelectorAll('.class-card');
    
    classCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Pricing card interactions
document.addEventListener('DOMContentLoaded', () => {
    const pricingButtons = document.querySelectorAll('.pricing-card button');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.pricing-card');
            const planName = card.querySelector('h3').textContent;
            showNotification(`Great choice! You selected the ${planName}. Redirecting to payment...`);
        });
    });
});

// Social media links
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-links a, .instructor-social i');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showNotification('Opening social media page...');
        });
    });
});

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Enhanced form validation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');
    const bookingForm = document.querySelector('.modal-content form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            if (!validateEmail(email)) {
                event.preventDefault();
                showNotification('Please enter a valid email address.');
                return;
            }
            
            if (phone && !validatePhone(phone)) {
                event.preventDefault();
                showNotification('Please enter a valid phone number.');
                return;
            }
        });
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            const email = document.getElementById('bookingEmail').value;
            const phone = document.getElementById('bookingPhone').value;
            
            if (!validateEmail(email)) {
                event.preventDefault();
                showNotification('Please enter a valid email address.');
                return;
            }
            
            if (!validatePhone(phone)) {
                event.preventDefault();
                showNotification('Please enter a valid phone number.');
                return;
            }
        });
    }
});

// Loading state for buttons
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Submit';
    }
}

// Store original button text
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });
});

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScroll = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', optimizedScroll);
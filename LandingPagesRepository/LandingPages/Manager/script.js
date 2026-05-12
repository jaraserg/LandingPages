document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 0;
    const totalPages = 5;
    const pagesContainer = document.querySelector('.pages-container');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let isAnimating = false;

    // Function to go to specific page
    function goToPage(pageIndex) {
        if (isAnimating || pageIndex < 0 || pageIndex >= totalPages) return;
        if (pageIndex === currentPage) return;
        
        isAnimating = true;
        currentPage = pageIndex;
        
        // Book style RTL transition
        const offset = pageIndex * 100;
        pagesContainer.style.transform = `translateX(-${offset}vw)`;
        
        // Update nav active state
        navLinks.forEach((link, index) => {
            link.style.opacity = index === currentPage ? '1' : '0.6';
        });
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((ind, index) => {
            ind.classList.toggle('active', index === currentPage);
        });
        
        // Update nav appearance
        updateNavAppearance();
        
        // Trigger section animations
        setTimeout(() => {
            const activeSections = document.querySelectorAll('.page')[currentPage].querySelectorAll('.section');
            activeSections.forEach(section => {
                section.classList.add('visible');
            });
            isAnimating = false;
        }, 800);
    }

    // Nav links click handler
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(parseInt(this.getAttribute('data-page')));
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            goToPage(currentPage + 1);
        }
    });

    // Mouse wheel / touch swipe navigation
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY > 0 || e.deltaX > 0) {
            goToPage(currentPage + 1);
        } else {
            goToPage(currentPage - 1);
        }
    }, { passive: false });

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                goToPage(currentPage + 1);
            } else {
                goToPage(currentPage - 1);
            }
        }
    });

    // Floating contact menu toggle
    const contactToggle = document.querySelector('.contact-toggle');
    const contactMenu = document.querySelector('.contact-menu');
    
    contactToggle.addEventListener('click', function() {
        contactMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!contactToggle.contains(e.target) && !contactMenu.contains(e.target)) {
            contactMenu.classList.remove('active');
        }
    });

    // Nav scroll + page background effect
    const nav = document.querySelector('nav');
    const lightPages = [1, 2, 3]; // About, Education, Experience have white bg
    
    function updateNavAppearance() {
        if (lightPages.includes(currentPage)) {
            nav.classList.add('light');
        } else {
            nav.classList.remove('light');
        }
    }
    
    // Update nav when page changes
    const originalGoToPage = goToPage;
    goToPage = function(pageIndex) {
        originalGoToPage(pageIndex);
        setTimeout(updateNavAppearance, 100);
    }
    
    // Initial update
    updateNavAppearance();

    // Form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Indicator clicks
    document.querySelectorAll('.indicator').forEach((ind, index) => {
        ind.addEventListener('click', () => goToPage(index));
    });

    // Initialize first page
    setTimeout(() => goToPage(0), 100);
});
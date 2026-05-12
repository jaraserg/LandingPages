document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentPanels = document.querySelectorAll('.content-panel');
    const heroImg = document.getElementById('hero-img');
    const fabMain = document.getElementById('fab-main');
    const fabLinks = document.getElementById('fab-links');

    // Floating Action Button logic for Touch/Click behavior
    if (fabMain && fabLinks) {
        fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            fabLinks.classList.toggle('open');
        });

        // Close when clicking anywhere outside
        document.addEventListener('click', (e) => {
            // Check if click was outside both the button and the links container
            if (!fabMain.contains(e.target) && !fabLinks.contains(e.target)) {
                fabLinks.classList.remove('open');
            }
        });
    }

    // Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navItems.forEach(n => n.classList.remove('active-link'));

            // Add active class to clicked link
            item.classList.add('active-link');

            const targetId = item.getAttribute('data-target');

            // Hide all panels and the hero image
            contentPanels.forEach(p => p.classList.remove('active'));
            heroImg.classList.remove('active');

            // Show the targeted element
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    // Toggle FAB menu on mobile or click
    // The CSS hover already handles most of this for desktop, 
    // but a click toggle is good for mobile.
    fabMain.addEventListener('click', () => {
        const isExpanded = fabLinks.style.opacity === '1';
        if (isExpanded) {
            fabLinks.style.opacity = '0';
            fabLinks.style.pointerEvents = 'none';
            fabLinks.style.transform = 'translateY(20px)';
        } else {
            fabLinks.style.opacity = '1';
            fabLinks.style.pointerEvents = 'auto';
            fabLinks.style.transform = 'translateY(0)';
        }
    });

    // Initialize Home link as active
    navItems[0].classList.add('active-link');
});

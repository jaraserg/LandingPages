document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentPanels = document.querySelectorAll('.content-panel');
    const fabMain = document.getElementById('fab-main');
    const fabLinks = document.getElementById('fab-links');

    // Navigation Interactions
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status from all buttons & panels
            navBtns.forEach(b => b.classList.remove('active-btn'));
            contentPanels.forEach(p => p.classList.remove('active'));

            // Add active status to clicked button
            btn.classList.add('active-btn');

            // Find matching panel and activate it
            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Mobile FAB Interaction Toggle
    fabMain.addEventListener('click', (e) => {
        e.stopPropagation();
        fabLinks.classList.toggle('open');
    });

    // Close FAB when clicking outside
    document.addEventListener('click', (e) => {
        if (!fabMain.contains(e.target) && !fabLinks.contains(e.target)) {
            fabLinks.classList.remove('open');
        }
    });

    // Project Image Modal Logic
    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('modal-caption');
    const projectImages = document.querySelectorAll('.project-img');
    const closeModal = document.getElementById('close-modal');

    if (modal && projectImages.length > 0) {
        projectImages.forEach(img => {
            img.addEventListener('click', function () {
                modal.classList.add('show-modal');
                // Use a higher res version of the same image if possible, or just the same src
                // Here we just use the same source but it will render larger due to CSS
                modalImg.src = this.src.replace('&w=300', '&w=800');
                captionText.innerHTML = this.alt;
            });
        });

        // Close on X click
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show-modal');
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show-modal');
            }
        });
    }
});

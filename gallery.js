document.addEventListener('DOMContentLoaded', () => {
    // Existing gallery code
    const gallery = document.getElementById('gallery');
    const imageFiles = [
        'design1.jpg',
        'design2.jpg',
        'design3.jpg',
        'design4.jpg',
        'design5.jpg',
        'design6.jpg',
        'design7.jpg',
        'design8.jpg'
    ];

    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'gallery-dots';
    gallery.parentNode.insertBefore(dotsContainer, gallery.nextSibling);

    // Create dots
    imageFiles.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'gallery-dot';
        if (index === 0) dot.classList.add('active');
        
        const handleDotClick = (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openModal(imageFiles[index]);
            updateDots();
        };
        
        dot.addEventListener('click', handleDotClick);
        dot.addEventListener('touchstart', handleDotClick, { passive: false });
        
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentImageIndex);
        });
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">×</span>
            <img id="modal-image" src="" alt="Full size image">
            <div class="modal-controls">
                <button class="modal-nav-btn prev-btn">❮</button>
                <button class="modal-nav-btn next-btn">❯</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('#modal-image');
    const closeBtn = modal.querySelector('.close');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    imageFiles.forEach((filename, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `image/designs/${filename}`;
        img.alt = 'Design Image';
        
        const overlay = document.createElement('div');
        overlay.className = 'view-full-overlay';
        overlay.innerHTML = '<button class="view-full-btn">View Full</button>';
        
        img.onerror = function() {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'image-error';
            errorDiv.innerHTML = `
                <div class="error-content">
                    <span class="error-icon">⚠️</span>
                    <p>Image not found</p>
                    <small>${filename}</small>
                </div>
            `;
            this.parentNode.replaceChild(errorDiv, this);
        };
        
        const handleViewFull = (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openModal(filename);
            updateDots();
        };
        
        overlay.querySelector('.view-full-btn').addEventListener('click', handleViewFull);
        overlay.querySelector('.view-full-btn').addEventListener('touchstart', handleViewFull, { passive: false });
        
        item.appendChild(img);
        item.appendChild(overlay);
        gallery.appendChild(item);
    });

    function openModal(filename) {
        modal.style.display = 'block';
        modalImg.src = `image/designs/${filename}`;
        document.body.style.overflow = 'hidden';
        updateDots();
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageFiles.length;
        modalImg.src = `image/designs/${imageFiles[currentImageIndex]}`;
        updateDots();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageFiles.length) % imageFiles.length;
        modalImg.src = `image/designs/${imageFiles[currentImageIndex]}`;
        updateDots();
    }

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }

    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // New hamburger menu functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });
});
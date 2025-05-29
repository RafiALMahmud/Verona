document.addEventListener('DOMContentLoaded', () => {
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

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img id="modal-image" src="" alt="Full size image">
            <div class="modal-controls">
                <button class="modal-nav-btn prev-btn">&#10094;</button>
                <button class="modal-nav-btn next-btn">&#10095;</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal elements
    const modalImg = modal.querySelector('#modal-image');
    const closeBtn = modal.querySelector('.close');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    let currentImageIndex = 0;

    // Load all 8 images
    imageFiles.forEach((filename, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `image/designs/${filename}`;
        img.alt = 'Design Image';
        
        // Add view full overlay
        const overlay = document.createElement('div');
        overlay.className = 'view-full-overlay';
        overlay.innerHTML = '<button class="view-full-btn">View Full</button>';
        
        // Enhanced error handling
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
        
        // View full button click handler
        overlay.querySelector('.view-full-btn').addEventListener('click', () => {
            currentImageIndex = index;
            openModal(filename);
        });
        
        item.appendChild(img);
        item.appendChild(overlay);
        gallery.appendChild(item);
    });

    // Modal functions
    function openModal(filename) {
        modal.style.display = 'block';
        modalImg.src = `image/designs/${filename}`;
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageFiles.length;
        modalImg.src = `image/designs/${imageFiles[currentImageIndex]}`;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageFiles.length) % imageFiles.length;
        modalImg.src = `image/designs/${imageFiles[currentImageIndex]}`;
    }

    // Event listeners for modal
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
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
}); 
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

    // Load all 8 images
    imageFiles.forEach(filename => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `image/designs/${filename}`;
        img.alt = 'Design Image';
        
        // Enhanced error handling
        img.onerror = function() {
            // Create a fallback div with error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'image-error';
            errorDiv.innerHTML = `
                <div class="error-content">
                    <span class="error-icon">⚠️</span>
                    <p>Image not found</p>
                    <small>${filename}</small>
                </div>
            `;
            // Replace the image with error message
            this.parentNode.replaceChild(errorDiv, this);
        };
        
        item.appendChild(img);
        gallery.appendChild(item);
    });
}); 
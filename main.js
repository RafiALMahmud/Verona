// Image file extensions to look for
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

// Default image filenames to try (you can modify this list)
const defaultImageNames = [
    'marble1', 'marble2', 'marble3', 'marble4', 'marble5',
    'granite1', 'granite2', 'granite3', 'granite4', 'granite5',
    'stone1', 'stone2', 'stone3', 'stone4', 'stone5',
    'sample1', 'sample2', 'sample3', 'sample4', 'sample5',
    'gallery1', 'gallery2', 'gallery3', 'gallery4', 'gallery5',
    'product1', 'product2', 'product3', 'product4', 'product5'
];

// Store found images
let availableImages = [];
let galleryImages = [];
let currentIndex = 0;
let intervalId;
let isPlaying = true;

// Product descriptions based on image names
const productDescriptions = {
    marble: "Premium marble slabs with natural veining and elegant patterns, perfect for luxury applications.",
    granite: "Durable granite surfaces with stunning natural colors and textures for lasting beauty.",
    stone: "High-quality natural stone selections offering unique character for any project.",
    sample: "Carefully curated stone samples showcasing the finest materials and finishes.",
    gallery: "Featured installations and completed projects showcasing our craftsmanship.",
    product: "Premium stone products from our extensive collection of natural materials."
};

// Function to check if image exists
async function imageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Function to find available images in the images folder
async function findAvailableImages() {
    const foundImages = [];
    
    for (const name of defaultImageNames) {
        for (const ext of imageExtensions) {
            const imagePath = `images/${name}.${ext}`;
            if (await imageExists(imagePath)) {
                foundImages.push({
                    path: imagePath,
                    name: name,
                    type: name.replace(/\d+$/, '') // Remove numbers to get type
                });
                break; // Found this image, try next name
            }
        }
    }
    
    return foundImages;
}

// Function to get product title and description
function getProductInfo(imageName) {
    const type = imageName.replace(/\d+$/, '');
    const number = imageName.match(/\d+$/)?.[0] || '1';
    
    const titles = {
        marble: `Premium Marble Collection ${number}`,
        granite: `Granite Slab Series ${number}`,
        stone: `Natural Stone Selection ${number}`,
        sample: `Stone Sample Set ${number}`,
        gallery: `Gallery Showcase ${number}`,
        product: `Featured Product ${number}`
    };
    
    const title = titles[type] || `Premium Stone ${number}`;
    const description = productDescriptions[type] || productDescriptions.stone;
    
    return { title, description };
}

// Function to populate products section
function populateProducts(images) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    // Take first 6 images for products, or all if less than 6
    const productImages = images.slice(0, 6);
    
    productImages.forEach((image) => {
        const { title, description } = getProductInfo(image.name);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${image.path}" alt="${title}" loading="lazy">
                <div class="view-full-overlay">
                    <button class="view-full-btn" onclick="viewFullImage('${image.path}')">View Full</button>
                </div>
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Function to populate gallery section
function populateGallery(images) {
    const galleryImagesContainer = document.getElementById('galleryImages');
    galleryImagesContainer.innerHTML = '';
    
    if (images.length === 0) {
        galleryImagesContainer.innerHTML = '<p style="color: white; text-align: center;">No images found in the images folder.</p>';
        return;
    }
    
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.path;
        img.alt = `Gallery Image ${index + 1}`;
        img.className = 'gallery-img';
        img.loading = 'lazy';
        
        if (index === 0) {
            img.classList.add('active');
        }
        
        // Add click event for full image modal
        img.addEventListener('click', () => {
            openFullImageModal(image.path, index, images);
        });
        
        galleryImagesContainer.appendChild(img);
    });
    
    // Update global galleryImages reference
    galleryImages = document.querySelectorAll('.gallery-img');
    
    // Create dots after images are loaded
    createDots();
    
    // Start slideshow if images exist
    if (images.length > 1) {
        startSlideshow();
    }
}

// Function to view full image (for product cards)
function viewFullImage(imageSrc) {
    const imageIndex = availableImages.findIndex(img => img.path === imageSrc);
    openFullImageModal(imageSrc, imageIndex >= 0 ? imageIndex : 0, availableImages);
}

// Create dots for gallery navigation
function createDots() {
    const dotsContainer = document.querySelector('.gallery-dots');
    dotsContainer.innerHTML = '';
    
    galleryImages.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

// Update dots active state
function updateDots(index) {
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Show specific image
function showImage(index) {
    galleryImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    updateDots(index);
}

// Navigate to specific slide
function goToSlide(index) {
    currentIndex = index;
    showImage(currentIndex);
    resetSlideshow();
}

// Next image with smooth transition
function nextImage() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showImage(currentIndex);
}

// Previous image with smooth transition
function prevImage() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(currentIndex);
}

// Start slideshow
function startSlideshow() {
    if (isPlaying && galleryImages.length > 1) {
        intervalId = setInterval(nextImage, 4000);
    }
}

// Stop slideshow
function stopSlideshow() {
    clearInterval(intervalId);
}

// Reset slideshow (restart timer)
function resetSlideshow() {
    stopSlideshow();
    startSlideshow();
}

// Toggle slideshow play/pause
function toggleSlideshow() {
    isPlaying = !isPlaying;
    const toggleBtn = document.getElementById('toggle-slideshow');
    toggleBtn.textContent = isPlaying ? 'Pause Slideshow' : 'Play Slideshow';
    
    if (isPlaying) {
        startSlideshow();
    } else {
        stopSlideshow();
    }
}

// Full Image Modal functionality
const modal = document.getElementById('fullImageModal');
const modalImg = document.getElementById('fullImage');
const closeBtn = document.querySelector('.close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
let currentModalImages = [];
let currentModalIndex = 0;

function openFullImageModal(imageSrc, index, imagesArray) {
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    currentModalImages = imagesArray;
    currentModalIndex = index;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showModalImage(index) {
    if (currentModalImages[index]) {
        const imagePath = currentModalImages[index].path || currentModalImages[index].src;
        modalImg.src = imagePath;
        currentModalIndex = index;
    }
}

function nextModalImage() {
    const nextIndex = (currentModalIndex + 1) % currentModalImages.length;
    showModalImage(nextIndex);
}

function prevModalImage() {
    const prevIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
    showModalImage(prevIndex);
}

// Initialize the application
async function initializeApp() {
    console.log('Looking for images in the images folder...');
    
    // Find available images
    availableImages = await findAvailableImages();
    
    console.log(`Found ${availableImages.length} images:`, availableImages.map(img => img.path));
    
    // Populate products and gallery
    populateProducts(availableImages);
    populateGallery(availableImages);
    
    // Set up event listeners after images are loaded
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Gallery navigation
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevImage();
            resetSlideshow();
        });

        nextBtn.addEventListener('click', () => {
            nextImage();
            resetSlideshow();
        });
    }

    // Hover pause functionality
    const galleryImagesContainer = document.querySelector('.gallery-images');
    if (galleryImagesContainer) {
        galleryImagesContainer.addEventListener('mouseenter', stopSlideshow);
        galleryImagesContainer.addEventListener('mouseleave', () => {
            if (isPlaying) startSlideshow();
        });
    }

    // Toggle slideshow button
    const toggleSlideshowBtn = document.getElementById('toggle-slideshow');
    if (toggleSlideshowBtn) {
        toggleSlideshowBtn.addEventListener('click', toggleSlideshow);
    }

    // View Gallery Full Image button
    const viewGalleryFullBtn = document.getElementById('view-gallery-full');
    if (viewGalleryFullBtn) {
        viewGalleryFullBtn.addEventListener('click', () => {
            const activeImg = document.querySelector('.gallery-img.active');
            if (activeImg && availableImages.length > 0) {
                const activeIndex = Array.from(galleryImages).indexOf(activeImg);
                openFullImageModal(activeImg.src, activeIndex, availableImages);
            }
        });
    }

    // Modal event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', prevModalImage);
    }

    if (modalNext) {
        modalNext.addEventListener('click', nextModalImage);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    prevModalImage();
                    break;
                case 'ArrowRight':
                    nextModalImage();
                    break;
            }
        }
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navUl = document.querySelector('nav ul');
    
    if (navToggle && navUl) {
        navToggle.addEventListener('click', () => {
            navUl.classList.toggle('open');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make viewFullImage globally available for onclick handlers
window.viewFullImage = viewFullImage;

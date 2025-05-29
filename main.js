// Enhanced Gallery Carousel Functionality
const galleryImages = document.querySelectorAll('.gallery-img');
const prevBtn = document.querySelector('.gallery-prev');
const nextBtn = document.querySelector('.gallery-next');
const dotsContainer = document.querySelector('.gallery-dots');
const toggleSlideshowBtn = document.getElementById('toggle-slideshow');
let currentIndex = 0;
let intervalId;
let isPlaying = true;

// Create dots for gallery navigation
function createDots() {
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
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showImage(currentIndex);
}

// Previous image with smooth transition
function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(currentIndex);
}

// Start slideshow
function startSlideshow() {
    if (isPlaying) {
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
    toggleSlideshowBtn.textContent = isPlaying ? 'Pause Slideshow' : 'Play Slideshow';
    
    if (isPlaying) {
        startSlideshow();
    } else {
        stopSlideshow();
    }
}

// Event listeners for gallery
nextBtn.addEventListener('click', () => {
    nextImage();
    resetSlideshow();
});

prevBtn.addEventListener('click', () => {
    prevImage();
    resetSlideshow();
});

// Hover pause functionality
document.querySelector('.gallery-images').addEventListener('mouseenter', stopSlideshow);
document.querySelector('.gallery-images').addEventListener('mouseleave', () => {
    if (isPlaying) startSlideshow();
});

// Click on image to view full size
galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        openFullImageModal(img.src, index, galleryImages);
    });
});

// Toggle slideshow button
toggleSlideshowBtn.addEventListener('click', toggleSlideshow);

// View Gallery Full Image button functionality
const viewGalleryFullBtn = document.getElementById('view-gallery-full');
viewGalleryFullBtn.addEventListener('click', () => {
    const activeImg = document.querySelector('.gallery-img.active');
    if (activeImg) {
        const activeIndex = Array.from(galleryImages).indexOf(activeImg);
        openFullImageModal(activeImg.src, activeIndex, galleryImages);
    }
});

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
    currentModalImages = Array.from(imagesArray);
    currentModalIndex = index;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showModalImage(index) {
    if (currentModalImages[index]) {
        modalImg.src = currentModalImages[index].src;
        currentModalIndex = index;
    }
}

function nextModalImage() {
    const nextIndex = (currentModalIndex + 1) % currentModalImages.

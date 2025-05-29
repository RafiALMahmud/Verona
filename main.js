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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function showModalImage(index) {
    if (currentModalImages[index]) {
        modalImg.src = currentModalImages[index].src;
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

// Modal event listeners
closeBtn.addEventListener('click', closeModal);
modalNext.addEventListener('click', nextModalImage);
modalPrev.addEventListener('click', prevModalImage);

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

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

// Product image view full functionality
function viewFullImage(img) {
    openFullImageModal(img.src, 0, [img]);
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navUl = document.querySelector('nav ul');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
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
        
        // Close mobile menu if open
        if (navUl.classList.contains('open')) {
            navToggle.classList.remove('open');
            navUl.classList.remove('open');
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Here you would typically send the data to a server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Initialize gallery
createDots();
showImage(currentIndex);
startSlideshow();

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.2s';
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
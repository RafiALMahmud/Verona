// Gallery Carousel Functionality
const galleryImages = document.querySelectorAll('.gallery-img');
const prevBtn = document.querySelector('.gallery-prev');
const nextBtn = document.querySelector('.gallery-next');
let currentIndex = 0;
let intervalId;

function showImage(index) {
    galleryImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(currentIndex);
}

function startSlideshow() {
    intervalId = setInterval(nextImage, 3000);
}

function stopSlideshow() {
    clearInterval(intervalId);
}

nextBtn.addEventListener('click', () => {
    nextImage();
    stopSlideshow();
    startSlideshow();
});

prevBtn.addEventListener('click', () => {
    prevImage();
    stopSlideshow();
    startSlideshow();
});

document.querySelector('.gallery-images').addEventListener('mouseenter', stopSlideshow);
document.querySelector('.gallery-images').addEventListener('mouseleave', startSlideshow);

// View Full Image button functionality
const viewFullImageBtn = document.getElementById('view-full-image');
viewFullImageBtn.addEventListener('click', () => {
    const activeImg = document.querySelector('.gallery-img.active');
    if (activeImg) {
        window.open(activeImg.src, '_blank');
    }
});

// Initialize
showImage(currentIndex);
startSlideshow(); 
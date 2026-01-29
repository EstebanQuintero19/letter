let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;
let autoPlayInterval;
let audioPlayer;
let isPlaying = false;

// Inicializar el reproductor de audio
window.addEventListener('DOMContentLoaded', () => {
    audioPlayer = document.getElementById('background-music');
    audioPlayer.volume = 0.5; // Volumen al 50%
    
    const musicControl = document.getElementById('musicControl');
    musicControl.addEventListener('click', toggleMusic);
    
    // Intentar reproducir automáticamente después de una pequeña interacción
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            audioPlayer.play().then(() => {
                isPlaying = true;
                musicControl.querySelector('.play-icon').style.display = 'none';
                musicControl.querySelector('.pause-icon').style.display = 'block';
                musicControl.classList.add('playing');
            }).catch(error => {
                console.log('Error reproduciendo audio:', error);
            });
        }
    }, { once: true }); // Solo se ejecuta una vez
});

function toggleMusic() {
    const musicControl = document.getElementById('musicControl');
    const playIcon = musicControl.querySelector('.play-icon');
    const pauseIcon = musicControl.querySelector('.pause-icon');
    
    if (!isPlaying) {
        audioPlayer.play();
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        musicControl.classList.add('playing');
    } else {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        musicControl.classList.remove('playing');
    }
}

// Function to show a specific slide
function showSlide(index) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add('exit');
    dots[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = index;
    
    // Add active class to new slide
    setTimeout(() => {
        slides.forEach(slide => slide.classList.remove('exit'));
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }, 100);
}

// Function to go to next slide
function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    showSlide(nextIndex);
}

// Function to go to previous slide
function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
}

// Auto play functionality - change slide every 10 seconds
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 10000); // 10 seconds
}

// Stop auto play
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Add click handlers to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoPlay();
        showSlide(index);
        startAutoPlay();
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    } else if (e.key === 'ArrowLeft') {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.letter').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.letter').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    }
}

// Start auto play when page loads
startAutoPlay();

// Pause auto play when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// Add sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '20px';
    sparkle.style.zIndex = '9999';
    sparkle.textContent = ['✨', '💖', '⭐', '💫'][Math.floor(Math.random() * 4)];
    sparkle.style.animation = 'sparkleFloat 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

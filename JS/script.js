function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });     
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));   
    const sections = document.querySelectorAll('section, footer');
    sections.forEach((section, index) => {
        if (section.id === sectionId) {
            buttons[index].classList.add('active');
        }
    });
}

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section, footer');
    const buttons = document.querySelectorAll('.nav-btn');
    let currentSection = '';     
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            currentSection = section.getAttribute('id');
        }
    });  
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(currentSection)) {
            btn.classList.add('active');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }    
    function checkAnimation() {
        animatedElements.forEach(el => {
            if (isElementInViewport(el) && !el.classList.contains('animated')) {
                el.classList.add('animated');
            }
        });
    }     
    checkAnimation();
            
    window.addEventListener('scroll', checkAnimation);
    const themeToggle = document.querySelector('.switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});
window.addEventListener('scroll', function() {
    const cta = document.querySelector('.cta');
    if (!cta) return;
    const rect = cta.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight && rect.bottom > 0) {
        let scrollPos = window.scrollY - cta.offsetTop;
        cta.style.backgroundPositionY = `${scrollPos * 0.4}px`;
    }
});

const canvas = document.getElementById("squares");
const ctx = canvas.getContext("2d");
let direction = "down";
let speed = 0.5;
let borderColor = "#4414b4";
let squareSize = 45;
let hoverFillColor = "#222";
let gridOffset = { x: 0, y: 0 };
let hoveredSquare = null;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const startX = Math.floor(gridOffset.x / squareSize) * squareSize;
    const startY = Math.floor(gridOffset.y / squareSize) * squareSize;
    for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
            const squareX = x - (gridOffset.x % squareSize);
            const squareY = y - (gridOffset.y % squareSize);

            if (
                hoveredSquare &&
                Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
                Math.floor((y - startY) / squareSize) === hoveredSquare.y
            ) {
                ctx.fillStyle = hoverFillColor;
                ctx.fillRect(squareX, squareY, squareSize, squareSize);
            }

            ctx.strokeStyle = borderColor;
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
    }
}
function updateAnimation() {
    const effectiveSpeed = Math.max(speed, 0.1);
    switch (direction) {
        case "right":
            gridOffset.x = (gridOffset.x - effectiveSpeed + squareSize) % squareSize;
            break;
        case "left":
            gridOffset.x = (gridOffset.x + effectiveSpeed + squareSize) % squareSize;
            break;
        case "up":
            gridOffset.y = (gridOffset.y + effectiveSpeed + squareSize) % squareSize;
            break;
        case "down":
            gridOffset.y = (gridOffset.y - effectiveSpeed + squareSize) % squareSize;
            break;
        case "diagonal":
            gridOffset.x = (gridOffset.x - effectiveSpeed + squareSize) % squareSize;
            gridOffset.y = (gridOffset.y - effectiveSpeed + squareSize) % squareSize;
            break;
    }
    drawGrid();
    requestAnimationFrame(updateAnimation);
}
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const startX = Math.floor(gridOffset.x / squareSize) * squareSize;
    const startY = Math.floor(gridOffset.y / squareSize) * squareSize;

    hoveredSquare = {
        x: Math.floor((mouseX + gridOffset.x - startX) / squareSize),
        y: Math.floor((mouseY + gridOffset.y - startY) / squareSize),
    };
});
canvas.addEventListener("mouseleave", () => {
    hoveredSquare = null;
});
updateAnimation();

const carousel = document.querySelector('.carousel');
let startX = 0;
let currentRotation = 0;    
let isDragging = false;
const angleStep = 40;
const rotationSpeed = 0.2;
const rotateCarousel = (angle) => {
    carousel.style.transform = `rotateY(${angle}deg)`;
};
const snapToNearest = () => {
    const snappedAngle = Math.round(currentRotation / angleStep) * angleStep;
    currentRotation = snappedAngle;
    rotateCarousel(currentRotation);
};
document.querySelector('.scene').addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    carousel.style.transition = 'none';
    e.preventDefault();
});
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const rotationDelta = deltaX * rotationSpeed;
    rotateCarousel(currentRotation + rotationDelta);
});
document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = e.clientX - startX;
    currentRotation += deltaX * rotationSpeed;
    carousel.style.transition = 'transform 1s ease';
    snapToNearest();
});
document.querySelector('.scene').addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    carousel.style.transition = 'none';
    e.preventDefault();
});
document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const rotationDelta = deltaX * rotationSpeed;  
    rotateCarousel(currentRotation + rotationDelta);
});
document.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = e.changedTouches[0].clientX - startX;
    currentRotation += deltaX * rotationSpeed;
    carousel.style.transition = 'transform 1s ease';
    snapToNearest();
});
rotateCarousel(currentRotation);
 
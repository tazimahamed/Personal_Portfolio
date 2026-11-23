function downloadResume(){

const link=document.createElement("a");

link.href="images/Tazim_Ahamed.pdf";

link.download="Tazim_Ahamed_Resume.pdf";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

}

function scrollToSection(id){

document.getElementById(id).scrollIntoView({

behavior:"smooth"

});

}

function playVideo() {
    const container = document.getElementById('videoContainer');
    
    // Define your video source here
    const videoSrc = "images/Tazim_Project_Demo.mp4"; 

    // Create the video element
    const videoHTML = `
        <video width="100%" height="100%" controls autoplay style="border-radius: 15px;">
            <source src="${videoSrc}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;

    // Replace the placeholder icon/text with the actual video
    container.innerHTML = videoHTML;
    
    // Remove the dashed border and padding once the video is active
    container.style.border = "none";
    container.style.background = "black";
}

// Your existing functions
function downloadResume() {
    const link = document.createElement("a");
    link.href = "images/Tazim_Ahamed.pdf";
    link.download = "Tazim_Ahamed_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.skill-card');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents immediate reset

            // 1. If the card is already active, reset everything
            if (card.classList.contains('active')) {
                resetCards();
                return;
            }

            // 2. Clear previous states
            resetCards();

            // 3. Set current card to Active and others to Dimmed
            card.classList.add('active');
            cards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.add('dimmed');
                }
            });
        });
    });

    // Reset when clicking anywhere else on the page
    document.addEventListener('click', () => {
        resetCards();
    });

    function resetCards() {
        cards.forEach(c => {
            c.classList.remove('active');
            c.classList.remove('dimmed');
        });
    }
});

// 1. Function to handle clicking/expanding a project
function toggleProject(card) {
    // Close other expanded cards (optional)
    document.querySelectorAll('.project-card').forEach(c => {
        if (c !== card) c.classList.remove('expanded');
    });
    
    // Toggle the clicked card
    card.classList.toggle('expanded');
}

// 2. Automatic Image Slideshow (Every 3 seconds)
function startImageSlideshow() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('img');
        if (images.length <= 1) return; // Skip if only one image

        let currentIndex = 0;
        
        setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }, 3000); // 3000ms = 3 seconds
    });
}
document.addEventListener("DOMContentLoaded",()=>{

startImageSlideshow();

document.querySelectorAll(".visit-link").forEach(link=>{

link.addEventListener("click",(e)=>{

e.stopPropagation();

});

});

});



const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.contact-item').forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});

document.addEventListener("DOMContentLoaded", function () {

    // Initialize Tilt Effect
    VanillaTilt.init(document.querySelectorAll(".3d-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });

    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) rotateX(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(50px) rotateX(-10deg)";
        item.style.transition = "all 0.8s ease-out";
        observer.observe(item);
    });

});
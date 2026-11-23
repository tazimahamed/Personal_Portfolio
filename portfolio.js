/* ---------- Actions used by buttons in the page ---------- */

function downloadResume() {
    const link = document.createElement("a");
    link.href = "images/Tazim_Ahamed.pdf";
    link.download = "Tazim_Ahamed_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function playVideo() {
    const container = document.getElementById("videoContainer");
    container.innerHTML = `
        <video width="100%" height="100%" controls autoplay style="display:block;object-fit:cover;">
            <source src="images/Tazim_Project_Demo.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    container.onclick = null;
}

function toggleProject(card) {
    document.querySelectorAll(".project-card").forEach(c => {
        if (c !== card) c.classList.remove("expanded");
    });
    card.classList.toggle("expanded");
}

/* ---------- Page behaviour ---------- */

document.documentElement.classList.add("js");

/* Safety net: whatever happens with animations, show the content */
window.addEventListener("load", () => {
    setTimeout(() => document.documentElement.classList.add("motion-done"), 2500);
});

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Project image slideshows */
    document.querySelectorAll(".image-slider").forEach(slider => {
        const images = slider.querySelectorAll("img");
        if (images.length <= 1) return;
        let i = 0;
        setInterval(() => {
            images[i].classList.remove("active");
            i = (i + 1) % images.length;
            images[i].classList.add("active");
        }, 3200);
    });

    /* Links inside a project card should not toggle the card */
    document.querySelectorAll(".visit-link").forEach(link => {
        link.addEventListener("click", e => e.stopPropagation());
    });

    /* Typed role line in the hero */
    const typedEl = document.querySelector(".hero-role .typed");
    if (typedEl) {
        const roles = [
            "Machine Learning Engineer",
            "Computer Vision Researcher",
            "NLP & LLM Developer",
            "IoT Systems Builder"
        ];
        if (reduceMotion) {
            typedEl.textContent = roles[0];
        } else {
            let r = 0, c = 0, deleting = false;
            const tick = () => {
                const word = roles[r];
                typedEl.textContent = word.slice(0, c);
                if (!deleting && c < word.length) { c++; setTimeout(tick, 70); }
                else if (!deleting) { deleting = true; setTimeout(tick, 1800); }
                else if (c > 0) { c--; setTimeout(tick, 35); }
                else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 350); }
            };
            setTimeout(tick, 900);
        }
    }

    /* Scroll reveal with a gentle stagger inside each group */
    const revealGroups = [
        ".section-title",
        ".video-section",
        ".skills-grid .skill-card",
        ".projects-grid .project-card",
        ".timeline-item",
        ".contact-intro",
        ".contact-item"
    ];
    revealGroups.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, idx) => {
            el.classList.add("reveal");
            el.style.setProperty("--delay", `${Math.min(idx, 5) * 0.08}s`);
        });
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* Cursor spotlight on cards */
    document.querySelectorAll(".skill-card, .project-card, .timeline-content, .video-section, .contact-item").forEach(card => {
        card.classList.add("spotlight");
        card.addEventListener("pointermove", e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
    });

    /* Nav state, scroll progress, timeline fill, active link */
    const nav = document.querySelector("nav");
    const progress = document.querySelector(".scroll-progress");
    const timeline = document.querySelector(".timeline");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const sections = [...navLinks].map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

    const onScroll = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        nav.classList.toggle("scrolled", y > 20);
        if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

        if (timeline) {
            const r = timeline.getBoundingClientRect();
            const start = window.innerHeight * 0.75;
            const p = Math.min(Math.max((start - r.top) / r.height, 0), 1);
            timeline.style.setProperty("--progress", p.toFixed(3));
        }

        let current = sections[0];
        sections.forEach(sec => { if (sec.getBoundingClientRect().top <= 120) current = sec; });
        navLinks.forEach(a => a.classList.toggle("active", current && a.getAttribute("href") === `#${current.id}`));
    };

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    onScroll();
});

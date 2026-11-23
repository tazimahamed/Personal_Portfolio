/* ---------- Actions used by buttons in the page ---------- */

function downloadResume() {
    const link = document.createElement("a");
    link.href = "images/Tazim_Ahamed.pdf";
    link.download = "Tazim_Ahamed_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function playVideo() {
    const container = document.getElementById("videoContainer");
    container.innerHTML = `
        <video width="100%" height="100%" controls autoplay style="display:block;width:100%;height:100%;object-fit:cover;background:#000;">
            <source src="images/Tazim_Project_Demo.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    container.onclick = null;
}

/* ---------- Page behaviour ---------- */

document.documentElement.classList.add("js");

/* Safety net: if animations are paused or blocked, still show the hero */
window.addEventListener("load", () => {
    setTimeout(() => document.documentElement.classList.add("motion-done"), 2600);
});

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Image slideshows */
    document.querySelectorAll(".image-slider").forEach((slider, idx) => {
        const images = slider.querySelectorAll("img");
        if (images.length <= 1) return;
        let i = 0;
        setTimeout(() => {
            setInterval(() => {
                images[i].classList.remove("active");
                i = (i + 1) % images.length;
                images[i].classList.add("active");
            }, 3400);
        }, idx * 450);
    });

    /* Typed role in the hero tag */
    const typedEl = document.querySelector(".role-tag .typed");
    if (typedEl && !reduceMotion) {
        const roles = [
            "Machine Learning Engineer",
            "Computer Vision Researcher",
            "NLP & LLM Developer",
            "IoT Systems Builder",
            "Full-Stack Developer"
        ];
        let r = 0, c = roles[0].length, deleting = false;
        const tick = () => {
            const word = roles[r];
            typedEl.textContent = word.slice(0, c);
            if (!deleting && c < word.length) { c++; setTimeout(tick, 65); }
            else if (!deleting) { deleting = true; setTimeout(tick, 1900); }
            else if (c > 0) { c--; setTimeout(tick, 32); }
            else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
        };
        setTimeout(() => { deleting = true; tick(); }, 2600);
    }

    /* Scroll reveal with a small stagger inside each group */
    const groups = [
        ".section-head", ".about-copy", ".about-side", ".journey-head",
        ".pick", ".more-head", ".more-grid .mini", ".paper, .award",
        ".edu-list .edu-card", ".contact-card"
    ];
    groups.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, idx) => {
            el.classList.add("reveal");
            el.style.setProperty("--delay", `${Math.min(idx, 5) * 0.09}s`);
        });
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* Count-up stats */
    const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimals || "0", 10);
            if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
            const start = performance.now();
            const dur = 1600;
            const step = now => {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = (target * eased).toFixed(decimals);
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll(".stat-num").forEach(el => countObserver.observe(el));
    /* Skills doors */
    const doorsWrap = document.querySelector(".doors");
    if (doorsWrap) {
        new IntersectionObserver((entries, obs) => {
            entries.forEach(e => { if (e.isIntersecting) { doorsWrap.classList.add("in-view"); obs.disconnect(); } });
        }, { threshold: 0.15 }).observe(doorsWrap);

        const doors = doorsWrap.querySelectorAll(".door");
        const setOpen = (door, open) => {
            door.classList.toggle("open", open);
            door.setAttribute("aria-expanded", String(open));
        };
        doors.forEach(door => {
            door.addEventListener("click", () => setOpen(door, !door.classList.contains("open")));
            door.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(door, !door.classList.contains("open")); }
            });
        });

        /* Touch screens have no hover, so open each door as it scrolls into view */
        if (!window.matchMedia("(hover: hover)").matches) {
            const autoOpen = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    setTimeout(() => setOpen(e.target, true), 500);
                    autoOpen.unobserve(e.target);
                });
            }, { threshold: 0.7 });
            doors.forEach(d => autoOpen.observe(d));
        }
    }

    /* Journey: click a milestone to open its details */
    document.querySelectorAll(".j-item").forEach(item => {
        const toggle = () => {
            const open = !item.classList.contains("open");
            document.querySelectorAll(".j-item.open").forEach(o => {
                if (o !== item) { o.classList.remove("open"); o.setAttribute("aria-expanded", "false"); }
            });
            item.classList.toggle("open", open);
            item.setAttribute("aria-expanded", String(open));
        };
        item.addEventListener("click", e => {
            if (e.target.closest("a")) return;   // links inside work normally
            toggle();
        });
        item.addEventListener("keydown", e => {
            if (e.target !== item) return;
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
        });
    });

    /* Journey: big year follows the item in focus */
    const yearEl = document.querySelector(".year-current");
    const items = [...document.querySelectorAll(".j-item")];
    const journeyList = document.querySelector(".journey-list");
    let shownYear = yearEl ? yearEl.textContent : "";

    const setYear = year => {
        if (!yearEl || year === shownYear) return;
        shownYear = year;
        yearEl.classList.add("out-up");
        setTimeout(() => {
            yearEl.textContent = year;
            yearEl.classList.remove("out-up");
            yearEl.classList.add("in-down");
            void yearEl.offsetWidth;          // restart the transition
            yearEl.classList.remove("in-down");
        }, 220);
    };

    /* Nav state, progress bar, journey focus, active link */
    const nav = document.querySelector("nav");
    const progress = document.querySelector(".scroll-progress");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const sections = [...navLinks].map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const yearBar = document.querySelector(".year-bar");

    const onScroll = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const vh = window.innerHeight;

        nav.classList.toggle("scrolled", y > 20);
        if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

        if (items.length) {
            let current = items[0];
            items.forEach(it => { if (it.getBoundingClientRect().top < vh * 0.55) current = it; });
            items.forEach(it => it.classList.toggle("current", it === current));
            setYear(current.dataset.year);

            if (journeyList && yearBar) {
                const r = journeyList.getBoundingClientRect();
                const p = Math.min(Math.max((vh * 0.55 - r.top) / r.height, 0), 1);
                yearBar.style.setProperty("--jp", p.toFixed(3));
            }
        }

        let active = null;
        sections.forEach(sec => { if (sec.getBoundingClientRect().top <= 140) active = sec; });
        navLinks.forEach(a => a.classList.toggle("active", !!active && a.getAttribute("href") === `#${active.id}`));
    };

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { onScroll(); ticking = false; });
    }, { passive: true });
    onScroll();
});

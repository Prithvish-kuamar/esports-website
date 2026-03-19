/**
 * Team Hectic — Reference Site 1:1 Replica
 * Navigation, Scroll Animations, Stats Counter, Form Handling
 */

/* ── NAVBAR SCROLL ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // solid bg on scroll
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // active nav link highlight
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ── HAMBURGER MENU ────────────────────────────────────── */
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    });
}

// close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', true);
    });
});

/* ── SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ── SCROLL REVEAL ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

// auto-add reveal classes
function setupReveals() {
    const targets = [
        { sel: '.section-label', delay: 0 },
        { sel: '.section-title-large', delay: 0 },
        { sel: '.section-title-xl', delay: 0 },
        { sel: '.about-para', delay: 1 },
        { sel: '.about-image-frame', delay: 1 },
        { sel: '.stats-bar', delay: 0 },
        { sel: '.stat-item', delay: 1 },
        { sel: '.founder-card', delay: 1 },
        { sel: '.game-card', delay: 1 },
        { sel: '.contact-left', delay: 0 },
        { sel: '.contact-right', delay: 1 },
        { sel: '.founders-header', delay: 0 },
        { sel: '.games-header', delay: 0 },
    ];

    const delays = ['', 'reveal-d1', 'reveal-d2', 'reveal-d3'];

    targets.forEach(({ sel, delay }) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            const d = delays[Math.min(i * delay, delays.length - 1)] || '';
            if (d) el.classList.add(d);
            revealObserver.observe(el);
        });
    });
}
setupReveals();

/* ── STAT COUNTER ANIMATION ────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number');

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => countObserver.observe(el));

function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 1800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ── GAME ROSTER DROPDOWN ──────────────────────────────── */
document.querySelectorAll('.game-card[data-game]').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const game = card.getAttribute('data-game');
        const dropdown = document.getElementById(`roster-${game}`);
        const isOpen = card.classList.contains('active');

        // close all dropdowns first
        document.querySelectorAll('.game-card[data-game]').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.roster-dropdown').forEach(d => d.classList.remove('open'));

        // toggle the clicked one (if wasn't already open)
        if (!isOpen) {
            card.classList.add('active');
            dropdown.classList.add('open');
        }
    });
});

/* ── FORM HANDLING ─────────────────────────────────────── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('#submit-btn');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        submitBtn.style.opacity = '0.6';

        await new Promise(resolve => setTimeout(resolve, 1200));

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        formSuccess.hidden = false;
        form.reset();

        setTimeout(() => { formSuccess.hidden = true; }, 5000);
    });
}

/* ── PARALLAX HERO SUBTLE ──────────────────────────────── */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (hero && window.scrollY < window.innerHeight) {
        const progress = window.scrollY / window.innerHeight;
        hero.style.opacity = 1 - progress * 1.5;
        hero.style.transform = `translateY(${progress * 60}px)`;
    }
});

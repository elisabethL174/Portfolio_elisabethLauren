// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar background + scroll progress
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scrollProgress');

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? (window.scrollY / max) * 100 + '%' : '0%';
}

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Active nav link
const sections = [...document.querySelectorAll('section[id], header[id]')];

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        navLinks.querySelector(`a[href="#${entry.target.id}"]`)?.classList.add('active');
    });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// Animated stat counters
const counters = document.querySelectorAll('.stat strong[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// Project category filter
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('#projectsGrid .project');
const noResults = document.getElementById('noResults');

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;

        filters.forEach(b => {
            const on = b === btn;
            b.classList.toggle('active', on);
            b.setAttribute('aria-selected', String(on));
        });

        let shown = 0;
        projects.forEach(p => {
            const match = cat === 'all' || p.dataset.cat.split(' ').includes(cat);
            p.classList.toggle('hidden', !match);
            if (match) shown++;
        });

        noResults.hidden = shown > 0;
    });
});

// Typing effect
const roles = [
    'Full-Stack Developer',
    'Laravel & React',
    'UI/UX-minded Engineer',
    'Unity Game Developer'
];

const typed = document.getElementById('typed');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typed.textContent = current.slice(0, charIndex);

    let delay = deleting ? 45 : 85;

    if (!deleting && charIndex === current.length) {
        deleting = true;
        delay = 1800;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
    }

    setTimeout(type, delay);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.textContent = roles[0];
} else {
    type();
}

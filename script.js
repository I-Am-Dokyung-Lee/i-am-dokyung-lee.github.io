// ========== Theme ==========
const themeToggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ========== Mobile Nav ==========
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ========== Nav Scroll ==========
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            const navHeight = 64;
            const offset = 8;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ========== Project Detail Expand ==========
document.querySelectorAll('.btn-expand').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        const targetId = btn.dataset.target;
        const detail = document.getElementById(targetId);
        if (!detail) return;

        const isActive = detail.classList.contains('active');
        // Close all other details
        document.querySelectorAll('.project-detail.active').forEach(d => {
            if (d.id !== targetId) {
                d.classList.remove('active');
                const otherBtn = document.querySelector(`[data-target="${d.id}"]`);
                if (otherBtn) otherBtn.classList.remove('active');
            }
        });

        detail.classList.toggle('active', !isActive);
        btn.classList.toggle('active', !isActive);
    });
});

// ========== Scroll Reveal ==========
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll(
    '.about-card, .skill-category, .project-card, .contact-card, .about-text'
).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ========== Lightbox Gallery ==========
(function() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    let images = [];
    let currentIdx = 0;

    function show(idx) {
        currentIdx = idx;
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src = images[idx];
            lbImg.onload = () => { lbImg.style.opacity = '1'; };
        }, 100);
        lbCounter.textContent = (idx + 1) + ' / ' + images.length;
    }

    function open(gallery, startIdx) {
        images = gallery;
        document.body.style.overflow = 'hidden';
        lightbox.classList.add('active');
        show(startIdx || 0);
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-gallery').forEach(el => {
        el.addEventListener('click', () => {
            const gallery = JSON.parse(el.dataset.gallery);
            open(gallery, 0);
        });
    });

    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', () => {
        show((currentIdx - 1 + images.length) % images.length);
    });
    lightbox.querySelector('.lb-next').addEventListener('click', () => {
        show((currentIdx + 1) % images.length);
    });

    // Close only on background click, not on buttons or image
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lb-content')) close();
    });
    lbImg.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show((currentIdx - 1 + images.length) % images.length);
        if (e.key === 'ArrowRight') show((currentIdx + 1) % images.length);
    });
})();

// ========== Hero Typing Effect ==========
(function() {
    const el = document.getElementById('hero-tagline');
    if (!el) return;

    // Parse original HTML into segments (text chars + <br> tags)
    const raw = el.innerHTML;
    const segments = [];
    let i = 0;
    while (i < raw.length) {
        if (raw.substring(i, i + 4).toLowerCase() === '<br>') {
            segments.push('<br>');
            i += 4;
        } else if (raw.substring(i, i + 5).toLowerCase() === '<br/>') {
            segments.push('<br>');
            i += 5;
        } else if (raw.substring(i, i + 6).toLowerCase() === '<br />') {
            segments.push('<br>');
            i += 6;
        } else {
            segments.push(raw[i]);
            i++;
        }
    }

    // Clear and add cursor
    el.innerHTML = '<span class="hero-cursor"></span>';
    const cursor = el.querySelector('.hero-cursor');

    let idx = 0;
    function type() {
        if (idx >= segments.length) return;
        const seg = segments[idx];
        if (seg === '<br>') {
            cursor.insertAdjacentHTML('beforebegin', '<br>');
        } else {
            cursor.insertAdjacentText('beforebegin', seg);
        }
        idx++;
        setTimeout(type, 50);
    }

    type();
})();

/* =============================================
   VISTA PRIME – JavaScript
   Main Interactivity & Animations
============================================= */

document.addEventListener('DOMContentLoaded', function () {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2400);
    });
    document.body.style.overflow = 'hidden';

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        // Sticky nav style
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', function () {
        navLinksContainer.classList.toggle('open');
        navToggle.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
            navToggle.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            navLinksContainer.classList.remove('open');
            navToggle.classList.remove('open');
        }
    });

    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    let slideInterval;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    startSlider();

    // ===== COUNTER ANIMATION =====
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll(
        '.why-card, .project-card, .invest-card, .size-card, ' +
        '.team-card, .contact-card, .about-grid, .ov-feature, ' +
        '.ro-banner, .location-grid, .contact-form-wrap, .footer-brand'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    let countersAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered reveal
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // Counter observer
    const statNums = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNums.forEach(num => animateCounter(num));
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    // ===== PROJECT TABS =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const target = this.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const targetTab = document.getElementById('tab-' + target);
            if (targetTab) {
                targetTab.classList.add('active');
                // Re-trigger reveal for newly visible cards
                targetTab.querySelectorAll('.project-card').forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 100);
                });
            }
        });
    });

    // ===== CONTACT FORM – SEND VIA WHATSAPP =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('fname').value.trim();
            const phone = document.getElementById('fphone').value.trim();
            const interest = document.getElementById('finterest').value;
            const message = document.getElementById('fmessage').value.trim();

            if (!name || !phone || !interest) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            let waMessage = `Hello Vista Prime! 👋\n\n`;
            waMessage += `*Name:* ${name}\n`;
            waMessage += `*Phone:* ${phone}\n`;
            waMessage += `*Interested In:* ${interest}\n`;
            if (message) waMessage += `*Message:* ${message}\n`;
            waMessage += `\nI found you through your website.`;

            const waURL = `https://wa.me/923038026131?text=${encodeURIComponent(waMessage)}`;
            window.open(waURL, '_blank');

            showToast('Redirecting to WhatsApp...', 'success');
            contactForm.reset();
        });
    }

    // ===== TOAST NOTIFICATION =====
    function showToast(msg, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${msg}</span>
        `;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            background: type === 'success' ? '#25D366' : '#e53935',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: '50px',
            fontSize: '0.88rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '9999',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'toastIn 0.4s ease',
            fontFamily: 'Inter, sans-serif'
        });

        document.body.appendChild(toast);

        // Add animation keyframe
        if (!document.querySelector('#toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                @keyframes toastIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
                @keyframes toastOut { from { opacity:1; transform: translateY(0); } to { opacity:0; transform: translateY(20px); } }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.4s ease forwards';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ===== SMOOTH SCROLL for hash links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#') return;
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== MAP PLACEHOLDER – Load real Google Maps embed =====
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        // Replace placeholder with google maps iframe
        mapPlaceholder.innerHTML = `
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3479.5!2d71.4785!3d30.2157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3923878e78a1d2e1%3A0x1a3c9b8d7e4f5c2b!2sRoyal%20Orchard%20Multan!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                width="100%"
                height="360"
                style="border:0; display:block;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Royal Orchard Multan Location">
            </iframe>
        `;
    }

    // ===== PARALLAX HERO =====
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroSlider = document.querySelector('.hero-bg-slider');
        if (heroSlider && scrolled < window.innerHeight) {
            heroSlider.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, { passive: true });

    // ===== ADD GOLD BORDER ON SCROLL TO SECTION =====
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-pad').forEach(s => sectionObserver.observe(s));

    // ===== CURSOR GLOW (Desktop) =====
    if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.id = 'cursor-glow';
        Object.assign(glow.style, {
            position: 'fixed',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: '1',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.15s ease, top 0.15s ease',
            top: '-999px',
            left: '-999px'
        });
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ===== INITIALIZE =====
    handleScroll();
    console.log('%c✨ Vista Prime – Defining Excellence', 'color: #C9A84C; font-size: 16px; font-weight: bold;');
});

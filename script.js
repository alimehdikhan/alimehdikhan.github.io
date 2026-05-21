document.addEventListener('DOMContentLoaded', () => {

    // ===== PERFORMANCE: TRACKING STUB =====
    // In production, window.dataLayer and gtag would be loaded via standard GA snippet
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    
    // Attach generic click tracking for data-track attributes
    document.querySelectorAll('[data-track]').forEach(element => {
        element.addEventListener('click', (e) => {
            const eventName = element.getAttribute('data-track');
            gtag('event', 'click', {
                'event_category': 'engagement',
                'event_label': eventName
            });
            // Console log for audit visibility during development
            console.log(`[Tracking] Event Fired: ${eventName}`);
        });
    });

    // ===== THEME TOGGLE =====
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            
            // Track theme change
            gtag('event', 'theme_change', { 'event_label': newTheme });
        });
    }

    // ===== MOBILE NAV =====
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerToggle && navMenu) {
        hamburgerToggle.addEventListener('click', () => {
            const isActive = hamburgerToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
            hamburgerToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('show')) {
                hamburgerToggle.classList.remove('active');
                navMenu.classList.remove('show');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburgerToggle && navMenu) {
                hamburgerToggle.classList.remove('active');
                navMenu.classList.remove('show');
                hamburgerToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ===== STICKY NAV + SCROLL PROGRESS =====
    const navbar = document.querySelector('.navbar');
    const sections = Array.from(document.querySelectorAll('section'));
    const scrollProgress = document.getElementById('scroll-progress');

    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgress) {
            const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
            scrollProgress.style.width = `${progress}%`;
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    handleScroll();

    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

    // ===== PROJECT FILTER =====
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    const projectTimeouts = new Map();

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const selectedFilter = tab.getAttribute('data-filter');
            
            // Track filter clicks
            gtag('event', 'project_filter', { 'event_label': selectedFilter });

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const show = selectedFilter === 'all' || category === selectedFilter;

                if (projectTimeouts.has(index)) {
                    clearTimeout(projectTimeouts.get(index));
                }

                if (show) {
                    card.style.display = 'flex';
                    void card.offsetWidth;
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.98)';
                    
                    const tId = setTimeout(() => {
                        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 20);
                    projectTimeouts.set(index, tId);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.98)';
                    
                    const tId = setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                    projectTimeouts.set(index, tId);
                }
            });
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('portfolio-contact-form');
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');
    const closeSuccessBtn = document.getElementById('close-modal');
    const closeErrorBtn = document.getElementById('close-error-modal');

    function showSuccessToast() {
        if (successModal) {
            successModal.classList.add('show');
            gtag('event', 'form_submission_success');
            setTimeout(() => { successModal.classList.remove('show'); }, 4500);
        }
    }

    function showErrorToast() {
        if (errorModal) {
            errorModal.classList.add('show');
            gtag('event', 'form_submission_error');
            setTimeout(() => { errorModal.classList.remove('show'); }, 4500);
        }
    }

    if (closeSuccessBtn) { closeSuccessBtn.addEventListener('click', () => successModal?.classList.remove('show')); }
    if (closeErrorBtn) { closeErrorBtn.addEventListener('click', () => errorModal?.classList.remove('show')); }

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector("button[type='submit']");
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";

            try {
                const response = await fetch(
                    "https://formspree.io/f/xjgzwweq",
                    {
                        method: "POST",
                        body: new FormData(contactForm),
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                if (response.ok) {
                    showSuccessToast();
                    contactForm.reset();
                } else {
                    showErrorToast();
                }
            } catch (error) {
                showErrorToast();
            }

            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                window.scrollTo({
                    top, 
                    behavior: prefersReducedMotion ? 'auto' : 'smooth' 
                });
            }
        });
    });

});
/* ==========================================================================
   Tenzin Kunfel Portfolio - Interactive Logic Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide vector icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Dom Elements Cache ---
    const navbar = document.querySelector('.glass-navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');
    const decorContainer = document.querySelector('.bg-decor-container');

    // Form and Toast elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toastNotification');
    const closeToastBtn = document.getElementById('closeToast');
    const projectCards = document.querySelectorAll('.project-glass-card');

    // --- Mobile Menu Toggle Handler ---
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');

            // Toggle icon representation
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                const isOpen = navLinks.classList.contains('open');
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });

        // Close mobile menu when clicking a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                navLinks.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });

        // Close mobile menu when clicking anywhere else
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    }

    // --- Scroll Effects (Header Density & Back to Top) ---
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar scrolled density state
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollPos > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Active Navigation Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }

        // --- Card Stacking Scale/Opacity animation ---
        if (projectCards.length > 0) {
            const stickyTop = 120;
            projectCards.forEach((card) => {
                const cardTopOffset = card.offsetTop;
                const difference = scrollPos - (cardTopOffset - stickyTop);

                if (difference > 0) {
                    const maxScroll = 400; // range of scroll
                    const factor = Math.min(difference / maxScroll, 1);
                    const scale = 1 - (factor * 0.05); // scale down to 0.95
                    const opacity = 1 - (factor * 0.4); // fade down to 0.6

                    card.style.transform = `scale(${scale})`;
                    card.style.opacity = opacity;
                } else {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = 1;
                }
            });
        }
    });

    // Smooth scroll back to top handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Interactive Mouse Parallax for Background Blobs ---
    if (decorContainer) {
        window.addEventListener('mousemove', (e) => {
            // Compute horizontal/vertical relative mouse percentages
            const x = (e.clientX - window.innerWidth / 2) * -0.03;
            const y = (e.clientY - window.innerHeight / 2) * -0.03;

            // Apply slight hardware-accelerated translation offsets
            decorContainer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }

    // --- Scroll Reveal Animations ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, no need to keep observing this section
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // 15% visibility triggers activation
        rootMargin: '0px 0px -50px 0px' // offset to trigger slightly before coming fully in view
    });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Contact Form Custom Validation & Visual Feedback ---
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('.glass-input');

        // Helper to remove invalid state on focus or input
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            input.addEventListener('input', () => {
                if (formGroup.classList.contains('invalid') && validateField(input)) {
                    formGroup.classList.remove('invalid');
                }
            });
            input.addEventListener('blur', () => {
                if (!validateField(input)) {
                    formGroup.classList.add('invalid');
                } else {
                    formGroup.classList.remove('invalid');
                }
            });
        });

        function validateField(field) {
            if (field.hasAttribute('required') && !field.value.trim()) {
                return false;
            }
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(field.value.trim());
            }
            return true;
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            // Run validation over all form groups
            inputs.forEach(input => {
                const formGroup = input.closest('.form-group');
                if (!validateField(input)) {
                    formGroup.classList.add('invalid');
                    isFormValid = false;
                } else {
                    formGroup.classList.remove('invalid');
                }
            });

            if (isFormValid) {
                // Submit Form - Animate UI states
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span>Sending Message...</span>
                    <div class="spinner-circle"></div>
                `;

                // Add simple spinner styling in styles programmatically or in script
                // We'll simulate api latency for a premium submission experience
                setTimeout(() => {
                    // Trigger success modal/toast notification
                    showToast();

                    // Reset Form Elements
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 1400);
            }
        });
    }

    // --- Glass Toast Notification Interactions ---
    function showToast() {
        if (toast) {
            toast.classList.add('show');
            // Auto hide after 5 seconds
            setTimeout(hideToast, 5000);
        }
    }

    function hideToast() {
        if (toast) {
            toast.classList.remove('show');
        }
    }

    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', hideToast);
    }
});

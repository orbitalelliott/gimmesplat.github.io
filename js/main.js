/**
 * GimmeSplat Website JavaScript
 * FAQ accordion functionality and smooth interactions
 */

(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // FAQ Accordion
    // --------------------------------------------------------------------------
    function initFAQAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                const answer = question.nextElementSibling;

                // Close all other FAQs in the same category (optional - remove for multi-open)
                const category = question.closest('.faq-category');
                if (category) {
                    const otherQuestions = category.querySelectorAll('.faq-question[aria-expanded="true"]');
                    otherQuestions.forEach(otherQuestion => {
                        if (otherQuestion !== question) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            const otherAnswer = otherQuestion.nextElementSibling;
                            otherAnswer.style.maxHeight = null;
                        }
                    });
                }

                // Toggle current FAQ
                question.setAttribute('aria-expanded', !isExpanded);

                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            });

            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // Navigation Background on Scroll
    // --------------------------------------------------------------------------
    function initNavScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNav() {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                nav.style.background = 'rgba(26, 26, 46, 0.98)';
            } else {
                nav.style.background = 'rgba(26, 26, 46, 0.9)';
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
    }

    // --------------------------------------------------------------------------
    // Intersection Observer for Fade-in Animations
    // --------------------------------------------------------------------------
    function initScrollAnimations() {
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animatedElements = document.querySelectorAll('.feature-card, .faq-category, .privacy-section');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
            observer.observe(el);
        });

        // Define visible state
        const style = document.createElement('style');
        style.textContent = `
            .feature-card.visible,
            .faq-category.visible,
            .privacy-section.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------------
    // Initialize Everything
    // --------------------------------------------------------------------------
    function init() {
        initFAQAccordion();
        initSmoothScroll();
        initNavScroll();
        initScrollAnimations();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

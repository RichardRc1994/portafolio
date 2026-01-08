
(() => {
    'use strict';

    /* =======================
       DOM REFERENCES
    ======================= */
    const root = document.documentElement;
    const $ = (id) => document.getElementById(id);

    const languageToggle = $('languageToggle');
    const languageIcon = $('languageIcon');
    const themeToggle = $('themeToggle');
    const themeIcon = $('themeIcon');
    const mobileNav = $('mobileNav');
    const header = document.querySelector('header');
    const animatedElements = document.querySelectorAll('[data-animate]');
    const i18nElements = document.querySelectorAll('[data-i18n]');

    /* =======================
       STATE & CONFIG
    ======================= */
    const STORAGE_KEYS = {
        theme: 'theme',
        language: 'language'
    };

    const translations = {
        en: window.langEn || {},
        es: window.langEs || {}
    };

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    /* =======================
       LANGUAGE HANDLER
    ======================= */
    const applyLanguage = (lang) => {
        const language = lang === 'es' ? 'es' : 'en';
        root.lang = language;

        i18nElements.forEach((el) => {
            const key = el.dataset.i18n;
            const attr = el.dataset.i18nAttr;
            const value = translations[language]?.[key];
            if (!value) return;
            attr ? el.setAttribute(attr, value) : (el.textContent = value);
        });

        if (languageIcon) languageIcon.textContent = language.toUpperCase();
        localStorage.setItem(STORAGE_KEYS.language, language);
    };

    /* =======================
       THEME HANDLER
    ======================= */
    const applyTheme = (isDark) => {
        root.classList.toggle('dark', isDark);
        if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
        localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
    };

    /* =======================
       INITIAL STATE
    ======================= */
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language) || 'en';
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

    applyLanguage(savedLanguage);
    applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

    /* =======================
       EVENT LISTENERS
    ======================= */
    languageToggle?.addEventListener('click', () => {
        applyLanguage(root.lang === 'es' ? 'en' : 'es');
    });

    themeToggle?.addEventListener('click', () => {
        applyTheme(!root.classList.contains('dark'));
    });

    /* =======================
       SCROLL ANIMATIONS
    ======================= */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(({ isIntersecting, target }) => {
                if (!isIntersecting) return;
                target.classList.add('opacity-100', 'translate-y-0');
                obs.unobserve(target);
            });
        }, { threshold: 0.15 });

        animatedElements.forEach((el) => {
            el.classList.add(
                'opacity-0',
                'translate-y-6',
                'transition',
                'duration-700',
                'will-change-transform'
            );
            observer.observe(el);
        });
    }

    /* =======================
       HEADER OFFSET (UX)
    ======================= */
    const updateHeaderOffset = () => {
        const height = header?.offsetHeight || 80;
        root.style.setProperty('--header-offset', `${height}px`);
    };

    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);

    if (mobileNav) {
        new MutationObserver(updateHeaderOffset)
            .observe(mobileNav, { attributes: true, attributeFilter: ['class'] });
    }

})();
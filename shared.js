(function () {
    // --- CSS overrides ---
    var style = document.createElement('style');
    style.textContent = [
        '.slide-answer-row{',
        'background:linear-gradient(90deg,#1B4332 50%,#f7f7f5 50%) !important;',
        'background-size:205% 100% !important;',
        'background-position:100% center !important;',
        'transition:background-position 0.45s cubic-bezier(0.22,1,0.36,1),color 0.35s ease !important;',
        'animation:none !important;',
        'color:#1B4332 !important;',
        'border:1px solid rgba(27,67,50,0.15) !important;',
        '}',
        '.slide-answer-row span{color:inherit !important;}',
        '.slide-answer-row svg{color:inherit !important;opacity:0.85;}',
        '@media(hover:hover){.group:hover .slide-answer-row{background-position:0% center !important;color:#fff !important;}}',
        '.slide-answer-row.is-animating{background-position:0% center !important;color:#fff !important;}',
        '@keyframes pulse-cta{0%{box-shadow:0 0 0 0 rgba(232,106,16,0.7);}70%{box-shadow:0 0 0 10px rgba(232,106,16,0);}100%{box-shadow:0 0 0 0 rgba(232,106,16,0);}}',
        '.animate-pulse-cta{animation:pulse-cta 2s cubic-bezier(0.4,0,0.6,1) infinite;}'
    ].join('');
    document.head.appendChild(style);

    // --- Random km value (generated once per page load) ---
    var int = Math.floor(Math.random() * 11) + 1;
    var dec = Math.floor(Math.random() * 10);
    var km = dec > 0 ? int + ',' + dec : String(int);
    var kmLabel = 'serrurier \u00e0 ' + km + 'km';

    // --- Replace sticky bar ---
    var oldLinks = document.querySelectorAll('a[href^="tel:"].fixed');
    oldLinks.forEach(function (link) {
        var next = link.nextElementSibling;
        if (next && next.tagName === 'DIV') next.remove();
        link.remove();
    });

    var wrap = document.createElement('div');
    wrap.id = 'shared-sticky-bar';
    wrap.innerHTML =
        '<a href="tel:0787372881" data-gtm="cta-phone-sticky"' +
        ' onclick="dataLayer.push({event:\'phone_click\',click_location:\'sticky-bar\'})"' +
        ' class="fixed bottom-4 left-4 right-4 z-50 md:hidden flex items-center gap-2.5 bg-[#111] rounded-full px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10"' +
        ' aria-label="Appeler le serrurier urgence">' +
            '<div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center animate-pulse-cta"' +
            ' style="background-color:#E86A10;box-shadow:0 2px 8px rgba(232,106,16,0.5);">' +
                '<svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">' +
                    '<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>' +
                '</svg>' +
            '</div>' +
            '<div class="flex-1 min-w-0">' +
                '<div class="font-heading text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/50">D\u00e9pannage 24/7</div>' +
                '<div class="font-heading text-base font-extrabold text-white leading-tight">07 87 37 28 81</div>' +
            '</div>' +
            '<div class="flex-shrink-0 flex items-center gap-1 bg-green-500/10 border border-green-400/25 rounded-full px-2 py-1">' +
                '<span class="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 animate-pulse"></span>' +
                '<span class="km-badge text-green-400 text-[9px] font-bold leading-none whitespace-nowrap">' + kmLabel + '</span>' +
            '</div>' +
            '<div class="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">' +
                '<svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">' +
                    '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>' +
                '</svg>' +
            '</div>' +
        '</a>' +
        '<div class="h-20 md:hidden"></div>';
    document.body.appendChild(wrap);

    // --- Menu toggle ---
    var menuToggle = document.getElementById('menu-toggle');
    var menuClose = document.getElementById('menu-close');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuBackdrop = document.getElementById('menu-backdrop');
    var menuPanel = document.getElementById('menu-panel');

    if (menuToggle && mobileMenu) {
        function openMenu() {
            mobileMenu.classList.remove('pointer-events-none');
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuBackdrop.classList.add('opacity-100');
            menuPanel.classList.remove('translate-x-full');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            menuBackdrop.classList.remove('opacity-100');
            menuPanel.classList.add('translate-x-full');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            setTimeout(function () {
                mobileMenu.classList.add('pointer-events-none');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }, 300);
        }
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        menuBackdrop.addEventListener('click', closeMenu);
    }

    // --- Scroll-reveal observer ---
    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.scroll-reveal').forEach(function (el) { revealObs.observe(el); });

    // --- Slide-answer-row mobile observer ---
    if (window.matchMedia('(max-width:767px)').matches) {
        var slideObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) e.target.classList.add('is-animating');
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.slide-answer-row').forEach(function (el) { slideObs.observe(el); });
    }
})();

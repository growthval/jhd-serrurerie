(function () {
    var PAGES = [
        { href: '/', label: 'Accueil' },
        { href: '/la-rochelle', label: 'La Rochelle' },
        { href: '/ile-de-re', label: '\u00cele de R\u00e9' },
        { href: '/niort', label: 'Niort' },
        { href: '/poitiers', label: 'Poitiers' },
        { href: '/contact', label: 'Contact' },
    ];

    var cur = window.location.pathname.replace(/\/$/, '') || '/';

    function desktopLinks() {
        return PAGES.map(function (p) {
            var a = cur === p.href;
            return '<a href="' + p.href + '" class="nav-link' + (a ? ' active' : '') + ' text-sm font-bold uppercase tracking-wide ' + (a ? 'text-cta' : 'text-white/80 hover:text-white') + '">' + p.label + '</a>';
        }).join('');
    }

    function mobileLinks() {
        return PAGES.map(function (p) {
            var a = cur === p.href;
            return '<a href="' + p.href + '" class="py-3 text-lg font-semibold ' + (a ? 'text-cta' : 'text-gray-700') + ' border-b border-gray-100">' + p.label + '</a>';
        }).join('');
    }

    var PHONE_SVG = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>';

    /* ---- HEADER ---- */
    var headerEl = document.getElementById('site-header');
    if (headerEl) {
        headerEl.className = 'fixed top-0 w-full z-50 shadow-[0_2px_20px_rgba(0,0,0,0.35)]';
        headerEl.innerHTML =
            '<div style="background:#000">' +
                '<div class="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-6 py-3">' +
                    '<a href="/" class="shrink-0"><img src="/brand_assets/logo_jhd_blanc.svg" alt="JHD Serrurerie" class="h-14 w-auto"></a>' +
                    '<nav class="hidden lg:flex items-center gap-7" aria-label="Navigation principale">' + desktopLinks() + '</nav>' +
                    '<div class="flex items-center gap-4 shrink-0">' +
                        '<div class="hidden md:block text-right">' +
                            '<div class="flex items-center justify-end gap-1.5 mb-0.5">' +
                                '<svg class="w-4 h-4 text-cta" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>' +
                                '<span class="text-xs font-bold uppercase tracking-wider text-white">Agr\u00e9\u00e9 Assurances</span>' +
                            '</div>' +
                            '<span class="font-heading text-2xl font-extrabold text-white tracking-tight leading-none">06 71 69 75 78</span>' +
                        '</div>' +
                        '<a href="tel:0671697578" data-gtm="cta-phone" onclick="dataLayer.push({event:\'phone_click\',click_location:\'header\'})" class="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover active:bg-cta-light text-white font-bold text-base px-6 py-3 rounded-full transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta shadow-[0_4px_16px_rgba(232,106,16,0.3)]" aria-label="Appeler JHD Serrurerie au 06 71 69 75 78">' +
                            PHONE_SVG + 'APPELER' +
                        '</a>' +
                        '<button id="menu-toggle" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors" aria-label="Menu de navigation" aria-expanded="false" aria-controls="mobile-menu">' +
                            '<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        /* Mobile menu — injected as sibling after header */
        var mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.className = 'fixed inset-0 z-[60] pointer-events-none';
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.innerHTML =
            '<div id="menu-backdrop" class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300"></div>' +
            '<nav id="menu-panel" class="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col pt-20 px-6" inert aria-label="Navigation mobile">' +
                '<button id="menu-close" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface" aria-label="Fermer le menu">' +
                    '<svg class="w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
                '</button>' +
                mobileLinks() +
                '<a href="tel:0671697578" data-gtm="cta-phone" onclick="dataLayer.push({event:\'phone_click\',click_location:\'mobile-menu\'})" class="mt-6 flex items-center justify-center gap-2 bg-cta text-white font-bold py-4 rounded-xl text-lg">' +
                    PHONE_SVG.replace('w-5 h-5', 'w-5 h-5') + '06 71 69 75 78' +
                '</a>' +
            '</nav>';
        headerEl.insertAdjacentElement('afterend', mobileMenu);
    }

    /* ---- FOOTER ---- */
    var footerEl = document.getElementById('site-footer');
    if (footerEl) {
        footerEl.className = 'bg-forest-dark text-white pt-16 pb-8 px-4 md:px-8';
        footerEl.innerHTML =
            '<div class="max-w-6xl mx-auto">' +
                '<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">' +
                    '<div>' +
                        '<div class="flex items-center gap-3 mb-4">' +
                            '<img src="/brand_assets/logo_jhd_blanc.svg" alt="JHD Serrurerie" class="h-10 w-auto">' +
                        '</div>' +
                        '<p class="text-white/50 text-sm leading-relaxed mb-4">Votre serrurier de confiance en Charente-Maritime. D\u00e9pannage urgence 24h/24, 7j/7.</p>' +
                        '<a href="tel:0671697578" data-gtm="cta-phone" onclick="dataLayer.push({event:\'phone_click\',click_location:\'footer\'})" class="inline-flex items-center gap-2 text-cta font-bold hover:text-cta-light transition-colors">' +
                            '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>' +
                            '06 71 69 75 78' +
                        '</a>' +
                    '</div>' +
                    '<div>' +
                        '<h4 class="font-heading text-sm font-bold uppercase tracking-wider mb-4 text-white/70">Navigation</h4>' +
                        '<ul class="space-y-2.5">' +
                            '<li><a href="/" class="text-white/50 hover:text-white text-sm transition-colors">Accueil</a></li>' +
                            '<li><a href="/la-rochelle" class="text-white/50 hover:text-white text-sm transition-colors">Serrurier La Rochelle</a></li>' +
                            '<li><a href="/ile-de-re" class="text-white/50 hover:text-white text-sm transition-colors">Serrurier \u00cele de R\u00e9</a></li>' +
                            '<li><a href="/niort" class="text-white/50 hover:text-white text-sm transition-colors">Serrurier Niort</a></li>' +
                            '<li><a href="/poitiers" class="text-white/50 hover:text-white text-sm transition-colors">Serrurier Poitiers</a></li>' +
                            '<li><a href="/contact" class="text-white/50 hover:text-white text-sm transition-colors">Contact</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div>' +
                        '<h4 class="font-heading text-sm font-bold uppercase tracking-wider mb-4 text-white/70">Zones d\'intervention</h4>' +
                        '<ul class="space-y-2.5">' +
                            '<li><a href="/la-rochelle" class="text-white/50 hover:text-white text-sm transition-colors">La Rochelle (17)</a></li>' +
                            '<li><a href="/ile-de-re" class="text-white/50 hover:text-white text-sm transition-colors">\u00cele de R\u00e9 (17)</a></li>' +
                            '<li><a href="/niort" class="text-white/50 hover:text-white text-sm transition-colors">Niort (79)</a></li>' +
                            '<li><a href="/poitiers" class="text-white/50 hover:text-white text-sm transition-colors">Poitiers (86)</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div>' +
                        '<h4 class="font-heading text-sm font-bold uppercase tracking-wider mb-4 text-white/70">Horaires</h4>' +
                        '<ul class="space-y-2.5">' +
                            '<li><span class="text-white/50 text-sm">Lundi - Dimanche</span></li>' +
                            '<li><span class="text-white font-semibold text-sm">24h/24 - 7j/7</span></li>' +
                            '<li><span class="text-white/50 text-sm">Jours f\u00e9ri\u00e9s\u00a0: Disponible</span></li>' +
                        '</ul>' +
                        '<div class="mt-6 flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">' +
                            '<span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>' +
                            '<span class="text-white/70 text-xs font-medium">Disponible maintenant</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="border-t border-white/10 pt-6 text-center">' +
                    '<p class="text-white/30 text-xs">&copy; 2026 JHD Serrurerie. Tous droits r\u00e9serv\u00e9s.</p>' +
                '</div>' +
            '</div>';
    }
})();

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
        '.animate-pulse-cta{animation:pulse-cta 2s cubic-bezier(0.4,0,0.6,1) infinite;}',
        '.scroll-reveal.opacity-100{opacity:1!important;transform:translateY(0)!important;}',
        /* Reviews slider */
        '.reviews-viewport{overflow:hidden}',
        '.reviews-track{display:flex;will-change:transform;transition:transform 0.5s cubic-bezier(0.22,1,0.36,1)}',
        '.review-card{flex:0 0 100%;padding:0 4px;box-sizing:border-box}',
        '@media(min-width:768px){.review-card{flex:0 0 33.333%;padding:0 8px}}',
        '.review-dot{width:7px;height:7px;border-radius:9999px;background:rgba(27,67,50,0.18);cursor:pointer;border:none;transition:width 0.3s ease,background 0.3s ease}',
        '.review-dot.active{width:24px;background:#E86A10}',
        '.reviews-btn{width:40px;height:40px;border-radius:9999px;background:white;display:flex;align-items:center;justify-content:center;cursor:pointer;border:1.5px solid rgba(27,67,50,0.12);flex-shrink:0;color:#1B4332;box-shadow:0 2px 12px rgba(27,67,50,0.1);transition:background 0.2s ease,color 0.2s ease,transform 0.2s ease,box-shadow 0.2s ease}',
        '.reviews-btn:hover{background:#1B4332;color:white;transform:scale(1.05);box-shadow:0 4px 20px rgba(27,67,50,0.25)}',
        '.reviews-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}'
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
        '<a href="tel:0671697578" data-gtm="cta-phone-sticky"' +
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
                '<div class="font-heading text-base font-extrabold text-white leading-tight">06 71 69 75 78</div>' +
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
            menuPanel.removeAttribute('inert');
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
                menuPanel.setAttribute('inert', '');
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

    // --- Reviews slider (location pages — skipped if home page already initialized) ---
    if (!window.reviewNext) {
        (function() {
            var track = document.getElementById('reviews-track');
            var dotsEl = document.getElementById('reviews-dots');
            if (!track || !dotsEl) return;
            var viewport = track.parentElement;
            var cards = track.querySelectorAll('.review-card');
            var total = cards.length;
            var index = 0;
            var timer;
            var touchX = 0;
            function vis() { return window.innerWidth >= 768 ? 3 : 1; }
            function cardPx() { return viewport.offsetWidth / vis(); }
            function pages() { return Math.ceil(total / vis()); }
            function go(i) {
                var max = total - vis();
                if (i > max) i = 0;
                if (i < 0) i = max;
                index = i;
                track.style.transform = 'translateX(-' + (index * cardPx()) + 'px)';
                updateDots();
            }
            function updateDots() {
                var p = Math.floor(index / vis());
                dotsEl.querySelectorAll('.review-dot').forEach(function(d, i) { d.classList.toggle('active', i === p); });
            }
            function buildDots() {
                dotsEl.innerHTML = '';
                for (var i = 0; i < pages(); i++) {
                    (function(page) {
                        var btn = document.createElement('button');
                        btn.className = 'review-dot';
                        btn.setAttribute('aria-label', 'Page ' + (page + 1));
                        btn.onclick = function() { go(page * vis()); resetTimer(); };
                        dotsEl.appendChild(btn);
                    })(i);
                }
                updateDots();
            }
            function resetTimer() { clearInterval(timer); timer = setInterval(function() { go(index + 1); }, 5000); }
            window.reviewNext = function() { go(index + 1); resetTimer(); };
            window.reviewPrev = function() { go(index - 1); resetTimer(); };
            viewport.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
            viewport.addEventListener('touchend', function(e) {
                var diff = touchX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { diff > 0 ? reviewNext() : reviewPrev(); } else { resetTimer(); }
            });
            buildDots();
            resetTimer();
            var resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() { buildDots(); go(0); }, 200);
            });
        })();
    }

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

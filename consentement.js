/* ============================================================
   consentement.js — bandeau de consentement CNIL + Google Tag Manager (GTM-54WXXDDF)
   Adapté de _global/snippets/consentement.js (prévu pour GA4 direct) : ce site legacy passe par GTM.
   Intégration (chaque page, dans le <head>) :
     <script>window.dataLayer = window.dataLayer || [];</script>
     <script src="/consentement.js" defer></script>
   Pied de page (layout.js) : <button type="button" data-consentement="ouvrir">Gérer mes cookies</button>
   Règles : .claude/rules/conformite-legale.md (point 3).
   - Aucun appel à Google avant « Tout accepter » ; « Tout refuser » au même niveau, même style.
   - Mode consentement de Google : tout « denied » par défaut, « granted » à l'accord, avant le chargement de GTM.
   - Événements poussés avant l'accord (phone_click, form_*) : écartés, jamais rejoués après.
   - Choix conservé 6 mois, puis redemandé ; retrait à tout moment (cookies Google effacés, page rechargée sans GTM).
   Conteneur (2026-10-28) : balise Google Ads, Conversion Linker, balise Google GA4, conversion Google Ads « Tel ».
   Classes Tailwind : ce fichier est dans les globs `content` de tailwind.config.js (recompiler après modification).
   ============================================================ */
(function () {
    'use strict';

    var GTM = 'GTM-54WXXDDF';
    var POLITIQUE = '/cookies';
    var CLE = 'consentement-cookies-jhd';
    var DUREE_MS = 182 * 24 * 60 * 60 * 1000; // 6 mois
    var REFUSE = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
    // Mesure seulement, pas de publicité personnalisée ni de remarketing (Valentin, 2026-10-28) : ad_personalization reste refusé.
    var ACCORDE = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'granted' };
    var gtmCharge = false;
    var choixCourant = null; // choix de la page en cours (le stockage peut être bloqué)
    var bandeau = null;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', 'default', REFUSE);

    // ---- Stockage du choix (indisponible en navigation privée ou si bloqué) ----
    function lireChoix() {
        try {
            var choix = JSON.parse(window.localStorage.getItem(CLE));
            if (!choix || (choix.valeur !== 'accepte' && choix.valeur !== 'refuse')) return null;
            if (Date.now() - choix.date > DUREE_MS) return null; // expiré : on redemande
            return choix.valeur;
        } catch (e) { return null; }
    }
    function ecrireChoix(valeur) {
        try { window.localStorage.setItem(CLE, JSON.stringify({ valeur: valeur, date: Date.now() })); } catch (e) { /* choix non mémorisé */ }
    }

    // ---- GTM : chargé seulement après accord ----
    function chargerGTM() {
        gtag('consent', 'update', ACCORDE);
        if (gtmCharge) return;
        gtmCharge = true;
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM;
        document.head.appendChild(s);
    }

    // Garde les commandes de consentement, retire les événements poussés sans accord.
    function ecarterEvenementsSansAccord() {
        var garde = window.dataLayer.filter(function (m) { return m && m[0] === 'consent'; });
        window.dataLayer.length = 0;
        garde.forEach(function (m) { window.dataLayer.push(m); });
    }

    function supprimerCookiesGoogle() {
        var noms = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); })
            .filter(function (n) { return n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid' || n.indexOf('_gcl_') === 0; });
        var hote = window.location.hostname;
        var domaines = ['', hote, '.' + hote, '.' + hote.split('.').slice(-2).join('.')];
        noms.forEach(function (nom) {
            domaines.forEach(function (d) {
                document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
            });
        });
    }

    // ---- Bandeau ----
    var BOUTON = 'inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-full border-2 border-forest bg-white text-forest font-bold text-sm transition-colors hover:bg-forest hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest';

    function construireBandeau() {
        var div = document.createElement('div');
        div.id = 'consentement';
        div.className = 'fixed inset-x-4 bottom-4 z-[55] mx-auto max-w-3xl bg-white text-gray-800 border border-gray-200 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-5 flex flex-col md:flex-row md:items-center gap-4';
        div.setAttribute('role', 'region');
        div.setAttribute('aria-label', 'Consentement aux cookies');
        div.style.display = 'none'; // pas l'attribut hidden : la classe flex l'emporterait sur lui
        div.innerHTML =
            '<div class="flex-1 min-w-0">' +
                '<p class="font-heading font-bold text-forest mb-1">Cookies et mesure d’audience</p>' +
                '<p class="text-sm leading-relaxed">Avec votre accord, nous utilisons des cookies de Google (Analytics et Google Ads) pour mesurer la fréquentation du site et l’efficacité de nos annonces. Refuser n’a aucune conséquence sur votre navigation. <a href="' + POLITIQUE + '" class="underline font-semibold text-forest hover:text-forest-light">Le détail des cookies et vos droits</a></p>' +
                '<p data-consentement="etat" class="text-xs text-gray-600 mt-2" hidden></p>' +
            '</div>' +
            '<div class="flex gap-3 shrink-0">' +
                '<button type="button" data-choix="refuse" class="flex-1 md:flex-none ' + BOUTON + '">Tout refuser</button>' +
                '<button type="button" data-choix="accepte" class="flex-1 md:flex-none ' + BOUTON + '">Tout accepter</button>' +
            '</div>';
        div.addEventListener('click', function (e) {
            var bouton = e.target.closest('[data-choix]');
            if (bouton) choisir(bouton.getAttribute('data-choix'));
        });
        document.body.insertBefore(div, document.body.firstChild); // premier dans l'ordre de tabulation
        return div;
    }

    // Sur mobile, le bandeau se pose au-dessus de la barre d'appel (shared.js) ou de la barre de la page menuiserie.
    function placer() {
        if (!bandeau || bandeau.style.display === 'none') return;
        var barre = document.querySelector('#shared-sticky-bar > a, #barre-mobile-menuiserie > div');
        var bas = 16;
        if (barre && barre.getClientRects().length) bas = window.innerHeight - barre.getBoundingClientRect().top + 12;
        bandeau.style.bottom = bas + 'px';
    }

    function afficher(donnerFocus) {
        if (!bandeau) bandeau = construireBandeau();
        var etat = bandeau.querySelector('[data-consentement="etat"]');
        var choix = choixCourant || lireChoix();
        etat.hidden = !choix;
        etat.textContent = choix === 'accepte' ? 'Choix actuel : cookies acceptés.' : 'Choix actuel : cookies refusés.';
        bandeau.style.display = '';
        placer();
        if (donnerFocus) bandeau.querySelector('[data-choix]').focus();
    }

    function choisir(valeur) {
        choixCourant = valeur;
        ecrireChoix(valeur);
        bandeau.style.display = 'none';
        if (valeur === 'accepte') {
            if (!gtmCharge) ecarterEvenementsSansAccord();
            chargerGTM();
        } else {
            gtag('consent', 'update', REFUSE);
            supprimerCookiesGoogle();
            // GTM déjà chargé dans cette page : on recharge pour qu'il n'y tourne plus du tout.
            if (gtmCharge) window.location.reload();
        }
    }

    // ---- Cartes Google Maps : chargées au clic seulement (Google y dépose ses cookies) ----
    function preparerCartes() {
        document.querySelectorAll('[data-carte-google]').forEach(function (div) {
            var lien = div.querySelector('a');
            var info = document.createElement('p');
            info.className = 'text-sm text-gray-700 max-w-sm';
            info.textContent = 'La carte est fournie par Google Maps, qui dépose des cookies : elle ne s’affiche que si vous la demandez.';
            var bouton = document.createElement('button');
            bouton.type = 'button';
            bouton.className = BOUTON;
            bouton.textContent = 'Afficher la carte';
            bouton.addEventListener('click', function () {
                var iframe = document.createElement('iframe');
                iframe.src = div.getAttribute('data-carte-google');
                iframe.title = div.getAttribute('data-titre');
                iframe.width = '100%';
                iframe.height = div.style.height.replace('px', '');
                iframe.style.border = '0';
                iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                div.replaceWith(iframe);
                iframe.focus();
            });
            div.insertBefore(info, lien);
            div.insertBefore(bouton, lien);
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('[data-consentement="ouvrir"]')) { e.preventDefault(); afficher(true); }
    });
    window.addEventListener('resize', placer);

    // ---- Démarrage ----
    function demarrer() {
        preparerCartes();
        choixCourant = lireChoix();
        if (choixCourant === 'accepte') chargerGTM();
        else if (choixCourant === null) afficher(false);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
    else demarrer();
})();

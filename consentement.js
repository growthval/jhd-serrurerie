/* ============================================================
   consentement.js — bandeau de consentement CNIL, Google Tag Manager (GTM-54WXXDDF) et numéro de transfert Google
   MODE DE CONSENTEMENT AVANCÉ (décision de Valentin du 2026-11-10, même mécanique que THERMANEX).
   Adapté de _global/snippets/consentement.js (prévu pour GA4 direct) : ce site legacy passe par GTM.
   Intégration (chaque page, dans le <head>) :
     1. juste après la balise viewport, le bloc en ligne écrit par _outils/tete-gtm.mjs : dataLayer, mode consentement
        de Google tout « denied » par défaut (+ wait_for_update), « update » granted si l'accord est déjà mémorisé,
        puis chargement de GTM — avant tout autre script ;
     2. <script src="/consentement.js" defer></script> (ce fichier).
   Pied de page (layout.js) : <button type="button" data-consentement="ouvrir">Gérer mes cookies</button>
   Règles : .claude/rules/conformite-legale.md (point 3), écart décidé par Valentin (mode avancé).
   - GTM est chargé sur chaque page, même sans choix : tant que l'accord n'est pas donné, les balises Google ne lisent
     ni n'écrivent aucun cookie (signaux sans cookie, modélisation de Google).
   - « Tout accepter » : ad_storage, analytics_storage, ad_user_data → granted (ad_personalization reste refusé :
     mesure seulement, ni publicité personnalisée ni remarketing, choix du 2026-10-28). « Tout refuser » au même
     niveau, même style.
   - Événements (phone_click, form_submit, form_success) : poussés dans le dataLayer par les pages, gardés même sans
     accord (plus rien n'est écarté).
   - Choix conservé 6 mois, puis redemandé ; retrait à tout moment (consentement repassé à denied, cookies Google
     effacés, sans rechargement).
   - Numéro de transfert Google (2026-11-10) : pour un visiteur venu d'une annonce Google, Google peut fournir un
     numéro de transfert qui renvoie vers le 06 20 82 07 88 et compte les appels de 30 s et plus (conversion
     « Appel depuis le site (numéro Google, 30 s) »). Le texte affiché ET les liens tel: du 06 20 82 07 88 sont alors
     remplacés partout (en-tête, pied de page, menu mobile, barre d'appel, corps), sauf dans le corps des pages
     légales (<main data-numero-fixe>). Le 06 71 69 75 78 (menuiserie) n'est jamais touché. Sans annonce : rien ne
     change. Test : ajouter #google-wcc-debug à l'URL.
   - CLE et DUREE_MS sont aussi dans _outils/tete-gtm.mjs : les changer aux deux endroits.
   Conteneur (2026-10-28) : balise Google Ads, Conversion Linker, balise Google GA4, conversion Google Ads « Tel »
   (déclencheur : liens tel: sauf 671697578, donc aussi le numéro de transfert).
   Classes Tailwind : ce fichier est dans les globs `content` de tailwind.config.js (recompiler après modification).
   ============================================================ */
(function () {
    'use strict';

    var POLITIQUE = '/cookies';
    var CLE = 'consentement-cookies-jhd';
    var DUREE_MS = 182 * 24 * 60 * 60 * 1000; // 6 mois
    var REFUSE = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
    // Mesure seulement, pas de publicité personnalisée ni de remarketing (Valentin, 2026-10-28) : ad_personalization reste refusé.
    var ACCORDE = { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'granted' };
    var choixCourant = null; // choix de la page en cours (le stockage peut être bloqué)
    var bandeau = null;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }

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
        div.className = 'fixed inset-x-4 bottom-4 z-[55] mx-auto max-w-3xl bg-white text-gray-800 border border-gray-200 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4';
        // Compact sur mobile (2026-10-30) : le texte du bandeau ne doit pas devenir l'élément LCP de la page (vitesse mobile).
        div.setAttribute('role', 'region');
        div.setAttribute('aria-label', 'Consentement aux cookies');
        div.style.display = 'none'; // pas l'attribut hidden : la classe flex l'emporterait sur lui
        div.innerHTML =
            '<div class="flex-1 min-w-0">' +
                '<p class="font-heading font-bold text-forest text-sm md:text-base mb-1">Cookies et mesure d’audience</p>' +
                '<p class="text-xs md:text-sm leading-relaxed">Avec votre accord, des cookies de Google (Analytics et Google Ads) mesurent la fréquentation du site et l’efficacité de nos annonces. Refuser est sans conséquence sur votre navigation. <a href="' + POLITIQUE + '" class="underline font-semibold text-forest hover:text-forest-light">Détail et vos droits</a></p>' +
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
        etat.textContent = choix === 'accepte' ? 'Choix actuel : cookies acceptés.' : 'Choix actuel : cookies refusés.';
        bandeau.style.display = '';
        placer();
        if (donnerFocus) bandeau.querySelector('[data-choix]').focus();
    }

    function choisir(valeur) {
        var avant = choixCourant;
        choixCourant = valeur;
        ecrireChoix(valeur);
        bandeau.style.display = 'none';
        if (valeur === 'accepte') {
            if (avant !== 'accepte') gtag('consent', 'update', ACCORDE);
        } else {
            // Les balises Google repassent en mode sans cookie dans la page, sans rechargement.
            gtag('consent', 'update', REFUSE);
            supprimerCookiesGoogle();
        }
    }

    // ---- Cartes Google Maps : chargées au clic seulement (Google y dépose ses cookies) ----
    function preparerCartes() {
        document.querySelectorAll('[data-carte-google]').forEach(function (div) {
            var lien = div.querySelector('a');
            var info = document.createElement('p');
            info.className = 'text-sm text-gray-700 max-w-sm';
            info.textContent = 'La carte est fournie par Google Maps, qui dépose des cookies : elle ne s’affiche que si vous la demandez.';
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

    // ---- Numéro de transfert Google (appels venus des annonces, 30 s et plus) ----
    var AW_ID = 'AW-17790054157';
    var AW_APPEL = 'AW-17790054157/-GOKCPmcz7UdEI3e-qJC'; // conversion « Appel depuis le site (numéro Google, 30 s) »
    var NUMERO = '06 20 82 07 88';
    // Le 06 20 82 07 88 sous toutes ses écritures du site (espaces, insécables, points, +33). Jamais le 06 71 69 75 78.
    var MOTIF = '(?:\\+33[\\s\\u00a0.]*(?:\\(0\\))?[\\s\\u00a0.]*|0)6[\\s\\u00a0.]*20[\\s\\u00a0.]*82[\\s\\u00a0.]*07[\\s\\u00a0.]*88';
    var IGNORES = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, TEMPLATE: 1 };
    var numeroGoogle = null; // { affiche, href } fourni par Google, seulement pour un visiteur venu d'une annonce

    function contient(texte) { return !!texte && new RegExp(MOTIF).test(texte); }
    function remplacer(texte, par) { return texte.replace(new RegExp(MOTIF, 'g'), par); }
    function fixe(noeud) { // corps des pages légales : le numéro de l'éditeur reste le vrai
        var el = noeud.nodeType === 1 ? noeud : noeud.parentElement;
        return !!(el && el.closest('[data-numero-fixe]'));
    }

    function remplacerNumero(racine) {
        if (!numeroGoogle || !racine) return;
        if (racine.nodeType === 3) {
            if (!fixe(racine) && !IGNORES[racine.parentElement && racine.parentElement.tagName] && contient(racine.data)) racine.data = remplacer(racine.data, numeroGoogle.affiche);
            return;
        }
        if (racine.nodeType !== 1 || IGNORES[racine.tagName]) return;
        var elements = [racine].concat(Array.prototype.slice.call(racine.querySelectorAll('a[href^="tel:"], [aria-label], [title]')));
        elements.forEach(function (el) {
            if (fixe(el)) return;
            var href = el.tagName === 'A' && el.getAttribute('href');
            if (href && href.indexOf('tel:') === 0 && contient(href)) el.setAttribute('href', numeroGoogle.href);
            ['aria-label', 'title'].forEach(function (attr) {
                var v = el.getAttribute(attr);
                if (contient(v)) el.setAttribute(attr, remplacer(v, numeroGoogle.affiche));
            });
        });
        var parcours = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, null);
        var textes = [];
        while (parcours.nextNode()) textes.push(parcours.currentNode);
        textes.forEach(function (t) {
            if (!IGNORES[t.parentElement && t.parentElement.tagName] && !fixe(t) && contient(t.data)) t.data = remplacer(t.data, numeroGoogle.affiche);
        });
    }

    // Les blocs injectés plus tard (en-tête et pied de page de layout.js, barre d'appel de shared.js, menu mobile) sont
    // traités à leur arrivée.
    var observateur = null;
    function appliquerNumero() {
        if (!numeroGoogle || !document.body) return;
        remplacerNumero(document.body);
        if (observateur || !window.MutationObserver) return;
        observateur = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, remplacerNumero); });
        });
        observateur.observe(document.body, { childList: true, subtree: true });
    }

    // Appelé par Google seulement s'il fournit un numéro de transfert (visiteur venu d'une annonce, ou #google-wcc-debug).
    function recevoirNumero(numeroFormate, numeroMobile) {
        if (!numeroFormate) return;
        var chiffres = String(numeroMobile || numeroFormate).replace(/[^\d+]/g, '');
        numeroGoogle = { affiche: String(numeroFormate), href: 'tel:' + chiffres };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', appliquerNumero);
        else appliquerNumero();
    }

    // La commande part une fois la balise Google Ads chargée par GTM (destination AW-17790054157 présente).
    function configurerNumero(essai) {
        var gtm = window.google_tag_manager;
        if (gtm && gtm[AW_ID]) {
            gtag('config', AW_APPEL, { phone_conversion_number: NUMERO, phone_conversion_callback: recevoirNumero });
            return;
        }
        if (essai < 150) setTimeout(function () { configurerNumero(essai + 1); }, 200); // 30 s au plus
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('[data-consentement="ouvrir"]')) { e.preventDefault(); afficher(true); }
    });
    window.addEventListener('resize', placer);

    // ---- Démarrage ----
    // L'accord mémorisé a déjà été transmis à Google par le bloc en ligne du <head> (_outils/tete-gtm.mjs).
    choixCourant = lireChoix();
    configurerNumero(0);
    function demarrer() {
        preparerCartes();
        if (choixCourant === null) afficher(false);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
    else demarrer();
})();

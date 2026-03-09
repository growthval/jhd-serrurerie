import { readFileSync, writeFileSync } from 'fs';

const FAQ = {
  'la-rochelle.html': `        <section id="faq" class="bg-surface py-20 md:py-28 px-4 md:px-8">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-14 scroll-reveal">
                    <span class="inline-block text-cta font-semibold text-sm uppercase tracking-wider mb-3">Questions fréquentes</span>
                    <h2 class="font-heading text-3xl md:text-4xl font-bold text-forest tracking-[-0.02em]">FAQ Serrurier La Rochelle</h2>
                </div>
                <div class="space-y-4">
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" open><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Quel est le prix pour une ouverture de porte à La Rochelle ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Pour une ouverture de porte claquée à La Rochelle, le tarif démarre à 90€ TTC. Pour une porte verrouillée (clé à l'intérieur ou perdue), comptez à partir de 110€ TTC. Un remplacement de serrure commence à 80€ TTC, pose incluse. Ces tarifs sont conformes aux barèmes des assurances habitation. Le devis exact est établi par écrit sur place, avant toute intervention.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.1s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Combien de temps pour arriver chez moi à La Rochelle ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Grâce à notre proximité locale, nous arrivons généralement en 20 à 30 minutes, que vous soyez au centre-ville ou en périphérie (Aytré, Lagord, Périgny, Puilboreau).</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.2s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Êtes-vous agréé par mon assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Oui, nos factures sont conformes aux barèmes des assurances pour vous garantir un remboursement en cas de perte de clé, vol ou effraction. Nous travaillons avec MAAF, AXA, MACIF, MATMUT et Groupama.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.3s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Comment se faire rembourser par son assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Conservez la facture remise par notre serrurier : elle est établie selon les barèmes agréés. Appelez votre assureur et invoquez la clause <strong>assistance domicile</strong> (porte claquée) ou <strong>bris de serrure</strong> (effraction). Le remboursement intervient généralement sous 15 à 30 jours.</p></div></details>
                </div>
            </div>
        </section>`,
  'niort.html': `        <section id="faq" class="bg-surface py-20 md:py-28 px-4 md:px-8">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-14 scroll-reveal">
                    <span class="inline-block text-cta font-semibold text-sm uppercase tracking-wider mb-3">Questions fréquentes</span>
                    <h2 class="font-heading text-3xl md:text-4xl font-bold text-forest tracking-[-0.02em]">FAQ Serrurier Niort</h2>
                </div>
                <div class="space-y-4">
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" open><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Quel est le prix pour une ouverture de porte à Niort ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Pour une ouverture de porte claquée à Niort, le tarif démarre à 90€ TTC. Pour une porte verrouillée (clé à l'intérieur ou perdue), comptez à partir de 110€ TTC. Un remplacement de serrure commence à 80€ TTC, pose incluse.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.1s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Combien de temps pour arriver chez moi à Niort ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Grâce à notre proximité locale, nous arrivons généralement en 20 à 30 minutes, que vous soyez au centre-ville ou en périphérie (Chauray, Aiffres, Bessines, Échiré).</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.2s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Êtes-vous agréé par mon assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Oui, nos factures sont conformes aux barèmes des assurances pour un remboursement en cas de perte de clé, vol ou effraction. Nous travaillons avec MAAF, AXA, MACIF, MATMUT et Groupama.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.3s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Comment se faire rembourser par son assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Conservez la facture remise par notre serrurier. Appelez votre assureur et invoquez la clause <strong>assistance domicile</strong> (porte claquée) ou <strong>bris de serrure</strong> (effraction). Le remboursement intervient généralement sous 15 à 30 jours.</p></div></details>
                </div>
            </div>
        </section>`,
  'ile-de-re.html': `        <section id="faq" class="bg-surface py-20 md:py-28 px-4 md:px-8">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-14 scroll-reveal">
                    <span class="inline-block text-cta font-semibold text-sm uppercase tracking-wider mb-3">Questions fréquentes</span>
                    <h2 class="font-heading text-3xl md:text-4xl font-bold text-forest tracking-[-0.02em]">FAQ Serrurier Île de Ré</h2>
                </div>
                <div class="space-y-4">
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" open><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Quel est le prix pour une ouverture de porte sur l'Île de Ré ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Pour une ouverture de porte claquée sur l'Île de Ré, le tarif démarre à 90€ TTC. Pour une porte verrouillée, comptez à partir de 110€ TTC. Un remplacement de serrure commence à 80€ TTC, pose incluse.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.1s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Combien de temps pour arriver chez moi sur l'Île de Ré ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Grâce à notre proximité locale, nous arrivons généralement en 20 à 30 minutes, que vous soyez à Saint-Martin-de-Ré ou dans une autre commune (La Flotte, Ars-en-Ré, Rivedoux-Plage).</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.2s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Êtes-vous agréé par mon assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Oui, nos factures sont conformes aux barèmes des assurances pour un remboursement en cas de perte de clé, vol ou effraction. Nous travaillons avec MAAF, AXA, MACIF, MATMUT et Groupama.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.3s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Comment se faire rembourser par son assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Conservez la facture remise par notre serrurier. Appelez votre assureur et invoquez la clause <strong>assistance domicile</strong> ou <strong>bris de serrure</strong>. Le remboursement intervient généralement sous 15 à 30 jours.</p></div></details>
                </div>
            </div>
        </section>`,
  'poitiers.html': `        <section id="faq" class="bg-surface py-20 md:py-28 px-4 md:px-8">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-14 scroll-reveal">
                    <span class="inline-block text-cta font-semibold text-sm uppercase tracking-wider mb-3">Questions fréquentes</span>
                    <h2 class="font-heading text-3xl md:text-4xl font-bold text-forest tracking-[-0.02em]">FAQ Serrurier Poitiers</h2>
                </div>
                <div class="space-y-4">
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" open><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Quel est le prix pour une ouverture de porte à Poitiers ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Pour une ouverture de porte claquée à Poitiers, le tarif démarre à 90€ TTC. Pour une porte verrouillée (clé à l'intérieur ou perdue), comptez à partir de 110€ TTC. Un remplacement de serrure commence à 80€ TTC, pose incluse.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.1s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Combien de temps pour arriver chez moi à Poitiers ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Grâce à notre proximité locale, nous arrivons généralement en 20 à 30 minutes, que vous soyez au centre-ville ou en périphérie (Buxerolles, Saint-Benoît, Fontaine-le-Comte, Mignaloux-Beauvoir).</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.2s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Êtes-vous agréé par mon assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Oui, nos factures sont conformes aux barèmes des assurances pour un remboursement en cas de perte de clé, vol ou effraction. Nous travaillons avec MAAF, AXA, MACIF, MATMUT et Groupama.</p></div></details>
                    <details class="scroll-reveal bg-white rounded-2xl shadow-[0_2px_12px_rgba(27,67,50,0.04)] group" style="transition-delay:0.3s"><summary class="flex items-center justify-between cursor-pointer p-6 md:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-2xl"><h3 class="font-heading text-lg font-bold text-forest pr-4">Comment se faire rembourser par son assurance ?</h3><svg class="faq-chevron w-5 h-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></summary><div class="px-6 md:px-7 pb-6 md:pb-7"><p class="text-gray-600 leading-[1.7]">Conservez la facture remise par notre serrurier. Appelez votre assureur et invoquez la clause <strong>assistance domicile</strong> (porte claquée) ou <strong>bris de serrure</strong> (effraction). Le remboursement intervient généralement sous 15 à 30 jours.</p></div></details>
                </div>
            </div>
        </section>`
};

const files = ['la-rochelle.html', 'niort.html', 'ile-de-re.html', 'poitiers.html'];

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const log = [];

  // 1. Replace static header with placeholder (keep GTM noscript + skip-to-content above it)
  content = content.replace(
    /[ \t]*<!-- HEADER -->[\s\S]*?<\/header>/,
    '    <header id="site-header"></header>'
  );
  log.push('header → placeholder');

  // 2. Remove mobile menu overlay
  content = content.replace(
    /\n[ \t]*<!-- MOBILE MENU OVERLAY -->[\s\S]*?<\/div>\n(\s*\n\s*<!-- MAIN CONTENT -->)/,
    '\n\n$1'
  );
  log.push('mobile menu removed');

  // 3. Fix duplicate APPELER <a> tag — two consecutive tel: links
  const dupPattern = /(<a href="tel:0671697578"[^\n]+"inline-flex[^\n]+>\n)([ \t]*<a href="tel:0671697578"[^\n]+"inline-flex[^\n]+>\n)/;
  if (dupPattern.test(content)) {
    content = content.replace(dupPattern, '$1');
    log.push('duplicate button fixed');
  }

  // 4. Restore FAQ before CTA BANNER
  if (!content.includes('id="faq"') && FAQ[file]) {
    content = content.replace(
      /([ \t]*<!-- CTA BANNER -->)/,
      '\n' + FAQ[file] + '\n\n$1'
    );
    log.push('FAQ restored');
  }

  // 5. Replace static footer with placeholder
  content = content.replace(
    /<footer[\s\S]*?<\/footer>/,
    '<footer id="site-footer"></footer>'
  );
  log.push('footer → placeholder');

  // 6. Add layout.js before shared.js
  if (!content.includes('layout.js')) {
    content = content.replace(
      /(\s*<script src="shared\.js"><\/script>)/,
      '\n    <script src="layout.js"></script>$1'
    );
    log.push('layout.js added');
  }

  writeFileSync(file, content, 'utf8');
  console.log(`${file}: ${log.join(', ')}`);
}

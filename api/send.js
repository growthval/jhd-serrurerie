// Fonction serverless Vercel — envoi du formulaire de contact via Resend.
// Remplace l'ancien send.php (PHP mail(), non exécuté sur Vercel).
// Prérequis :
//   - Variable d'environnement RESEND_API_KEY (Vercel > Settings > Environment Variables)
//   - Domaine d'envoi vérifié dans Resend (SPF/DKIM) pour l'adresse "from" ci-dessous.

const CITY_LABELS = {
  'la-rochelle': 'La Rochelle',
  'ile-de-re': 'Île de Ré',
  'niort': 'Niort',
  'poitiers': 'Poitiers',
  'autre': 'Autre',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY manquante');
    res.status(500).json({ success: false, error: "Erreur de configuration. Appelez-nous au 06 71 69 75 78." });
    return;
  }

  // Vercel parse le corps JSON automatiquement ; fallback si string.
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const city = String(body.city || '').trim();
  const message = String(body.message || '').trim();
  const honeypot = String(body.company || '').trim(); // champ piège invisible

  // Bot détecté : on répond OK sans rien envoyer.
  if (honeypot) {
    res.status(200).json({ success: true });
    return;
  }

  if (!name || !email || !phone || !message) {
    res.status(400).json({ success: false, error: 'Veuillez remplir tous les champs obligatoires.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, error: 'Adresse email invalide.' });
    return;
  }

  const cityLabel = CITY_LABELS[city] || (city || 'Non précisée');

  const text = [
    'Nouvelle demande de contact — jhd-serrurerie.fr',
    '---------------------------------------------',
    '',
    'Nom       : ' + name,
    'Email     : ' + email,
    'Téléphone : ' + phone,
    'Ville     : ' + cityLabel,
    '',
    'Message :',
    message,
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'JHD Serrurerie <contact@jhd-serrurerie.fr>',
        to: ['direction@jocehome.fr', 'lejaultvalentinpro@gmail.com'],
        reply_to: email,
        subject: 'Nouvelle demande — JHD Serrurerie',
        text: text,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      res.status(502).json({ success: false, error: "Erreur lors de l'envoi. Appelez-nous au 06 71 69 75 78." });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Erreur lors de l'envoi. Appelez-nous au 06 71 69 75 78." });
  }
};

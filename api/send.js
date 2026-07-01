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

// Échappe les données utilisateur avant injection dans le HTML de l'e-mail.
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(d) {
  try {
    return d.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'long', timeStyle: 'short' });
  } catch (e) {
    return d.toISOString();
  }
}

// Gabarit d'e-mail HTML (table + styles inline pour compatibilité clients mail).
// Toutes les valeurs `v.*` sont déjà échappées par l'appelant.
function renderEmail(v) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nouvelle demande de ${v.name} — ${v.city} · ${v.phone}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="background:#1B4332;padding:26px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="color:#ffffff;font-size:20px;font-weight:bold;">JHD Serrurerie</td>
            <td align="right" style="color:#E86A10;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;">Nouvelle demande</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;background:#E86A10;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 4px;">
          <p style="margin:0;color:#1B4332;font-size:18px;font-weight:bold;">Un client vous a contacté</p>
          <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Demande reçue via jhd-serrurerie.fr le ${v.sentAt}.</p>
        </td></tr>
        <tr><td style="padding:16px 32px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececeb;border-radius:12px;">
            <tr><td style="padding:14px 18px;border-bottom:1px solid #f0f0ef;">
              <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Nom</div>
              <div style="color:#111827;font-size:16px;font-weight:bold;margin-top:2px;">${v.name}</div>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #f0f0ef;">
              <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Téléphone</div>
              <a href="tel:${v.phoneHref}" style="color:#E86A10;font-size:20px;font-weight:bold;text-decoration:none;">${v.phone}</a>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #f0f0ef;">
              <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Email</div>
              <a href="mailto:${v.email}" style="color:#1B4332;font-size:16px;font-weight:bold;text-decoration:none;">${v.email}</a>
            </td></tr>
            <tr><td style="padding:14px 18px;">
              <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Ville</div>
              <div style="color:#111827;font-size:16px;font-weight:bold;margin-top:2px;">${v.city}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:14px 32px 4px;">
          <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Message</div>
          <div style="margin-top:6px;padding:16px 18px;background:#f7f7f5;border-left:4px solid #E86A10;border-radius:8px;color:#374151;font-size:15px;line-height:1.6;">${v.message}</div>
        </td></tr>
        <tr><td style="padding:24px 32px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td align="center" bgcolor="#E86A10" style="border-radius:12px;">
              <a href="tel:${v.phoneHref}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:12px;">Rappeler ${v.name}</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="background:#081C15;padding:20px 32px;">
          <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.6;">Répondez directement à cet e-mail pour écrire au client.<br>JHD Serrurerie · jhd-serrurerie.fr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const BUSINESS_PHONE = '06 71 69 75 78';
const BUSINESS_PHONE_HREF = '0671697578';

// Accusé de réception envoyé au prospect qui a rempli le formulaire.
// Valeurs `v.name`, `v.city`, `v.message` déjà échappées par l'appelant.
function renderAckEmail(v) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nous avons bien reçu votre demande. Un serrurier JHD vous rappelle.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="background:#1B4332;padding:26px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="color:#ffffff;font-size:20px;font-weight:bold;">JHD Serrurerie</td>
            <td align="right" style="color:#E86A10;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;">Serrurier 24h/24</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;background:#E86A10;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 4px;">
          <p style="margin:0;color:#1B4332;font-size:20px;font-weight:bold;">Votre demande est bien arrivée</p>
          <p style="margin:14px 0 0;color:#374151;font-size:16px;line-height:1.6;">Bonjour ${v.name},<br>Merci de votre message. Un serrurier JHD vous rappelle <strong>dans les plus brefs délais</strong> pour votre intervention.</p>
        </td></tr>
        <tr><td style="padding:20px 32px 4px;">
          <div style="padding:16px 18px;background:#f7f7f5;border-radius:12px;">
            <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Récapitulatif de votre demande</div>
            <div style="color:#374151;font-size:14px;line-height:1.6;"><strong>Ville :</strong> ${v.city}<br><strong>Votre message :</strong><br>${v.message}</div>
          </div>
        </td></tr>
        <tr><td style="padding:24px 32px 8px;" align="center">
          <p style="margin:0 0 14px;color:#111827;font-size:16px;font-weight:bold;">Une urgence ? Appelez-nous tout de suite</p>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
            <td align="center" bgcolor="#E86A10" style="border-radius:12px;">
              <a href="tel:${v.businessPhoneHref}" style="display:inline-block;padding:15px 34px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:12px;">${v.businessPhone}</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="background:#081C15;padding:20px 32px;">
          <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.6;">JHD Serrurerie · Dépannage serrurerie en Charente-Maritime · jhd-serrurerie.fr<br>Cet e-mail confirme la réception de votre demande.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

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
  const sentAt = formatDate(new Date());
  const phoneHref = phone.replace(/[^\d+]/g, '');
  const subjectName = name.replace(/[\r\n]+/g, ' ').slice(0, 60);

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
    '',
    'Reçu le ' + sentAt + '.',
  ].join('\n');

  const html = renderEmail({
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    phoneHref: escapeHtml(phoneHref),
    city: escapeHtml(cityLabel),
    message: escapeHtml(message).replace(/\n/g, '<br>'),
    sentAt: escapeHtml(sentAt),
  });

  const ackText = [
    'Bonjour ' + name + ',',
    '',
    'Merci de votre message. Nous avons bien reçu votre demande et un serrurier JHD vous rappelle dans les plus brefs délais.',
    '',
    'Récapitulatif :',
    'Ville : ' + cityLabel,
    'Votre message :',
    message,
    '',
    'Une urgence ? Appelez-nous directement au ' + BUSINESS_PHONE + '.',
    '',
    'JHD Serrurerie — jhd-serrurerie.fr',
  ].join('\n');

  const ackHtml = renderAckEmail({
    name: escapeHtml(name),
    city: escapeHtml(cityLabel),
    message: escapeHtml(message).replace(/\n/g, '<br>'),
    businessPhone: BUSINESS_PHONE,
    businessPhoneHref: BUSINESS_PHONE_HREF,
  });

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
        subject: 'Nouvelle demande de ' + subjectName + ' — JHD Serrurerie',
        text: text,
        html: html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      res.status(502).json({ success: false, error: "Erreur lors de l'envoi. Appelez-nous au 06 71 69 75 78." });
      return;
    }

    // Accusé de réception au prospect — best-effort : n'échoue pas la soumission si ça rate.
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'JHD Serrurerie <contact@jhd-serrurerie.fr>',
          to: [email],
          reply_to: 'direction@jocehome.fr',
          subject: 'Votre demande a bien été reçue — JHD Serrurerie',
          text: ackText,
          html: ackHtml,
        }),
      });
    } catch (ackErr) {
      console.error('Ack email error', ackErr);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Erreur lors de l'envoi. Appelez-nous au 06 71 69 75 78." });
  }
};

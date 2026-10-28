// Fonction serverless Vercel — envoi des formulaires du site via Resend.
// Deux formulaires : `contact` (page /contact) et `devis_menuiserie` (page /menuiserie-la-rochelle).
// Prérequis :
//   - Variable d'environnement RESEND_API_KEY (Vercel > Settings > Environment Variables)
//   - Domaine d'envoi vérifié dans Resend (SPF/DKIM) pour l'adresse "from" ci-dessous.
// E-mail de confirmation au visiteur : conservé sur décision de Valentin (2026-10-28, exception à LRN-056). Il ne
// recopie aucun texte libre saisi (seulement le prénom, filtré et tronqué) : le formulaire ne peut pas servir à
// faire envoyer un message choisi par un tiers depuis le domaine.

const NOTIFY_TO = 'contact@jhdgroup.fr';
const FROM = 'JHD Serrurerie <contact@jhd-serrurerie.fr>';

const FORMS = {
  contact: {
    brand: 'JHD Serrurerie',
    subject: 'Nouvelle demande',
    phone: '06 20 82 07 88',
    phoneHref: '+33620820788',
    ackLead: 'Merci de votre message. Nous vous rappelons dans les plus brefs délais.',
    ackCall: 'Besoin d’un dépannage ? Appelez-nous',
  },
  devis_menuiserie: {
    brand: 'JHD Serrurerie et Menuiserie',
    subject: 'Devis menuiserie',
    phone: '06 71 69 75 78',
    phoneHref: '+33671697578',
    ackLead: 'Merci pour votre demande de devis. Nous vous rappelons le jour même ou le lendemain pour préciser votre projet.',
    ackCall: 'Vous préférez en parler de vive voix ? Appelez-nous',
  },
};

const CITY_LABELS = {
  'la-rochelle': 'La Rochelle',
  'ile-de-re': 'Île de Ré',
  'niort': 'Niort',
  'poitiers': 'Poitiers',
  'autre': 'Autre',
};

const PROJECT_LABELS = {
  'porte': 'Porte d’entrée',
  'pergola': 'Pergola',
  'portail': 'Portail',
  'cloture': 'Clôture',
  'plusieurs': 'Plusieurs projets',
};

const DELAI_LABELS = {
  'des-que-possible': 'Dès que possible',
  '3-mois': 'Dans les 3 mois',
  '3-6-mois': 'Dans 3 à 6 mois',
  'plus-tard': 'Plus tard, je me renseigne',
};

// Origines admises (le navigateur envoie toujours Origin sur un POST fetch). Un robot peut le falsifier : c'est un
// filtre contre l'abus depuis d'autres sites, pas une authentification.
const ORIGINS = /^https:\/\/((www\.)?jhd-serrurerie\.fr|[a-z0-9-]+\.vercel\.app)$|^http:\/\/localhost(:\d+)?$/;
const MIN_FILL_MS = 3000; // en dessous, envoi jugé automatique
const MAX_PHOTO_B64 = 3500000; // ≈ 2,6 Mo d'image, sous la limite de 4,5 Mo des fonctions Vercel
const PHONE_FR = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Échappe les données utilisateur avant injection dans le HTML de l'e-mail.
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function field(body, key, max) {
  return String(body[key] || '').trim().slice(0, max);
}

function oneLine(s) {
  return s.replace(/[\r\n]+/g, ' ');
}

// Prénom pour la confirmation : premier mot, lettres seulement, 30 caractères au plus.
function firstName(name) {
  const first = name.split(/\s+/)[0] || '';
  return first.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'’-]/g, '').slice(0, 30);
}

function formatDate(d) {
  try {
    return d.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'long', timeStyle: 'short' });
  } catch (e) {
    return d.toISOString();
  }
}

// Gabarit de notification (table + styles inline pour compatibilité clients mail).
// `rows` : [{ label, html }] déjà échappés ; `message` : HTML déjà échappé ou chaîne vide.
function renderEmail(v) {
  const rows = v.rows.map(function (r, i) {
    const border = i < v.rows.length - 1 ? 'border-bottom:1px solid #f0f0ef;' : '';
    return `<tr><td style="padding:14px 18px;${border}">
              <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">${r.label}</div>
              <div style="color:#111827;font-size:16px;font-weight:bold;margin-top:2px;">${r.html}</div>
            </td></tr>`;
  }).join('\n            ');
  const message = v.message ? `<tr><td style="padding:14px 32px 4px;">
          <div style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Message</div>
          <div style="margin-top:6px;padding:16px 18px;background:#f7f7f5;border-left:4px solid #E86A10;border-radius:8px;color:#374151;font-size:15px;line-height:1.6;">${v.message}</div>
        </td></tr>` : '';
  const photo = v.hasPhoto ? `<tr><td style="padding:14px 32px 4px;color:#374151;font-size:14px;">Photo de l'existant jointe à cet e-mail.</td></tr>` : '';
  const reply = v.hasEmail ? 'Répondez directement à cet e-mail pour écrire au client.<br>' : '';
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${v.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="background:#1B4332;padding:26px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="color:#ffffff;font-size:20px;font-weight:bold;">${v.brand}</td>
            <td align="right" style="color:#E86A10;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;">${v.kicker}</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;background:#E86A10;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 4px;">
          <p style="margin:0;color:#1B4332;font-size:18px;font-weight:bold;">${v.title}</p>
          <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Demande reçue via jhd-serrurerie.fr le ${v.sentAt}.</p>
        </td></tr>
        <tr><td style="padding:16px 32px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececeb;border-radius:12px;">
            ${rows}
          </table>
        </td></tr>
        ${message}
        ${photo}
        <tr><td style="padding:24px 32px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td align="center" bgcolor="#E86A10" style="border-radius:12px;">
              <a href="tel:${v.phoneHref}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:12px;">Rappeler ${v.name}</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="background:#081C15;padding:20px 32px;">
          <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.6;">${reply}${v.brand} · jhd-serrurerie.fr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Confirmation envoyée au visiteur : texte fixe, seul le prénom filtré est repris.
function renderAckEmail(v) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nous avons bien reçu votre demande.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="background:#1B4332;padding:26px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="color:#ffffff;font-size:20px;font-weight:bold;">${v.brand}</td>
            <td align="right" style="color:#E86A10;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;">Demande reçue</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;background:#E86A10;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 4px;">
          <p style="margin:0;color:#1B4332;font-size:20px;font-weight:bold;">Votre demande est bien arrivée</p>
          <p style="margin:14px 0 0;color:#374151;font-size:16px;line-height:1.6;">${v.greeting}<br>${v.lead}</p>
        </td></tr>
        <tr><td style="padding:24px 32px 8px;" align="center">
          <p style="margin:0 0 14px;color:#111827;font-size:16px;font-weight:bold;">${v.call}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
            <td align="center" bgcolor="#E86A10" style="border-radius:12px;">
              <a href="tel:${v.phoneHref}" style="display:inline-block;padding:15px 34px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:12px;">${v.phone}</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="background:#081C15;padding:20px 32px;">
          <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.6;">${v.brand} · jhd-serrurerie.fr<br>Cet e-mail confirme la réception de votre demande. Si vous n'êtes pas à l'origine de cette demande, ignorez-le.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Lit et valide les champs propres à chaque formulaire. Renvoie { error } ou { rows, text, message, subjectExtra, attachment }.
function readForm(formName, body, common) {
  if (formName === 'contact') {
    const city = field(body, 'city', 40);
    const cityLabel = CITY_LABELS[city] || 'Non précisée';
    const message = field(body, 'message', 3000);
    if (!common.email || !message) return { error: 'Veuillez remplir tous les champs obligatoires.' };
    return {
      rows: [['Ville', cityLabel]],
      message: message,
      subjectExtra: cityLabel,
    };
  }

  const project = field(body, 'project_type', 20);
  const commune = oneLine(field(body, 'commune', 80));
  const delai = field(body, 'delai', 20);
  const message = field(body, 'message', 3000);
  if (!PROJECT_LABELS[project] || !commune) return { error: 'Veuillez remplir tous les champs obligatoires.' };

  let attachment = null;
  const photo = body.photo;
  if (photo && typeof photo === 'object' && photo.data) {
    const data = String(photo.data);
    if (data.length > MAX_PHOTO_B64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data) || photo.type !== 'image/jpeg') {
      return { error: 'La photo n’a pas pu être jointe. Réessayez sans photo, ou appelez-nous.' };
    }
    attachment = { filename: 'photo-existant.jpg', content: data };
  }

  return {
    rows: [
      ['Projet', PROJECT_LABELS[project]],
      ['Commune', commune],
      ['Délai souhaité', DELAI_LABELS[delai] || 'Non précisé'],
    ],
    message: message,
    subjectExtra: PROJECT_LABELS[project] + ' — ' + commune,
    attachment: attachment,
  };
}

async function resend(apiKey, payload) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
    return;
  }

  // Vercel parse le corps JSON automatiquement ; fallback si string.
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (e) {
    res.status(400).json({ success: false, error: 'Requête invalide.' });
    return;
  }

  const formName = FORMS[body.form_name] ? body.form_name : 'contact';
  const form = FORMS[formName];
  const callUs = ' Appelez-nous au ' + form.phone + '.';

  if (!ORIGINS.test(String(req.headers.origin || ''))) {
    res.status(403).json({ success: false, error: 'Envoi refusé.' + callUs });
    return;
  }

  // Robot détecté (champ piège rempli, ou formulaire envoyé trop vite) : on répond OK sans rien envoyer.
  const elapsed = Number(body.t);
  if (String(body.company || '').trim() || !(elapsed >= MIN_FILL_MS)) {
    res.status(200).json({ success: true });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY manquante');
    res.status(500).json({ success: false, error: 'Erreur de configuration.' + callUs });
    return;
  }

  const name = oneLine(field(body, 'name', 80));
  const email = oneLine(field(body, 'email', 120));
  const phone = oneLine(field(body, 'phone', 30));
  if (!name || !phone) {
    res.status(400).json({ success: false, error: 'Veuillez remplir tous les champs obligatoires.' });
    return;
  }
  if (!PHONE_FR.test(phone)) {
    res.status(400).json({ success: false, error: 'Numéro de téléphone invalide.' });
    return;
  }
  if (email && !EMAIL.test(email)) {
    res.status(400).json({ success: false, error: 'Adresse e-mail invalide.' });
    return;
  }

  const f = readForm(formName, body, { email: email });
  if (f.error) {
    res.status(400).json({ success: false, error: f.error });
    return;
  }

  const sentAt = formatDate(new Date());
  const phoneHref = phone.replace(/[^\d+]/g, '');
  const rows = [['Nom', name], ['Téléphone', phone]].concat(email ? [['E-mail', email]] : [], f.rows);

  const text = [
    form.subject + ' — jhd-serrurerie.fr',
    '---------------------------------------------',
    '',
  ].concat(rows.map(function (r) { return r[0] + ' : ' + r[1]; }),
    f.message ? ['', 'Message :', f.message] : [],
    f.attachment ? ['', 'Photo de l’existant jointe.'] : [],
    ['', 'Reçu le ' + sentAt + '.']).join('\n');

  const html = renderEmail({
    brand: form.brand,
    kicker: form.subject,
    title: formName === 'contact' ? 'Un client vous a contacté' : 'Nouvelle demande de devis menuiserie',
    preheader: escapeHtml(form.subject + ' de ' + name + ' — ' + f.subjectExtra + ' · ' + phone),
    rows: rows.map(function (r) {
      const value = escapeHtml(r[1]);
      if (r[0] === 'Téléphone') return { label: r[0], html: `<a href="tel:${escapeHtml(phoneHref)}" style="color:#E86A10;font-size:20px;font-weight:bold;text-decoration:none;">${value}</a>` };
      if (r[0] === 'E-mail') return { label: r[0], html: `<a href="mailto:${value}" style="color:#1B4332;text-decoration:none;">${value}</a>` };
      return { label: r[0], html: value };
    }),
    message: f.message ? escapeHtml(f.message).replace(/\n/g, '<br>') : '',
    hasPhoto: !!f.attachment,
    hasEmail: !!email,
    name: escapeHtml(name),
    phoneHref: escapeHtml(phoneHref),
    sentAt: escapeHtml(sentAt),
  });

  const notification = {
    from: FROM,
    to: [NOTIFY_TO],
    subject: form.subject + ' — ' + oneLine(f.subjectExtra).slice(0, 80) + ' — ' + name.slice(0, 60),
    text: text,
    html: html,
  };
  if (email) notification.reply_to = email;
  if (f.attachment) notification.attachments = [f.attachment];

  try {
    const r = await resend(apiKey, notification);
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      res.status(502).json({ success: false, error: 'Erreur lors de l’envoi.' + callUs });
      return;
    }

    // Confirmation au visiteur — best-effort : n'échoue pas la soumission si ça rate.
    if (email) {
      const prenom = firstName(name);
      const greeting = prenom ? 'Bonjour ' + prenom + ',' : 'Bonjour,';
      try {
        await resend(apiKey, {
          from: FROM,
          to: [email],
          reply_to: NOTIFY_TO,
          subject: 'Votre demande a bien été reçue — ' + form.brand,
          text: [greeting, '', form.ackLead, '', form.ackCall + ' au ' + form.phone + '.', '', form.brand + ' — jhd-serrurerie.fr',
            '', 'Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.'].join('\n'),
          html: renderAckEmail({
            brand: form.brand,
            greeting: escapeHtml(greeting),
            lead: form.ackLead,
            call: form.ackCall,
            phone: form.phone,
            phoneHref: form.phoneHref,
          }),
        });
      } catch (ackErr) {
        console.error('Ack email error', ackErr);
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur lors de l’envoi.' + callUs });
  }
};

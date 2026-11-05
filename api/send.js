// Fonction Vercel : reçoit les formulaires de réservation et de contact, puis envoie un e-mail en SMTP.
// Variables d'environnement : SMTP_USER, SMTP_PASS (obligatoires)
// et SMTP_HOST, SMTP_PORT, MAIL_TO, MAIL_FROM (facultatives, voir ci-dessous).
// Aucune donnée de formulaire n'est écrite dans les journaux.
import { createHash, randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';

const MAX_FILE = 4 * 1024 * 1024; // Vercel refuse les requêtes de plus de 4,5 Mo
const MAX_RATE = 6;
const RATE_WINDOW = 10 * 60 * 1000;
const PHONE = /^(?:(?:\+|00)33[\s.\-]?(?:\(0\)[\s.\-]?)?|0)[1-9](?:[\s.\-]?\d{2}){4}$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PARIS = 'Europe/Paris';

// Anti-abus au mieux : la mémoire dure le temps de vie de l'instance. Seule une empreinte de l'IP est gardée.
const salt = randomBytes(16);
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  for (const [key, times] of hits) {
    const fresh = times.filter((t) => t > now - RATE_WINDOW);
    if (fresh.length) hits.set(key, fresh);
    else hits.delete(key);
  }
  const key = createHash('sha256').update(salt).update(ip).digest('hex');
  const times = hits.get(key) || [];
  if (times.length >= MAX_RATE) return true;
  hits.set(key, [...times, now]);
  return false;
}

const oneLine = (v) => v.replace(/[\r\n\t]+/g, ' ').trim();
const isoDate = (d) => new Intl.DateTimeFormat('fr-CA', { timeZone: PARIS }).format(d);
const frDate = (iso) => iso.split('-').reverse().join('/');

function validDate(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function validNir(raw) {
  const v = raw.replace(/\s/g, '').toUpperCase();
  if (!/^[1-478]\d{4}(?:\d{2}|2A|2B)\d{6}\d{2}$/.test(v)) return false;
  const body = v.slice(0, 13).replace('2A', '19').replace('2B', '18');
  let rest = 0;
  for (const c of body) rest = (rest * 10 + Number(c)) % 97;
  return 97 - rest === Number(v.slice(13));
}

// Vérifie le contenu réel du fichier, pas seulement son extension.
function fileKind(buf) {
  const ascii = (a, b) => buf.subarray(a, b).toString('latin1');
  if (ascii(0, 5) === '%PDF-') return { ext: 'pdf', type: 'application/pdf' };
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png', type: 'image/png' };
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return { ext: 'webp', type: 'image/webp' };
  if (ascii(4, 8) === 'ftyp' && /^(heic|heix|hevc|mif1|msf1)$/.test(ascii(8, 12))) return { ext: 'heic', type: 'image/heic' };
  return null;
}

function respond(request, ok, error = '', status = 200) {
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
  if ((request.headers.get('accept') || '').includes('application/json')) {
    return Response.json(ok ? { ok: true } : { ok: false, error }, { status, headers });
  }
  return new Response(null, { status: 303, headers: { ...headers, Location: ok ? '/merci' : '/erreur' } });
}

async function readReservation(form, val, need, errors) {
  const service = val('service');
  if (!['conventionne', 'prive', 'pmr'].includes(service)) errors.push('service');
  const pec = val('prise_en_charge');
  const isConv = service === 'conventionne' || (service === 'pmr' && pec === 'conventionne');
  if (service === 'pmr' && !['conventionne', 'prive'].includes(pec)) errors.push('type de trajet');

  const nom = oneLine(need('nom', 'nom'));
  const prenom = oneLine(need('prenom', 'prénom'));
  const tel = oneLine(need('telephone', 'téléphone'));
  const email = oneLine(val('email'));
  const departRue = oneLine(need('depart_rue', 'rue de départ'));
  const departCp = oneLine(need('depart_cp', 'code postal de départ'));
  const departVille = oneLine(need('depart_ville', 'ville de départ'));
  const arriveeRue = oneLine(need('arrivee_rue', 'rue d’arrivée'));
  const arriveeCp = oneLine(need('arrivee_cp', 'code postal d’arrivée'));
  const arriveeVille = oneLine(need('arrivee_ville', 'ville d’arrivée'));
  const date = oneLine(need('date', 'date'));
  const heure = oneLine(need('heure', 'heure'));
  const message = val('message', 2000);
  const today = isoDate(new Date());

  if (tel && !PHONE.test(tel)) errors.push('téléphone');
  if (email && !EMAIL.test(email)) errors.push('e-mail');
  for (const cp of [departCp, arriveeCp]) if (cp && !/^\d{5}$/.test(cp)) errors.push('code postal');
  if (date && (!validDate(date) || date < today)) errors.push('date');
  if (heure && !/^([01]\d|2[0-3]):[0-5]\d/.test(heure)) errors.push('heure');

  const labels = { conventionne: 'Conventionné', prive: 'Privé', pmr: 'PMR' };
  let titre = labels[service] || '';
  if (service === 'pmr') titre += ` / ${isConv ? 'Conventionné' : 'Privé'}`;
  const shownDate = validDate(date) ? frDate(date) : date;

  const lines = [
    `Service : ${titre}`,
    `Rendez-vous : ${shownDate} à ${heure}`,
    '',
    `Départ : ${departRue}, ${departCp} ${departVille}`,
    `Arrivée : ${arriveeRue}, ${arriveeCp} ${arriveeVille}`,
    '',
    `Client : ${prenom} ${nom}`,
    `Téléphone : ${tel}`,
  ];
  if (email) lines.push(`E-mail : ${email}`);

  const attachments = [];
  if (isConv) {
    const tel2 = oneLine(val('telephone2'));
    const naissance = oneLine(need('naissance', 'date de naissance'));
    const nir = oneLine(need('nir', 'numéro de sécurité sociale', 30));
    const caisse = val('caisse95');
    if (!['oui', 'non', 'nsp'].includes(caisse)) errors.push('caisse du 95');
    if (tel2 && !PHONE.test(tel2)) errors.push('téléphone secondaire');
    if (naissance && (!validDate(naissance) || naissance >= today)) errors.push('date de naissance');
    if (nir && !validNir(nir)) errors.push('numéro de sécurité sociale');
    if (val('consent_sante') !== '1') errors.push('accord pour les données de santé');
    if (tel2) lines.push(`Téléphone secondaire : ${tel2}`);
    if (validDate(naissance)) lines.push(`Date de naissance : ${frDate(naissance)}`);
    lines.push(`N° de sécurité sociale : ${nir}`);
    lines.push(`Caisse du 95 : ${{ oui: 'Oui', non: 'Non', nsp: 'Ne sait pas' }[caisse] || ''}`);
    if (service === 'conventionne') lines.push(`Transport : ${val('vehicule') === 'tpmr' ? 'TPMR (fauteuil)' : 'Classique'}`);
    const stamp = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS, dateStyle: 'short', timeStyle: 'short' }).format(new Date());
    lines.push(`Accord données de santé : recueilli le ${stamp}`);

    const file = form.get('bon');
    if (file && typeof file !== 'string' && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      const kind = file.size <= MAX_FILE ? fileKind(buf) : null;
      if (!kind) errors.push('bon de transport');
      else attachments.push({ filename: `bon-de-transport.${kind.ext}`, content: buf, contentType: kind.type });
    }
  } else {
    const passagers = val('passagers');
    if (!/^\d+$/.test(passagers) || Number(passagers) < 1 || Number(passagers) > 8) errors.push('nombre de passagers');
    lines.push(`Passagers : ${passagers}`);
  }
  if (message) lines.push('', 'Informations complémentaires :', message);

  // Le sujet d'un e-mail n'est pas protégé : il ne contient ni nom ni donnée personnelle.
  return { subject: `Réservation ${titre} : ${shownDate} à ${heure}`, lines, replyTo: email, attachments };
}

function readContact(val, need, errors) {
  const nom = oneLine(need('nom', 'nom'));
  const prenom = oneLine(need('prenom', 'prénom'));
  const email = oneLine(need('email', 'e-mail'));
  const tel = oneLine(need('telephone', 'téléphone'));
  const societe = val('profil') === 'societe';
  const nomSociete = oneLine(val('societe'));
  const message = need('message', 'message', 4000);
  if (email && !EMAIL.test(email)) errors.push('e-mail');
  if (tel && !PHONE.test(tel)) errors.push('téléphone');
  if (societe && !nomSociete) errors.push('société');
  return {
    subject: 'Nouveau message depuis le site',
    lines: [`Nom : ${prenom} ${nom}`, `E-mail : ${email}`, `Téléphone : ${tel}`, `Profil : ${societe ? `Société (${nomSociete})` : 'Particulier'}`, '', 'Message :', message],
    replyTo: email,
    attachments: [],
  };
}

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return respond(request, false, 'Demande illisible. Merci de réessayer.', 400);
  }
  const val = (key, max = 300) => {
    const v = form.get(key);
    return typeof v === 'string' ? v.replace(/\0/g, '').trim().slice(0, max) : '';
  };

  // Pot de miel : un robot remplit ce champ invisible. On répond « ok » sans rien envoyer.
  if (val('site_web')) return respond(request, true);

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'inconnue';
  if (rateLimited(ip)) return respond(request, false, 'Trop de demandes envoyées. Merci de patienter ou de nous appeler.', 429);

  const errors = [];
  const need = (key, label, max = 300) => {
    const v = val(key, max);
    if (!v) errors.push(label);
    return v;
  };

  let mail;
  const kind = val('form');
  if (kind === 'reservation') mail = await readReservation(form, val, need, errors);
  else if (kind === 'contact') mail = readContact(val, need, errors);
  else return respond(request, false, 'Formulaire inconnu.', 400);

  if (errors.length) return respond(request, false, `Merci de vérifier : ${[...new Set(errors)].join(', ')}.`, 422);

  const { SMTP_USER, SMTP_PASS, SMTP_HOST = 'smtp.ionos.fr', SMTP_PORT = '465', MAIL_TO = 'contact@taxivaldoise.fr', MAIL_FROM = 'contact@taxivaldoise.fr' } = process.env;
  const failure = "L'envoi a échoué. Merci de réessayer ou de nous appeler au 07 63 76 45 92.";
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Formulaire : variables SMTP_USER ou SMTP_PASS absentes.');
    return respond(request, false, failure, 500);
  }

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      requireTLS: Number(SMTP_PORT) === 587,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: { name: 'Site TaxiValdoise', address: MAIL_FROM },
      to: MAIL_TO,
      replyTo: mail.replyTo && EMAIL.test(mail.replyTo) ? mail.replyTo : undefined,
      subject: oneLine(mail.subject),
      text: `${mail.lines.join('\n')}\n`,
      attachments: mail.attachments,
    });
  } catch (err) {
    console.error('Formulaire : échec SMTP', err && err.code);
    return respond(request, false, failure, 500);
  }
  return respond(request, true);
}

export function GET() {
  return new Response('Méthode non autorisée.', { status: 405, headers: { Allow: 'POST' } });
}

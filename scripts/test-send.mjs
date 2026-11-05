// Teste la fonction d'envoi avec un faux serveur SMTP local : aucun e-mail réel n'est envoyé.
// Lancer avec : npm test
import net from 'node:net';
import assert from 'node:assert/strict';

const received = [];
const smtp = net.createServer((socket) => {
  let data = false;
  let body = '';
  socket.write('220 test\r\n');
  socket.on('error', () => {});
  socket.on('data', (chunk) => {
    const text = chunk.toString('latin1');
    if (data) {
      body += text;
      if (body.endsWith('\r\n.\r\n')) {
        received.push(body);
        data = false;
        body = '';
        socket.write('250 ok\r\n');
      }
      return;
    }
    for (const line of text.split('\r\n').filter(Boolean)) {
      if (/^EHLO/i.test(line)) socket.write('250-test\r\n250 AUTH PLAIN LOGIN\r\n');
      else if (/^AUTH/i.test(line)) socket.write('235 ok\r\n');
      else if (/^DATA/i.test(line)) { data = true; socket.write('354 go\r\n'); }
      else if (/^QUIT/i.test(line)) { socket.write('221 bye\r\n'); socket.end(); }
      else socket.write('250 ok\r\n');
    }
  });
});
await new Promise((resolve) => smtp.listen(0, '127.0.0.1', resolve));

Object.assign(process.env, { SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtp.address().port), SMTP_USER: 'u', SMTP_PASS: 'p' });
const { POST, GET } = await import('../api/send.js');

const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
const base = {
  form: 'reservation', service: 'conventionne', consent_sante: '1', nom: 'Test', prenom: 'QA', telephone: '07 63 76 45 92',
  depart_rue: '1 rue A', depart_cp: '95000', depart_ville: 'Pontoise', arrivee_rue: '2 rue B', arrivee_cp: '95300', arrivee_ville: 'Pontoise',
  date: tomorrow, heure: '10:30', caisse95: 'oui', vehicule: 'classique', naissance: '1985-05-01', nir: '1 85 05 78 006 084 91',
};
const without = (o, ...keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));
const prive = { ...without(base, 'naissance', 'caisse95', 'consent_sante', 'nir'), service: 'prive', passagers: '3' };
const contact = { form: 'contact', nom: 'T', prenom: 'Q', email: 'a@b.fr', telephone: '0763764592', profil: 'particulier', message: 'Bonjour' };
const pdf = new File(['%PDF-1.4 test'], 'bon.pdf', { type: 'application/pdf' });
const fake = new File(['<?php echo 1;'], 'x.pdf', { type: 'application/pdf' });
const big = new File([Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(4 * 1024 * 1024)])], 'b.pdf');

let ipCounter = 0;
async function send(fields, { file, accept = 'application/json' } = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  if (file) fd.set('bon', file);
  ipCounter += 1;
  return POST(new Request('http://x/api/send', { method: 'POST', body: fd, headers: { accept, 'x-forwarded-for': `10.0.0.${ipCounter}` } }));
}

const cases = [
  ['conventionné complet', base, 200, true],
  ['sans numéro de sécurité sociale', without(base, 'nir'), 422, false],
  ['numéro de sécurité sociale faux', { ...base, nir: '185057800608400' }, 422, false],
  ['sans accord santé', without(base, 'consent_sante'), 422, false],
  ['sans caisse', without(base, 'caisse95'), 422, false],
  ['date passée', { ...base, date: '2020-01-01' }, 422, false],
  ['date impossible', { ...base, date: '2030-02-31' }, 422, false],
  ['téléphone faux', { ...base, telephone: '123' }, 422, false],
  ['code postal faux', { ...base, depart_cp: '95' }, 422, false],
  ['privé sans numéro', prive, 200, true],
  ['privé sans passagers', without(prive, 'passagers'), 422, false],
  ['PMR privé', { ...prive, service: 'pmr', prise_en_charge: 'prive' }, 200, true],
  ['PMR conventionné', { ...base, service: 'pmr', prise_en_charge: 'conventionne' }, 200, true],
  ['PMR conventionné sans numéro', without({ ...base, service: 'pmr', prise_en_charge: 'conventionne' }, 'nir'), 422, false],
  ['PMR sans type', { ...base, service: 'pmr' }, 422, false],
  ['contact', contact, 200, true],
  ['contact injection', { ...contact, email: 'a@b.fr\r\nBcc: x@y.z' }, 422, false],
  ['société sans nom', { ...contact, profil: 'societe' }, 422, false],
  ['pot de miel', { ...base, site_web: 'spam' }, 200, false],
  ['formulaire inconnu', { form: 'x' }, 400, false],
  ['bon de transport PDF', base, 200, true, pdf],
  ['faux PDF', base, 422, false, fake],
  ['fichier trop lourd', base, 422, false, big],
];

let failed = 0;
for (const [name, fields, status, mailed, file] of cases) {
  const before = received.length;
  const res = await send(fields, { file });
  const sent = received.length > before;
  const ok = res.status === status && sent === mailed;
  if (!ok) failed += 1;
  console.log(`${ok ? 'OK ' : 'ERR'} ${name} -> ${res.status}, e-mail : ${sent ? 'oui' : 'non'}`);
}

// Contenu de l'e-mail
await send(base);
const message = received.at(-1);
const subject = message.match(/^Subject: (.*)$/m)[1];
assert.ok(!/Test|QA/.test(subject), 'le sujet ne doit pas contenir de nom');
assert.ok(/multipart|text\/plain/.test(message));
await send(base, { file: pdf });
assert.ok(received.at(-1).includes('bon-de-transport.pdf'), 'pièce jointe absente');
console.log('OK  contenu de l’e-mail et pièce jointe');

// Limitation : 7e demande de la même IP refusée
const burst = () => POST(new Request('http://x/api/send', { method: 'POST', body: new URLSearchParams({ form: 'x' }), headers: { accept: 'application/json', 'x-forwarded-for': '9.9.9.9' } }));
let last;
for (let i = 0; i < 7; i += 1) last = await burst();
assert.equal(last.status, 429);
console.log('OK  limitation par IP');

// Sans JavaScript : redirection vers les pages de résultat
const noJs = await send(prive, { accept: 'text/html' });
assert.equal(noJs.status, 303);
assert.equal(noJs.headers.get('location'), '/merci');
assert.equal(GET().status, 405);
console.log('OK  redirection sans JavaScript et méthode GET refusée');

// Panne du serveur d'envoi
smtp.close();
process.env.SMTP_PORT = '1';
const down = await send(base);
assert.equal(down.status, 500);
delete process.env.SMTP_PASS;
assert.equal((await send(base)).status, 500);
console.log('OK  panne SMTP et identifiants absents');

if (failed) { console.error(`${failed} cas en échec`); process.exit(1); }
console.log('Tous les tests passent.');
process.exit(0);

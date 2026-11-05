// Serveur de développement : reproduit les URL sans extension de l'configuration Vercel.
// La fonction Vercel n'est pas exécutée ici : /api/send répond comme la production, sans envoyer d'e-mail
// (en-tête x-mock-fail : simule une erreur serveur).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || 'dist');
const PORT = Number(process.env.PORT || 4321);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/send') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const failing = req.headers['x-mock-fail'];
      console.log('[mock] demande reçue', Buffer.concat(chunks).length, 'octets');
      res.writeHead(failing ? 500 : 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(failing ? { ok: false, error: 'Erreur simulée.' } : { ok: true }));
    });
    return;
  }
  let p = path.normalize(decodeURIComponent(url.pathname));
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (p === '/' || p === path.sep) file = path.join(ROOT, 'index.html');
  else if (!path.extname(file)) file += '.html';
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return fs.readFile(path.join(ROOT, '404.html'), (e, page) => res.end(e ? 'Page introuvable' : page));
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));

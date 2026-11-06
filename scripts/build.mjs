// Génère le site statique dans dist/ (aucune dépendance d'exécution).
import fs from 'node:fs';
import path from 'node:path';
import { PAGES, SITEMAP } from '../src/pages.mjs';
import { SITE } from '../src/components.mjs';

const OUT = process.argv[2] || 'dist';
// --fast : conserve les images déjà copiées pour accélérer les builds répétés
const FAST = process.argv.includes('--fast');
if (!FAST) fs.rmSync(OUT, { recursive: true, force: true });
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(a, b);
    else if (!(FAST && a.includes('assets/img') && fs.existsSync(b))) fs.writeFileSync(b, fs.readFileSync(a));
  }
}
copyDir('public', OUT);

const version = Date.now().toString(36);
for (const [file, render] of Object.entries(PAGES)) {
  fs.writeFileSync(`${OUT}/${file}`, render().replaceAll('__V__', version));
}
fs.copyFileSync('src/css/site.css', `${OUT}/assets/site.css`);
fs.copyFileSync('src/js/site.js', `${OUT}/assets/site.js`);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP.map((p) => `  <url><loc>${SITE.url}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log(`dist/ : ${Object.keys(PAGES).length} pages`);
const legal = ['mentions-legales.html', 'confidentialite.html']
  .flatMap((f) => fs.readFileSync(`${OUT}/${f}`, 'utf8').match(/\[À (compléter|valider|confirmer)[^\]]*\]/g) || []);
if (legal.length) console.warn(`ATTENTION : ${legal.length} champ(s) légaux à renseigner avant la mise en ligne.`);

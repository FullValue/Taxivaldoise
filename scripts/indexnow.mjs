// Signale toutes les URL du site à Bing, Yandex, etc. via IndexNow. À lancer après un déploiement : npm run indexnow
import { SITEMAP } from '../src/pages.mjs';
import { SITE } from '../src/components.mjs';

const key = 'bdb659d59a36c949a0fc7eaebcb62205';
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE.url).host, key, keyLocation: `${SITE.url}/${key}.txt`, urlList: SITEMAP.map((p) => SITE.url + p) }),
});
console.log(`IndexNow : ${res.status} pour ${SITEMAP.length} URL`);
if (!res.ok) process.exit(1);

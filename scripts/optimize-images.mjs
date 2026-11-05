// Convertit les originaux de assets-source/ en WebP multi-tailles dans public/assets/img
// et écrit src/images.json (dimensions, tailles disponibles) utilisé par le build.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets-source';
const OUT = 'public/assets/img';
const P5 = '2025_05_', P9 = '2025_09_', P10 = '2025_10_';
const MAP = {
  'logo': [P10 + 'Black-and-Red-Modern-Car-Rental-Logo-e1761154661112.png', [500]],
  'logo-assurance-maladie': [P5 + 'Noir-et-blanc-moderne-Photographe-Carte-de-Visite-1-e1747164370922.png', [480]],
  'logo-assurance-maladie-2': [P5 + '9-e1747495054322.png', [480]],
  'logo-mgen': [P5 + 'Design-sans-titre-20-e1747495164424.png', [320]],
  'logo-camieg': [P5 + '11-e1747495110161.png', [320]],
  'logo-msa': [P5 + '10-e1747495082636.png', [320]],
  'badge-conventionne': [P5 + '4-1.png', [240]],
  'badge-cpam95': [P5 + '5-1.png', [240]],
  'badge-pmr': [P5 + '6.png', [240]],
  'badge-tel': [P5 + 'Design-sans-titre-16.png', [240]],
  'ic-secure': [P9 + '2-2.png', [200]],
  'ic-check': [P9 + '1-2.png', [200]],
  'ic-flex': [P9 + '3-2.png', [200]],
  'flotte': [P5 + 'ChatGPT-Image-12-mai-2025-01_42_19.png', [640, 1200]],
  'voiture': [P5 + 'Design-sans-titre-22-e1748100239339.png', [800, 1400]],
  'carte-vitale': [P5 + 'Design-sans-titre-23-e1748258979452.png', [480, 800]],
  'medecin': [P5 + 'Rose-Amour-Lettre-Minimaliste-Gribouillis-Sombre-Aucune-reproduction-Telephone-Fond-decran-3-e1761856909964.png', [480, 900]],
  'fleche': [P5 + 'arrow-steps.png', [400]],
  'fleche-bleue': [P5 + 'arrow-steps-blue.png', [400]],
  'chauffeur-avis': [P5 + 'steps-image.png', [480, 740]],
  'taxi-rue': [P5 + 'taxi-car-on-the-city-street-e1747172389219.webp', [640, 1100]],
  'bg-taxi-nuit': [P5 + 'glowing-london-taxi-light.webp', [960, 1920]],
  'bg-podium': [P5 + 'steel-look-podium-product-display.webp', [960, 1920]],
  'banner-equipe': [P5 + '../2025_07_team-discussing-ideas-outside.webp', [640, 1080]],
  'batiment': [P5 + 'StockSnap_ADXWJK5WNS.webp', [640, 1200]],
  'assurance-panneau': [P5 + '66f3cd050e46290528def799_assurance-maladie-2.jpg', [640, 1000]],
  // Cartes « Nos Services »
  'svc-medical': [P5 + 'Taxi-medical-vsl-conventionne.webp', [750]],
  'svc-pmr': [P10 + 'telechargement-8.jpeg', [246]],
  'svc-gares': [P5 + 'people-walking-inside-a-airport-terminal-2024-10-11-10-41-24-utc-scaled.jpg', [640, 1200, 1920]],
  'svc-mise-dispo': [P5 + 'taxi-sign-at-night.webp', [640, 1200]],
  'svc-longue-distance': [P5 + 'eiffel-tower-on-map-2025-02-25-11-08-56-utc-scaled.jpg', [640, 1200]],
  'svc-prive': [P5 + 'successful-business-man-in-new-york-city-portrait-2025-04-02-11-39-37-utc-scaled.jpg', [640, 1200]],
  // Cartes conventionné
  'svc-dialyse': [P5 + '131113jg_centre_dyalise_017-scaled.jpg', [640, 1200]],
  'svc-kine': [P5 + 'adobestock-605365241-1024x689-1.webp', [640, 1024]],
  'svc-domicile': [P10 + 'telechargement-6.jpeg', [328]],
  'svc-enfants': [P5 + 'AdobeStock_46229543-640w.webp', [640]],
  'svc-hygiene': [P5 + 'buy-used-car.jpg', [640, 1200]],
  // Cartes privé
  'prive-affaires': [P9 + '2.png', [640]],
  'prive-aeroport': [P9 + '3.png', [640]],
  'prive-regulier': [P9 + '5.png', [640]],
  'prive-touristique': [P9 + 'Design-sans-titre-6.png', [640, 820]],
  'prive-longue': [P9 + '1.png', [640]],
  'prive-dispo': [P9 + '6.png', [640]],
  // PMR
  'pmr-hero': [P10 + '29nov-VW-bodemverlaging-16x9-1-scaled.jpg.webp', [640, 1200, 1920]],
  'pmr-passager': [P10 + '4.png', [480, 800]],
  'pmr-rampe-portrait': [P10 + '™-3.png', [480, 800]],
  'pmr-caddy': [P10 + 'VW-Caddy-Modulis-5-detoure-pour-vignette-BD-.png', [709]],
  'pmr-rampe': [P10 + 'telechargement-7.jpeg', [275]],
  'pmr-arrimage': [P10 + 'img-7afbf4ac9b7c8edb75841fcda0ffbeb4.jpg', [637]],
  'pmr-habitacle': [P10 + 'MG-1005-taxi-schaetzle.jpg', [640]],
  'pmr-chauffeur': [P10 + 'Mise-a-disposition-de-chauffeur-2-1.webp', [492]],
};

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const [name, [file, widths]] of Object.entries(MAP)) {
  const input = path.join(SRC, file.replace('2025_05_../', ''));
  const meta = await sharp(input).metadata();
  const ratio = meta.height / meta.width;
  const sizes = [];
  for (const wanted of widths) {
    const w = Math.min(wanted, meta.width);
    if (sizes.includes(w)) continue;
    await sharp(input).resize({ width: w }).webp({ quality: 78, alphaQuality: 90, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
    sizes.push(w);
  }
  manifest[name] = { w: meta.width, h: meta.height, ratio, sizes };
}
await sharp(path.join(SRC, P5 + 'glowing-london-taxi-light.webp')).resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 80 }).toFile(path.join(OUT, 'og-image.jpg'));
for (const s of [32, 180, 192, 270]) {
  fs.copyFileSync(path.join(SRC, `${P10}cropped-Black-and-Red-Modern-Car-Rental-Logo-2-${s}x${s}.png`), path.join(OUT, `favicon-${s}.png`));
}
fs.writeFileSync('src/images.json', JSON.stringify(manifest, null, 1));
console.log(Object.keys(manifest).length, 'images');

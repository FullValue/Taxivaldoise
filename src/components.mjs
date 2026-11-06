// Composants HTML partagés : mise en page, images, cartes, formulaires.
import fs from 'node:fs';

const images = JSON.parse(fs.readFileSync(new URL('./images.json', import.meta.url)));

export const SITE = {
  url: 'https://www.taxivaldoise.fr',
  // Ajouter ici les URL publiques : fiche Google, Facebook, Pages Jaunes, etc.
  sameAs: [],
  name: 'TaxiValdoise',
  email: 'contact@taxivaldoise.fr',
  phones: [
    { label: '07 63 76 45 92', tel: '+33763764592' },
    { label: '06 17 71 48 54', tel: '+33617714854' },
  ],
};

// Lien « Contacter par mail » : ouvre directement la messagerie de l'internaute.
export const MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent('Demande depuis le site TaxiValdoise')}`;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const icon = (name) => {
  const paths = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    car: '<path d="M5 17h14M5 17a2 2 0 1 1-4 0v-4l2.5-6A2 2 0 0 1 5.3 6h13.4a2 2 0 0 1 1.8 1l2.5 6v4a2 2 0 1 1-4 0"/><path d="M3 12h18"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    euro: '<path d="M18 6.5A7 7 0 0 0 7 12a7 7 0 0 0 11 5.5M4 10h9M4 14h8"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

export function img(name, { alt = '', sizes, cls = '', eager = false, style = '', fetchpriority } = {}) {
  const m = images[name];
  if (!m) throw new Error(`Image inconnue : ${name}`);
  const largest = m.sizes[m.sizes.length - 1];
  const url = (w) => `/assets/img/${name}-${w}.webp`;
  const srcset = m.sizes.length > 1 ? ` srcset="${m.sizes.map((w) => `${url(w)} ${w}w`).join(', ')}" sizes="${sizes || '100vw'}"` : '';
  return `<img src="${url(largest)}"${srcset} width="${largest}" height="${Math.round(largest * m.ratio)}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''} ${eager ? 'decoding="async"' : 'loading="lazy" decoding="async"'}${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''}>`;
}

const tel = (p) => `<a href="tel:${p.tel}">${p.label}</a>`;

const NAV = [
  ['/', 'Accueil'],
  ['/taxipmr', 'Taxi PMR'],
  ['/taximedicalise', 'Taxi Conventionné'],
  ['/taxiprive', 'Taxi Privé'],
  ['/zones-desservies', 'Zones'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

function navLinks(path) {
  return NAV.map(([href, label]) => `<li><a href="${href}"${path === href || (href === '/blog' && path === '/transport-pmr-95') ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
}

const header = (path, bookHref) => `
<a class="skip" href="#contenu">Aller au contenu</a>
<div class="topbar"><div class="wrap">
  <ul>
    <li class="email"><a href="${MAILTO}">${icon('mail')}Contacter par mail</a></li>
    <li><a href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a></li>
  </ul>
  <p><strong>La solution pour tous vos trajets :</strong> transport PMR, conventionné &amp; privé</p>
</div></div>
<header class="site-header"><div class="wrap" style="position:relative">
  <nav class="nav" aria-label="Navigation principale">
    <a class="nav__logo" href="/" aria-label="TaxiValdoise, accueil">${img('logo', { alt: 'TaxiValdoise', eager: true })}</a>
    <ul class="nav__links">${navLinks(path)}</ul>
    <div class="nav__cta">
      <a class="nav__tel" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a>
      <a class="btn" href="${bookHref}">Réserver</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Ouvrir le menu">
        <svg class="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </div>
  </nav>
  <div class="mobile-menu" id="mobile-menu">
    <ul>${navLinks(path)}</ul>
    <a class="btn" href="${bookHref}">Réserver un trajet</a>
  </div>
</div></header>`;

const FOOT_SERVICES = [['/taxipmr', 'Transport PMR'], ['/transport-fauteuil-roulant-95', 'Taxi fauteuil roulant'], ['/transport-personnes-agees-95', 'Transport personnes âgées'], ['/taximedicalise', 'Taxi conventionné'], ['/taxi-dialyse-95', 'Taxi dialyse'], ['/taxi-chimiotherapie-radiotherapie-95', 'Taxi chimio et radiothérapie'], ['/bon-de-transport-cpam', 'Bon de transport CPAM']];
const FOOT_ZONES = [['pontoise', 'Pontoise'], ['cergy', 'Cergy'], ['argenteuil', 'Argenteuil'], ['gonesse', 'Gonesse'], ['sarcelles', 'Sarcelles'], ['eaubonne', 'Eaubonne'], ['ermont', 'Ermont']];
const links = (items) => items.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('');

const footer = (bookHref) => `
<footer class="site-footer"><div class="wrap">
  <div class="foot">
    <div>
      <a class="foot__logo" href="/" aria-label="TaxiValdoise, accueil">${img('logo', { alt: 'TaxiValdoise' })}</a>
      <p>Transport de personnes à mobilité réduite (PMR), médical conventionné (CPAM) et taxi privé sur mesure. Disponibilité 24h/24, 7j/7. Confort, ponctualité, prise en charge complète.</p>
    </div>
    <div>
      <h2>Nos services</h2>
      <ul>${links(FOOT_SERVICES)}<li><a href="/taxiprive">Taxi privé</a></li></ul>
    </div>
    <div>
      <h2>Zones desservies</h2>
      <ul>${links(FOOT_ZONES.map(([s, n]) => [`/transport-pmr-${s}`, `Taxi PMR ${n}`]))}<li><a href="/zones-desservies">Toutes les zones</a></li></ul>
    </div>
    <div>
      <h2>Contact</h2>
      <ul>
        ${SITE.phones.map((p) => `<li>${tel(p)}</li>`).join('')}
        <li><a href="${MAILTO}">Contacter par mail</a></li>
        <li><a href="/contact">Page contact</a></li>
        <li><a href="/blog">Blog</a></li>
        <li>Val-d’Oise (95), Île-de-France</li>
        <li>Ouvert 24h/24, 7j/7</li>
      </ul>
    </div>
  </div>
  <div class="foot__legal">
    <span>© ${new Date().getFullYear()} TaxiValdoise. Site réalisé par Ulycom.</span>
    <ul>
      <li><a href="/mentions-legales">Mentions légales</a></li>
      <li><a href="/confidentialite">Politique de confidentialité</a></li>
    </ul>
  </div>
</div></footer>
<div class="mobile-bar">
  <a class="btn btn--ghost" href="tel:${SITE.phones[0].tel}">${icon('phone')}Appeler</a>
  <a class="btn" href="${bookHref}">Réserver</a>
</div>`;

export function layout({ path, title, description, body, bookHref = '#reserver', jsonld = [], noindex = false, ogType = 'website', breadcrumb }) {
  const canonical = SITE.url + (path === '/' ? '/' : path);
  // Fil d'Ariane structuré : déduit du titre si la page n'en fournit pas.
  const trail = path === '/' || noindex ? null : (breadcrumb || [[title.split(' | ')[0], path]]);
  const crumbLd = trail ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Accueil', '/'], ...trail].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE.url + p })) }] : [];
  const graph = [...jsonld, ...crumbLd].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${canonical}">`}
<meta property="og:locale" content="fr_FR">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="TaxiValdoise">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}/assets/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#06193a">
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32">
<link rel="icon" href="/assets/img/favicon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/img/favicon-180.png">
<link rel="preload" href="/assets/fonts/jakarta.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=__V__">
<script>(function(d){d.classList.add('js');try{if(!sessionStorage.getItem('tv-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('preload');sessionStorage.setItem('tv-intro','1')}}catch(e){}})(document.documentElement)</script>
${graph}
</head>
<body>
<div class="preloader" aria-hidden="true"><div class="preloader__in">
  ${img('logo', { alt: '', eager: true, cls: 'preloader__logo' })}
  <div class="preloader__road"><svg class="preloader__taxi" viewBox="0 0 64 30" width="64" height="30"><rect x="25" y="0" width="12" height="4" rx="1" fill="#ffb703"/><path fill="#0165cd" d="M4 22v-6c0-1.5 1-2.6 2.5-3L14 11l6-7c.8-.9 1.7-1.3 2.9-1.3h15.5c1.2 0 2.2.5 3 1.4l6.1 7 8 1.6c1.5.3 2.5 1.6 2.5 3.1V22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path fill="#cfe6ff" d="M22.8 5.5H30V11H18Zm9.2 0h6.4c.5 0 1 .2 1.3.6L44 11H32Z"/><g class="preloader__wheel"><circle cx="16" cy="24" r="5" fill="#06193a"/><path stroke="#fff" stroke-width="1.5" d="M13 24h6"/></g><g class="preloader__wheel"><circle cx="48" cy="24" r="5" fill="#06193a"/><path stroke="#fff" stroke-width="1.5" d="M45 24h6"/></g></svg></div>
</div></div>
${header(path, bookHref)}
<main id="contenu">
${body}
</main>
${footer(bookHref)}
<script src="/assets/site.js?v=__V__" defer></script>
</body>
</html>
`;
}

/* ---------- Sections réutilisables ---------- */

export const head = ({ eyebrow, title, text, center = true, tag = 'h2' }) => `
<div class="head${center ? ' head--center' : ''} reveal">
  ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
  <${tag}>${title}</${tag}>
  ${text ? `<p>${text}</p>` : ''}
</div>`;

export const pageHero = ({ image, title, lead, crumb, eyebrow, cta, ctaHref, pos }) => `
<section class="hero hero--page">
  ${img(image, { eager: true, cls: 'hero__bg', sizes: '100vw', fetchpriority: 'high', style: pos ? `object-position:${pos}` : '' })}
  <div class="wrap">
    <nav aria-label="Fil d'Ariane"><ol class="crumbs" style="list-style:none;padding:0"><li><a href="/">Accueil</a></li><li aria-current="page">${crumb}</li></ol></nav>
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h1>${title}</h1>
    ${lead ? `<p class="hero__lead">${lead}</p>` : ''}
    ${cta ? `<div class="btn-row"><a class="btn btn--light" href="${ctaHref}">${cta} ${icon('arrow')}</a><a class="btn btn--outline-light" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a></div>` : ''}
  </div>
</section>`;

/* Carte « Nos Services » : mêmes assets, même voile, même flou au survol que le site d'origine. */
export const svcCard = ({ title, desc, href, image, ov = .4, pos, cta = 'En savoir plus', size = '', sizes = '(max-width: 767px) 100vw, 50vw' }) => `
<article class="svc-card${size ? ` svc-card--${size}` : ''} reveal" style="--ov:${ov}${pos ? `;--pos:${pos}` : ''}">
  ${img(image, { cls: 'svc-card__img', sizes })}
  <span class="svc-card__overlay"></span>
  <div class="svc-card__body">
    <h3>${title}</h3>
    ${desc ? `<p>${desc}</p>` : ''}
    <a class="svc-card__link" href="${href}" aria-label="${esc(cta)} : ${esc(title.replace(/<[^>]+>/g, ''))}">${cta}</a>
  </div>
</article>`;

export const HOME_SERVICES = [
  { title: 'Transport Médical Conventionné (CPAM)', desc: 'Trajets vers hôpitaux, cliniques, centres médicaux. Prise en charge par la Sécurité sociale avec prescription médicale.', href: '/taximedicalise', image: 'svc-medical', ov: .55 },
  { title: 'Transport PMR – Personnes à Mobilité Réduite', desc: 'Véhicules adaptés et chauffeurs formés pour accompagner les personnes à mobilité réduite en toute sécurité et dignité.', href: '/taxipmr', image: 'svc-pmr', ov: .4, pos: '100% 50%' },
  { title: 'Transferts vers Gares &amp; Aéroports', desc: 'Service ponctuel pour vos départs et arrivées à Roissy, Orly, Beauvais ou gares parisiennes.', href: '/taxiprive', image: 'svc-gares', ov: .5 },
  { title: 'Mise à disposition', desc: 'Chauffeur dédié pour plusieurs heures ou toute la journée (rendez-vous médicaux en série, démarches administratives, etc.).', href: '/taxiprive', image: 'svc-mise-dispo', ov: .4, pos: '0% 0%' },
  { title: 'Courses longues distances', desc: 'Déplacements partout en France (ex : hôpital spécialisé, station thermale, etc.) avec confort garanti.', href: '/taxiprive', image: 'svc-longue-distance', ov: .5 },
  { title: 'Taxi Privé', desc: 'Déplacements partout en Île-de-France, pour tous vos besoins de déplacement avec confort garanti.', href: '/taxiprive', image: 'svc-prive', ov: .4 },
];

export const steps = (intro, cta, ctaHref, items) => `
<section class="section section--tint">
  <div class="wrap">
    ${head({ eyebrow: 'Comment ça se passe ?', title: 'Optez pour la simplicité !', text: intro })}
    <ol class="steps" style="list-style:none;padding:0">
      ${(items || [
        ['Contactez-nous', 'Remplissez le formulaire ou appelez-nous pour réserver facilement.'],
        ['Chauffeur dédié', 'Un chauffeur professionnel vous prend en charge à l’heure et au bon endroit.'],
        ['Dépose sécurisée', 'Nous vous déposons en toute sécurité à votre lieu de rendez-vous.'],
        ['Retour à domicile', 'Nous vous raccompagnons à votre domicile en toute sérénité.'],
      ]).map(([t, d]) => `<li class="step reveal"><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
    <div class="section-cta"><a class="btn" href="${ctaHref}">${cta}</a></div>
  </div>
</section>`;

const QUOTES = [
  ['Je fais appel à eux chaque semaine pour mes séances de kiné. Toujours à l’heure, toujours souriants. On se sent vraiment pris en charge, c’est rassurant.', 'Hélène M.', 'Retraitée'],
  ['Je fais trois allers-retours par semaine à l’hôpital. Grâce à eux, je voyage dans de bonnes conditions, sans stress. Les voitures sont propres et confortables.', 'Bernard T.', 'Patient dialysé'],
  ['Mon père a besoin d’accompagnement régulier pour ses soins, et je ne peux pas toujours l’emmener. Grâce à eux, il se sent en sécurité et moi aussi. Merci pour votre sérieux.', 'Nassim R.', 'Fils d’un patient âgé'],
  ['Je ne peux pas conduire mon fils, alors ce service a été un vrai soulagement. Les chauffeurs sont patients et super doux avec lui. C’est un vrai plus dans notre quotidien.', 'Camille D.', 'Maman d’un enfant en rééducation'],
];

export const testimonials = () => `
<section class="section section--tint">
  <div class="wrap">
    ${head({ eyebrow: 'Votre satisfaction, notre fierté', title: 'Ils nous font confiance', text: 'Des centaines de patients et de clients satisfaits chaque semaine : voici ce qu’ils pensent de nos services.' })}
    <div class="quotes">
      ${QUOTES.map(([q, n, r]) => `<figure class="quote reveal"><blockquote>« ${q} »</blockquote><figcaption><span class="quote__av" aria-hidden="true">${n.split(' ').map((w) => w[0]).join('')}</span><span><b>${n}</b><small>${r}</small></span></figcaption></figure>`).join('')}
    </div>
  </div>
</section>`;

/* Bandeau de logos défilant de droite à gauche. La piste contient deux groupes identiques pour une boucle sans saut. */
export const marquee = (logos, { repeat = 3, duration = 40, small = false } = {}) => {
  const group = (hidden) => {
    const items = [];
    for (let i = 0; i < repeat; i += 1) {
      for (const { name, alt } of logos) items.push(img(name, { alt: !hidden && i === 0 ? alt : '', eager: true }));
    }
    return `<div class="marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${items.join('')}</div>`;
  };
  return `<div class="marquee${small ? ' marquee--small' : ''}" style="--dur:${duration}s"><div class="marquee__track">${group(false)}${group(true)}</div></div>`;
};

const PARTNER_LOGOS = [
  { name: 'logo-assurance-maladie-2', alt: 'L’Assurance Maladie' },
  { name: 'logo-mgen', alt: 'MGEN' },
  { name: 'logo-camieg', alt: 'Camieg' },
  { name: 'logo-msa', alt: 'MSA' },
];

// Même chaîne de logos que « Nos partenaires », en format réduit.
export const assuranceMarquee = () => marquee(PARTNER_LOGOS, { repeat: 4, duration: 34, small: true });

export const partners = () => `
<section class="section section--tight partners">
  <h2>Nos partenaires</h2>
  ${marquee(PARTNER_LOGOS, { repeat: 4 })}
</section>`;

export const callCard = (title = '24h/24, 7j/7') => `
<div class="call-card">
  ${img('badge-tel', { alt: '' })}
  <div><strong>${title}</strong><div class="call-card__tels">${SITE.phones.map(tel).join('')}</div></div>
</div>`;

export const contactCards = () => `
<section class="section section--tight"><div class="wrap contact-cards">
  <div class="contact-card reveal"><span class="contact-card__ic">${icon('phone')}</span><div><h3>Téléphone</h3><p>Assistance et informations par téléphone.</p><div class="btn-row">${SITE.phones.map((p, i) => `<a class="btn${i ? ' btn--ghost' : ''}" href="tel:${p.tel}">${icon('phone')}${p.label}</a>`).join('')}</div></div></div>
  <div class="contact-card reveal"><span class="contact-card__ic">${icon('mail')}</span><div><h3>E-mail</h3><p>Une question ou un devis ? Écrivez-nous, votre messagerie s’ouvre directement.</p><div class="btn-row"><a class="btn" href="${MAILTO}">${icon('mail')}Contacter par mail</a></div></div></div>
</div></section>`;

export const ctaFinal = () => `
<section class="cta-final"><div class="wrap">
  <div class="banner reveal">
    ${img('bg-podium', { cls: 'banner__img', sizes: '100vw' })}
    <div>
      <h2>Contactez-nous pour un devis personnalisé ou pour réserver votre trajet</h2>
      <p>Transport PMR, médical ou privé ? Notre équipe est à votre écoute 24h/24 pour organiser votre trajet ou établir un devis sur mesure.</p>
    </div>
    <div class="btn-row banner__cta"><a class="btn btn--light" href="/contact">Contactez-nous ${icon('arrow')}</a><a class="btn btn--outline-light" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a></div>
  </div>
</div></section>`;

export const faq = (items) => `<div class="faq">${items.map(({ q, a }, i) => `<details class="reveal"${i === 0 ? ' open' : ''}><summary>${q}</summary><div class="faq__a">${a}</div></details>`).join('')}</div>`;

export const ticks = (items, two = false) => `<ul class="ticks${two ? ' ticks--2' : ''}">${items.map((t) => `<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul>`;

/* ---------- Formulaires ---------- */

const field = ({ name, label, type = 'text', req = false, col = 6, auto, check, hint, extra = '', cls = '', inputmode, placeholder }) => `
<div class="field col-${col}${cls ? ` ${cls}` : ''}">
  <label for="{F}-${name}">${label}${req ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
  <input id="{F}-${name}" name="${name}" type="${type}"${req ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}${check ? ` data-check="${check}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''} ${extra}>
  ${hint ? `<p class="field__hint">${hint}</p>` : ''}
  <p class="field__err"></p>
</div>`;

const radios = ({ name, legend, options, req = true, col = 6, checked }) => `
<fieldset class="field col-${col}">
  <legend style="padding:0;margin-bottom:5px;font-size:.9rem;font-weight:600">${legend}${req ? ' <span class="req" aria-hidden="true">*</span>' : ''}</legend>
  <div class="choices${options.length > 2 ? ' choices--3' : ''}">
    ${options.map(([v, l]) => `<label class="choice"><input type="radio" name="${name}" value="${v}"${req ? ' required' : ''}${checked === v ? ' checked' : ''}><span>${l}</span></label>`).join('')}
  </div>
  <p class="field__err"></p>
</fieldset>`;

const address = (prefix, title) => `
<div class="fgroup">
  <p class="fgroup__title">${title}</p>
  <div class="grid-f">
    ${field({ name: `${prefix}_rue`, label: 'Rue', req: true, auto: 'off' })}
    ${field({ name: `${prefix}_cp`, label: 'Code postal', req: true, col: 2, cls: 'col-cp', check: 'cp', inputmode: 'numeric', auto: 'off', extra: 'maxlength="5"' })}
    ${field({ name: `${prefix}_ville`, label: 'Ville', req: true, col: 4, cls: 'col-ville', auto: 'off' })}
  </div>
</div>`;

export const privacyNotice = `<p class="form-notice">Vos informations servent uniquement à traiter votre demande et sont réservées à l’équipe TaxiValdoise. Les champs marqués d’un <span class="req">*</span> sont nécessaires pour y répondre. Vous pouvez accéder à vos données, les rectifier ou les faire supprimer : voir notre <a href="/confidentialite" target="_blank" rel="noopener">politique de confidentialité</a>.</p>`;

/** mode : home (choix des 3 services) | conventionne | prive | pmr */
export function bookingForm({ mode, id, title, sub, flat = false, wide = false }) {
  const service = mode === 'home'
    ? radios({ name: 'service', legend: 'Votre besoin', options: [['conventionne', 'Conventionné'], ['prive', 'Privé'], ['pmr', 'PMR']], checked: 'conventionne' })
    : `<input type="hidden" name="service" value="${mode}">`;
  const html = `
<div class="booking${flat ? ' booking--flat' : ''}${wide ? ' booking--wide' : ''}" id="${id}">
  ${title ? `<h2 class="booking__title">${title}</h2>` : ''}
  ${sub ? `<p class="booking__sub">${sub}</p>` : ''}
  <form data-form action="/api/send" method="post" enctype="multipart/form-data">
    <input type="hidden" name="form" value="reservation">
    <div class="hp" aria-hidden="true"><label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off"></label></div>
    <ol class="stepper js-only" style="list-style:none" aria-label="Étapes">
      <li class="on">Trajet</li><li>Rendez-vous</li><li>Coordonnées</li>
    </ol>

    <fieldset class="fstep">
      <legend class="sr-only">Étape 1 : votre trajet</legend>
      ${mode === 'home' || mode === 'pmr' ? `<div class="grid-f service-row" style="margin-bottom:18px">
        ${service}
        ${mode === 'pmr'
          ? radios({ name: 'prise_en_charge', legend: 'Type de trajet', options: [['conventionne', 'Conventionné'], ['prive', 'Privé']], checked: 'conventionne' })
          : `<div class="col-6" data-show="pmr" hidden>${radios({ name: 'prise_en_charge', legend: 'Type de trajet PMR', options: [['conventionne', 'Conventionné'], ['prive', 'Privé']], checked: 'conventionne' })}</div>`}
      </div>` : service}
      <div class="addr-grid">
        ${address('depart', 'Adresse de départ')}
        ${address('arrivee', 'Adresse d’arrivée')}
      </div>
    </fieldset>

    <fieldset class="fstep">
      <legend class="sr-only">Étape 2 : votre rendez-vous</legend>
      <div class="grid-f">
        ${field({ name: 'date', label: 'Date du rendez-vous', type: 'date', req: true, col: 3, cls: 'f-3', check: 'future' })}
        ${field({ name: 'heure', label: 'Heure du rendez-vous', type: 'time', req: true, col: 3, cls: 'f-3' })}
        <div class="col-6 f-3" data-show="notconv">${field({ name: 'passagers', label: 'Nombre de passagers', type: 'number', req: true, extra: 'min="1" max="8" value="1"', inputmode: 'numeric' })}</div>
        <div class="col-6 f-3" data-show="convonly">${radios({ name: 'vehicule', legend: 'Type de transport', options: [['classique', 'Classique'], ['tpmr', 'TPMR (fauteuil)']], checked: 'classique' })}</div>
        <div class="col-6" data-show="conv">${radios({ name: 'caisse95', legend: 'Dépendez-vous de la caisse du 95 ?', options: [['oui', 'Oui'], ['non', 'Non'], ['nsp', 'Je ne sais pas']] })}</div>
        <div class="field col-6">
          <label for="{F}-message">Informations complémentaires (facultatif)</label>
          <textarea id="{F}-message" name="message" maxlength="2000"></textarea>
          <p class="field__hint">Précisez ce qui est utile au trajet (fauteuil, bagages…), sans détail médical.</p>
        </div>
      </div>
    </fieldset>

    <fieldset class="fstep">
      <legend class="sr-only">Étape 3 : vos coordonnées</legend>
      <div class="grid-f">
        ${field({ name: 'nom', label: 'Nom', req: true, col: 3, cls: 'f-4', auto: 'family-name' })}
        ${field({ name: 'prenom', label: 'Prénom', req: true, col: 3, cls: 'f-4', auto: 'given-name' })}
        ${field({ name: 'telephone', label: 'Téléphone', type: 'tel', req: true, col: 3, cls: 'f-4', auto: 'tel', check: 'phone' })}
        ${field({ name: 'email', label: 'E-mail (facultatif)', type: 'email', col: 3, cls: 'f-4', auto: 'email' })}
        <div class="col-6" data-show="conv"><div class="grid-f">
          ${field({ name: 'telephone2', label: 'Téléphone secondaire (facultatif)', type: 'tel', col: 3, cls: 'f-3', auto: 'off', check: 'phone' })}
          ${field({ name: 'naissance', label: 'Date de naissance', type: 'date', req: true, col: 3, cls: 'f-3', auto: 'bday', check: 'past' })}
          <div class="field col-6 f-3">
            <label for="{F}-nir">Numéro de sécurité sociale <span class="req" aria-hidden="true">*</span></label>
            <input id="{F}-nir" name="nir" type="text" required data-check="nir" autocomplete="off" maxlength="21">
            <p class="field__hint">Il figure sur votre carte Vitale. <span data-count>0 / 15</span></p>
            <p class="field__err"></p>
          </div>
          <div class="field col-6">
            <label for="{F}-bon">Bon de transport (facultatif)</label>
            <div class="file-box"><input id="{F}-bon" name="bon" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,application/pdf,image/*"></div>
            <p class="field__hint">PDF ou photo, 4 Mo maximum. Vous pouvez aussi le remettre au chauffeur le jour du trajet, avec votre carte Vitale.</p>
            <p class="field__err"></p>
          </div>
        </div></div>
        <div class="col-6" data-show="conv"><div class="field">
          <label class="check"><input type="checkbox" name="consent_sante" value="1" required><span>J’accepte que TaxiValdoise traite mon numéro de sécurité sociale et les données liées à ma santé (prescription, bon de transport) pour organiser mon transport et sa prise en charge. Je peux retirer cet accord à tout moment. <span class="req" aria-hidden="true">*</span></span></label>
          <p class="field__hint">Sans cet accord, réservez simplement par téléphone.</p>
          <p class="field__err"></p>
        </div></div>
      </div>
    </fieldset>

    <div class="fnav">
      <button class="btn btn--ghost js-only" type="button" data-prev hidden>Retour</button>
      <button class="btn js-only" type="button" data-next>Continuer</button>
      <button class="btn" type="submit">Envoyer ma demande</button>
    </div>
    <p class="form-msg"></p>
    ${privacyNotice}
  </form>
</div>`;
  return html.replaceAll('{F}', id);
}

export function contactForm(id) {
  return `
<div class="booking booking--flat" id="${id}">
  <form data-form action="/api/send" method="post">
    <input type="hidden" name="form" value="contact">
    <div class="hp" aria-hidden="true"><label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off"></label></div>
    <div class="grid-f">
      ${field({ name: 'nom', label: 'Nom', req: true, col: 3, auto: 'family-name' })}
      ${field({ name: 'prenom', label: 'Prénom', req: true, col: 3, auto: 'given-name' })}
      ${field({ name: 'email', label: 'E-mail', type: 'email', req: true, col: 3, auto: 'email' })}
      ${field({ name: 'telephone', label: 'Téléphone', type: 'tel', req: true, col: 3, auto: 'tel', check: 'phone' })}
      ${radios({ name: 'profil', legend: 'Vous êtes', options: [['particulier', 'Particulier'], ['societe', 'Société']], checked: 'particulier' })}
      <div class="col-6" data-show="societe" hidden>${field({ name: 'societe', label: 'Nom de la société', req: true, auto: 'organization' })}</div>
      <div class="field col-6">
        <label for="${id}-message">Message <span class="req" aria-hidden="true">*</span></label>
        <textarea id="${id}-message" name="message" required maxlength="4000" placeholder="Dites-nous tout…"></textarea>
        <p class="field__hint">Merci de ne pas indiquer de détail médical dans ce message.</p>
        <p class="field__err"></p>
      </div>
    </div>
    <div class="fnav"><button class="btn" type="submit">Envoyer</button></div>
    <p class="form-msg"></p>
    ${privacyNotice}
  </form>
</div>`.replaceAll('{F}', id);
}

export const bookingSection = ({ mode, id, eyebrow, title, text }) => `
<section class="section section--tint" id="reserver">
  <div class="wrap booking-layout">
    <div>
      ${head({ eyebrow, title, text, center: false })}
      ${callCard('Un trajet urgent ? Appelez-nous')}
    </div>
    ${bookingForm({ mode, id, flat: true })}
  </div>
</section>`;

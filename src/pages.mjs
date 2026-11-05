// Contenu de chaque page. Les URL reprennent celles du site existant pour conserver le référencement.
import fs from 'node:fs';
import {
  SITE, MAILTO, layout, img, icon, head, pageHero, svcCard, HOME_SERVICES, steps, testimonials, partners, callCard,
  contactCards, ctaFinal, faq, ticks, bookingForm, contactForm, bookingSection, assuranceMarquee,
} from './components.mjs';

const business = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  '@id': `${SITE.url}/#entreprise`,
  name: 'TaxiValdoise',
  url: SITE.url,
  image: `${SITE.url}/assets/img/og-image.jpg`,
  telephone: SITE.phones[0].tel,
  email: SITE.email,
  description: 'Transport PMR, taxi conventionné CPAM et taxi privé dans le Val-d’Oise et en Île-de-France, 24h/24 et 7j/7.',
  areaServed: [{ '@type': 'AdministrativeArea', name: 'Val-d’Oise' }, { '@type': 'AdministrativeArea', name: 'Île-de-France' }],
  provider: { '@type': 'Organization', name: 'TaxiValdoise', url: SITE.url },
};

const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const vehiclesBlock = (ctaHref, showLogos = true) => `
<section class="section">
  <div class="wrap split">
    <div class="split__media reveal">
      ${img('flotte', { alt: 'Deux véhicules de la flotte TaxiValdoise : un van et un break équipés d’un lumineux taxi', sizes: '(max-width: 900px) 100vw, 50vw' })}
      <div class="badges">
        ${img('badge-conventionne', { alt: 'Taxi conventionné par l’Assurance Maladie' })}
        ${img('badge-cpam95', { alt: 'Taxi partenaire officiel CPAM 95' })}
        ${img('badge-pmr', { alt: 'Transport de PMR' })}
      </div>
    </div>
    <div class="split__text reveal">
      <h2>Le transport qu’il vous faut, au moment où vous en avez besoin</h2>
      <p>Transport médicalisé conventionné, ponctuel et sécurisé, avec prise en charge par l’Assurance Maladie. Nous sommes partenaires officiels de la CPAM et habilités au transport de personnes à mobilité réduite (PMR).</p>
      ${showLogos ? assuranceMarquee() : ''}
      <div class="btn-row"><a class="btn" href="${ctaHref}">Réservez maintenant</a></div>
    </div>
  </div>
</section>`;

/* ---------- Accueil ---------- */
function home() {
  const book = '#formulaire-accueil';
  const body = `
<section class="hero hero--home">
  ${img('prive-touristique', { eager: true, cls: 'hero__bg', sizes: '100vw', fetchpriority: 'high' })}
  <div class="wrap">
    <div class="hero__text">
      <span class="eyebrow hero-in" style="--d:0s">Votre confort, notre priorité</span>
      <h1 class="hero-in" style="--d:.08s">Transport PMR, Conventionné <span class="nowrap">&amp; Privé <em>24/7</em></span></h1>
      <p class="hero__lead hero-in" style="--d:.16s">Réservez facilement votre taxi PMR, conventionné ou privé, pour tous vos déplacements à Paris et ses environs.</p>
      <div class="btn-row hero-in" style="--d:.24s">
        <a class="btn btn--light" href="${book}">Réservez maintenant ${icon('arrow')}</a>
        <a class="btn btn--outline-light" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a>
      </div>
      <ul class="hero__facts hero-in" style="--d:.32s">
        <li>${icon('check')}Agréé CPAM</li>
        <li>${icon('check')}+30 ans d’expérience</li>
        <li>${icon('check')}24h/24, 7j/7</li>
      </ul>
    </div>
    <div class="hero__vitale hero-in" style="--d:.2s">${img('carte-vitale', { alt: 'Main tenant une carte Vitale', eager: true, sizes: '(max-width: 760px) 60vw, 34vw' })}</div>
  </div>
</section>

<section class="booking-float"><div class="wrap">
  ${bookingForm({ mode: 'home', id: 'formulaire-accueil', wide: true, title: 'Réservez votre transport adapté en quelques clics !', sub: `Trois étapes, et nous confirmons rapidement. Un trajet urgent ? <a href="tel:${SITE.phones[0].tel}">${SITE.phones[0].label}</a>` })}
</div></section>

<section class="section">
  <div class="wrap">
    ${head({ eyebrow: 'Deux services, une même exigence', title: 'Quel trajet préparez-vous ?', text: 'Un rendez-vous médical pris en charge, ou un déplacement personnel ou professionnel : choisissez votre service.' })}
    <div class="gates">
      <div class="gate gate--conv reveal">
        ${img('svc-medical', { cls: 'gate__img', sizes: '(max-width: 780px) 100vw, 50vw' })}
        <span class="gate__tag">Sur prescription médicale</span>
        <h3>Taxi conventionné</h3>
        <p>Vos trajets de santé pris en charge par l’Assurance Maladie.</p>
        <ul>
          <li>${icon('check')}Jusqu’à 100 % de prise en charge</li>
          <li>${icon('check')}Zéro avance de frais, tiers payant</li>
          <li>${icon('check')}Dialyse, kiné, hôpital, hospitalisation</li>
        </ul>
        <a class="gate__go" href="/taximedicalise">Découvrir le service conventionné ${icon('arrow')}</a>
      </div>
      <div class="gate gate--prive reveal">
        ${img('svc-prive', { cls: 'gate__img', sizes: '(max-width: 780px) 100vw, 50vw' })}
        <span class="gate__tag">Particuliers &amp; professionnels</span>
        <h3>Taxi privé</h3>
        <p>Un chauffeur à votre disposition, pour tous vos déplacements.</p>
        <ul>
          <li>${icon('check')}Gares et aéroports : Roissy, Orly, Beauvais</li>
          <li>${icon('check')}Trajets d’affaires et longues distances</li>
          <li>${icon('check')}Tarifs clairs, annoncés à la réservation</li>
        </ul>
        <a class="gate__go" href="/taxiprive">Découvrir le service privé ${icon('arrow')}</a>
      </div>
    </div>
    <div class="pmr-strip reveal">
      <div>${img('badge-pmr', { alt: '' })}<p><strong>En fauteuil roulant ?</strong> Nos véhicules TPMR équipés sont disponibles en conventionné comme en privé.</p></div>
      <a class="btn btn--ghost" href="/taxipmr">Voir le transport PMR ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    ${head({ eyebrow: 'La solution pour tous vos trajets', title: 'Un service humain, agréé et fiable', text: 'Nos chauffeurs sont formés pour accompagner chaque client, avec courtoisie et bienveillance, que ce soit pour un rendez-vous médical ou un déplacement personnel.' })}
    <div class="features">
      <div class="feature reveal"><span class="feature__ic">${icon('shield')}</span><h3>Agréé par la CPAM &amp; autres caisses</h3><p>Zéro avance de frais avec votre prescription médicale. Financement de votre trajet par les organismes compétents.</p><span class="feature__tag">Prise en charge jusqu’à 100 %</span></div>
      <div class="feature reveal"><span class="feature__ic">${icon('user')}</span><h3>Chauffeurs expérimentés</h3><p>Formés à l’accompagnement médical et à la prise en charge de patients en situation de handicap.</p><span class="feature__tag">PMR &amp; standard</span></div>
      <div class="feature reveal"><span class="feature__ic">${icon('car')}</span><h3>Véhicules confortables et désinfectés</h3><p>Chaque trajet est préparé avec soin, pour vous offrir la meilleure prise en charge possible.</p><span class="feature__tag">Respect des normes d’hygiène</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="split__text reveal">
      <span class="eyebrow">TaxiValdoise, à vos côtés depuis +30 ans</span>
      <h2>Un savoir-faire reconnu pour des trajets en toute sérénité</h2>
      <p>Depuis plus de 30 ans, nous accompagnons nos clients avec rigueur, ponctualité et attention. Que ce soit pour un transport médical conventionné ou un déplacement privé, vous bénéficiez de l’expertise de chauffeurs expérimentés, courtois et à l’écoute.</p>
      <p>Notre engagement : vous garantir un service fiable, humain et sécurisé à chaque trajet.</p>
      ${ticks(['Transport Personnes à Mobilité Réduite', 'Transferts vers gares &amp; aéroports', 'Prise en charge de vos bagages', 'Transport médical conventionné (CPAM)', 'Courses longues distances', 'Mise à disposition', 'Transport privé'], true)}
    </div>
    <div class="split__media reveal">
      <div class="collage">
        ${img('svc-prive', { alt: 'Client souriant à bord d’un taxi', sizes: '(max-width: 900px) 50vw, 25vw' })}
        ${img('taxi-rue', { alt: 'Lumineux taxi sur le toit d’un véhicule en ville', sizes: '(max-width: 900px) 50vw, 25vw' })}
      </div>
      ${callCard('Contactez-nous 24h/24, 7j/7')}
    </div>
  </div>
</section>

${partners()}

<section class="section section--tint" id="nos-services">
  <div class="wrap">
    ${head({ eyebrow: 'Des solutions adaptées à chaque situation', title: 'Nos services de transport personnalisé', text: 'Des solutions sur mesure pour vos trajets médicaux et privés, en toute sérénité.', center: false })}
    <div class="svc-grid">
      ${HOME_SERVICES.map(svcCard).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${head({ eyebrow: 'Comment ça se passe ?', title: 'Optez pour la simplicité !', text: 'Réserver un transport médicalisé n’a jamais été aussi facile, et tout cela est <strong>entièrement pris en charge par votre organisme de santé</strong>, sur prescription médicale.' })}
    <ol class="steps" style="list-style:none;padding:0">
      <li class="step reveal"><h3>Contactez-nous</h3><p>Remplissez le formulaire ou appelez-nous pour réserver facilement.</p></li>
      <li class="step reveal"><h3>Chauffeur dédié</h3><p>Un chauffeur professionnel vous prend en charge à l’heure et au bon endroit.</p></li>
      <li class="step reveal"><h3>Dépose sécurisée</h3><p>Nous vous déposons en toute sécurité à votre lieu de rendez-vous.</p></li>
      <li class="step reveal"><h3>Retour à domicile</h3><p>Nous vous raccompagnons à votre domicile en toute sérénité.</p></li>
    </ol>
    <div class="section-cta"><a class="btn" href="${book}">Réservez maintenant</a></div>
  </div>
</section>

${vehiclesBlock(book).replace('class="section"', 'class="section section--tint"')}

<section class="section">
  <div class="wrap">
    <div class="split" style="margin-bottom:clamp(28px,4vw,52px);align-items:start">
      <div class="reveal"><span class="eyebrow">À propos : +30 ans d’expérience</span><h2 style="color:var(--blue)">Pourquoi nous choisir ?</h2></div>
      <div class="reveal" style="color:var(--muted)">
        <p>Chez nous, chaque trajet est bien plus qu’un simple transport. Nous savons qu’un rendez-vous médical ou un départ à l’aéroport peut être source de stress. C’est pourquoi nous mettons un point d’honneur à offrir un accompagnement bienveillant, ponctuel et sans surprise.</p>
        <p style="margin-top:12px">Nous connaissons parfaitement la région, ses établissements médicaux et ses points stratégiques. Que vous soyez un particulier, un patient ou un professionnel, vous pouvez compter sur une équipe sérieuse, discrète et à votre écoute.</p>
      </div>
    </div>
    <div class="features">
      <div class="feature reveal"><span class="feature__ic">${icon('clock')}</span><h3>Réactivité 7j/7, 24h/24</h3><p>Disponibilité immédiate pour tous vos déplacements.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('user')}</span><h3>Chauffeurs professionnels</h3><p>Habilités par la préfecture.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('heart')}</span><h3>Prise en charge personnalisée</h3><p>Un accompagnement adapté à vos besoins.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('car')}</span><h3>Véhicules contrôlés régulièrement</h3><p>Toujours propres, sûrs et confortables.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('euro')}</span><h3>Devis clairs et transparents</h3><p>Aucune mauvaise surprise, tout est annoncé.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('doc')}</span><h3>Assistance administrative</h3><p>Accompagnement simplifié pour les transports médicaux.</p></div>
    </div>
    <div style="margin-top:clamp(28px,4vw,48px)">${assuranceMarquee()}</div>
  </div>
</section>

${testimonials()}

<section class="section">
  <div class="wrap blog-teaser">
    <div class="reveal">
      <span class="eyebrow">Nos actualités</span>
      <h2 style="color:var(--blue)">Blog &amp; articles</h2>
      <p style="margin-top:14px;color:var(--muted)">Découvrez nos conseils, actualités et informations utiles autour du transport privé et médicalisé : réglementation, confort, accompagnement, démarches administratives, et réponses aux questions fréquentes de nos clients.</p>
      <div class="btn-row" style="margin-top:22px"><a class="btn btn--ghost" href="/blog">Voir tous les articles ${icon('arrow')}</a></div>
    </div>
    ${postCard()}
  </div>
</section>

${ctaFinal()}`;
  return layout({
    path: '/', bookHref: book, body,
    title: 'Taxi conventionné, privé et PMR 24/7 | TaxiValdoise',
    description: 'Taxi conventionné CPAM, taxi privé et transport PMR dans le Val-d’Oise et en Île-de-France. Disponible 24h/24, 7j/7. Réservez en ligne ou par téléphone.',
    jsonld: [business, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'TaxiValdoise', url: `${SITE.url}/` }],
  });
}

function postCard() {
  return `
<article class="post-card reveal">
  ${img('pmr-hero', { alt: 'Passager en fauteuil roulant accédant à un véhicule adapté par une rampe', sizes: '(max-width: 600px) 100vw, 33vw' })}
  <div>
    <span class="eyebrow">Transport PMR</span>
    <h3><a href="/transport-pmr-95">Transport PMR 95 : le guide complet pour vos déplacements dans le Val-d’Oise</a></h3>
    <p>Tout ce qu’il faut savoir sur le transport PMR dans le 95 : confort, sécurité et accompagnement professionnel.</p>
  </div>
</article>`;
}

/* ---------- Conventionné ---------- */
const FAQ_CONV = [
  { q: 'Qu’est-ce qu’un taxi conventionné ?', a: '<p>Un taxi conventionné est un véhicule agréé par la Caisse Primaire d’Assurance Maladie (CPAM) pour assurer le transport assis professionnalisé (TAP) des patients. Ce service est destiné aux personnes dont l’état de santé nécessite un transport adapté, sans nécessiter une ambulance.</p>' },
  { q: 'Qui peut bénéficier d’un taxi conventionné ?', a: '<p>Les patients peuvent bénéficier d’un taxi conventionné dans les situations suivantes :</p><ul><li>Affection de Longue Durée (ALD)</li><li>Hospitalisation (entrée ou sortie)</li><li>Accident du travail ou maladie professionnelle</li><li>Transferts entre établissements de santé</li><li>Séances de soins réguliers (dialyse, chimiothérapie, radiothérapie, kinésithérapie et bien d’autres)</li><li>Femmes enceintes à partir du 6e mois de grossesse</li><li>Personnes à mobilité réduite nécessitant une aide pour se déplacer</li></ul>' },
  { q: 'Comment réserver un taxi conventionné ?', a: '<ul><li><strong>Obtenir une prescription médicale :</strong> demandez à votre médecin un bon de transport (formulaire Cerfa n°11574*04) spécifiant la nécessité d’un transport assis.</li><li><strong>Réserver votre trajet :</strong> contactez-nous par téléphone ou via notre formulaire en ligne pour planifier votre déplacement.</li><li><strong>Jour du transport :</strong> présentez au chauffeur votre bon de transport, votre carte Vitale à jour et, si nécessaire, une attestation de droits.</li></ul>' },
  { q: 'Quelle est la prise en charge financière ?', a: '<p>La CPAM prend en charge les frais de transport à hauteur de <strong>100 %</strong> dans les cas suivants :</p><ul><li>Affection de Longue Durée (ALD)</li><li>Entrée ou sortie d’hospitalisation</li><li>Accident du travail ou maladie professionnelle</li><li>Femmes enceintes à partir du 6e mois</li><li>Transferts entre établissements de santé</li><li>Pension d’invalidité ≥ 66,66 %</li><li>Transports des bénéficiaires de la CSS ou AME</li></ul><p><strong>55 %</strong> dans les autres cas, le reste pouvant être couvert par votre mutuelle.</p><p>Le système de tiers payant est appliqué lorsque les documents requis sont fournis, vous évitant ainsi d’avancer les frais.</p>' },
  { q: 'Quels documents sont nécessaires ?', a: '<p>Pour que votre course soit prise en charge par la CPAM, quelques documents simples suffisent. Veillez à les avoir avec vous le jour du trajet.</p><ul><li>Prescription médicale de transport (bon de transport)</li><li>Carte Vitale à jour</li></ul>' },
  { q: 'Faut-il parfois un accord préalable de la CPAM ?', a: '<p>Oui. Certains transports nécessitent non seulement une prescription, mais aussi un accord préalable de la CPAM (ex. transports longue distance, soins non urgents loin du domicile…).</p><p>Votre médecin remplira un formulaire spécifique à envoyer à la caisse. Sans réponse sous 15 jours, l’accord est réputé accepté.</p>' },
  { q: 'Le taxi conventionné est-il adapté aux personnes à mobilité réduite (PMR) ?', a: '<p>Oui. Certains de nos véhicules sont spécialement équipés pour accueillir des personnes à mobilité réduite, avec marchepieds, espace fauteuil ou poignées adaptées.</p><p>Si vous avez des besoins particuliers, précisez-le lors de la réservation pour qu’un véhicule adapté soit mis à disposition.</p>' },
  { q: 'Les enfants peuvent-ils bénéficier d’un taxi conventionné ?', a: '<p>Oui. Les enfants suivis médicalement peuvent être pris en charge par la CPAM, notamment en cas de pathologie chronique, d’hospitalisation, ou s’ils fréquentent un établissement spécialisé (IME, CMPP…). Une prescription médicale est obligatoire.</p><p>Nous accordons une attention particulière aux plus jeunes : nos chauffeurs sont bienveillants et formés pour les rassurer durant le trajet.</p>' },
];

function conventionne() {
  const book = '#formulaire-medicalise';
  const card = (title, image, extra = {}) => svcCard({ title, image, href: book, cta: 'Réserver', size: 'short', sizes: '(max-width: 460px) 100vw, (max-width: 1100px) 50vw, 25vw', ov: .55, ...extra });
  const body = `
${pageHero({ image: 'svc-medical', pos: '50% 35%', crumb: 'Taxi conventionné', eyebrow: 'Agréé CPAM', title: 'Taxi médical conventionné', lead: 'Dialyse, kiné, hospitalisation, rendez-vous spécialisés : vos trajets de santé pris en charge par l’Assurance Maladie, sur prescription médicale.', cta: 'Réserver mon trajet', ctaHref: book })}

<section class="section">
  <div class="wrap">
    ${head({ eyebrow: 'Un processus simple', title: 'Comment réserver un trajet médicalisé ?', text: 'Un service rapide, encadré et 100 % pris en charge. On s’occupe de tout, vous n’avez plus qu’à monter à bord.' })}
    <div class="split">
      <ol class="steps" style="grid-template-columns:minmax(0,1fr);list-style:none;padding:0">
        <li class="step reveal"><h3>Prescription médicale</h3><p>Pour bénéficier d’un transport médical pris en charge, votre médecin vous remet un <strong>bon de transport</strong> (formulaire Cerfa). C’est la condition essentielle pour activer la prise en charge par la CPAM.</p></li>
        <li class="step reveal"><h3>Réservez votre trajet en quelques minutes</h3><p>Une fois votre prescription en main, remplissez notre <strong>formulaire de réservation en ligne</strong> ou contactez-nous par téléphone. Nous validons ensemble les détails : date, lieu de prise en charge et destination.</p></li>
        <li class="step reveal"><h3>Votre taxi vient vous chercher</h3><p>Le jour de votre rendez-vous, votre <strong>chauffeur se présente à l’adresse convenue</strong>, à l’heure précise. Il vous accompagne avec attention jusqu’à votre centre de soins ou votre domicile.</p></li>
      </ol>
      <div class="split__media reveal" style="max-width:480px;margin-inline:auto">${img('medecin', { alt: 'Médecin souriant, badge « taxi conventionné »', sizes: '(max-width: 900px) 90vw, 480px' })}</div>
    </div>
    <div class="section-cta"><a class="btn" href="${book}">Réservez maintenant</a></div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    ${head({ eyebrow: 'Chaque jour, à vos côtés', title: 'Vos trajets de santé, notre spécialité', text: 'Découvrez quelques-uns des transports médicalisés que nous réalisons chaque jour : dialyse, kiné, hospitalisation, rendez-vous spécialisés, enfants, PMR… Toujours avec confort, ponctualité et prise en charge CPAM.', center: false })}
    <div class="svc-grid svc-grid--4">
      ${card('Transport dialyse', 'svc-dialyse')}
      ${card('Transport kiné / rééducation', 'svc-kine')}
      ${card('Aide à la mobilité', 'svc-medical')}
      ${card('Prise en charge à domicile', 'svc-domicile')}
      ${card('Trajets vers les hôpitaux', 'batiment')}
      ${card('Transport PMR, fauteuil roulant', 'svc-pmr', { pos: '100% 50%' })}
      ${card('Transferts vers gares &amp; aéroports', 'svc-gares')}
      ${card('Transport enfants &amp; mineurs', 'svc-enfants')}
    </div>
    <div class="svc-grid" style="margin-top:20px" id="cpam">
      ${svcCard({ title: 'Hygiène &amp; désinfection du véhicule', desc: 'Chaque véhicule est soigneusement désinfecté avant et après chaque trajet, selon un protocole strict, pour le bien-être de tous nos passagers.', image: 'svc-hygiene', href: book, cta: 'Réserver', ov: .6 })}
      ${svcCard({ title: 'Taxi agréé CPAM', desc: 'Nos taxis conventionnés sont reconnus par la Sécurité sociale et assurent vos déplacements médicaux en toute sérénité. Confort, ponctualité et accompagnement garantis.', image: 'assurance-panneau', href: '#faq', cta: 'En savoir plus', ov: .75 })}
    </div>
  </div>
</section>

${vehiclesBlock(book)}

<section class="section section--tint" id="faq">
  <div class="wrap faq-layout">
    ${head({ eyebrow: 'FAQ', title: 'Préparez votre transport en toute tranquillité', center: false })}
    ${faq(FAQ_CONV)}
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="split__text reveal">
      <h2>Quels sont les avantages de notre service ?</h2>
      <p>Notre société vous accompagne pour tous vos trajets médicaux ou privés, en courte comme en longue distance, avec professionnalisme et bienveillance.</p>
      ${ticks(['Disponibilité 24h/24 et 7j/7', 'Chauffeurs professionnels habilités par la préfecture', 'Transport de personnes à mobilité réduite (TPMR)', 'Véhicules confortables et régulièrement désinfectés', 'Assistance dans les démarches administratives', 'Ponctualité et discrétion assurées'])}
      <div class="btn-row"><a class="btn" href="${book}">Réservez maintenant</a></div>
    </div>
    <div class="split__media reveal">
      ${img('voiture', { alt: 'Break gris de la flotte TaxiValdoise', sizes: '(max-width: 900px) 100vw, 50vw' })}
      <div style="margin-top:16px">${callCard('Contactez-nous 24h/24, 7j/7')}</div>
    </div>
  </div>
</section>

${partners()}
${testimonials()}
${bookingSection({ mode: 'conventionne', id: 'formulaire-medicalise', eyebrow: 'Réservation en ligne', title: 'Réservez votre transport médical en toute sérénité', text: 'Remplissez simplement le formulaire pour réserver votre trajet avec un taxi agréé CPAM. Nous confirmons rapidement chaque demande !' })}
${contactCards()}
${ctaFinal()}`;
  return layout({
    path: '/taximedicalise', bookHref: book, body,
    title: 'Taxi conventionné CPAM dans le Val-d’Oise | TaxiValdoise',
    description: 'Taxi conventionné agréé CPAM : dialyse, kiné, hospitalisation. Prise en charge jusqu’à 100 % sur prescription, sans avance de frais. Réservation 24h/24, 7j/7.',
    jsonld: [business, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_CONV.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } })) }],
  });
}

/* ---------- Privé ---------- */
function prive() {
  const book = '#taxi-prive';
  const card = (title, desc, image) => svcCard({ title, desc, image, href: book, cta: 'Réserver', size: 'tall', ov: .55, sizes: '(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw' });
  const body = `
${pageHero({ image: 'svc-gares', crumb: 'Taxi privé', eyebrow: 'Votre confort, notre priorité', title: 'Votre service de transport privé sur mesure', lead: 'Profitez d’un service de taxi privé fiable, ponctuel et confortable, disponible 24h/24 et 7j/7, que ce soit pour un besoin personnel ou professionnel.', cta: 'Réserver maintenant', ctaHref: book })}

<section class="section">
  <div class="wrap features">
    <div class="feature reveal"><span class="feature__ic">${icon('user')}</span><h3>Services aux particuliers</h3><p>Nous vous accompagnons dans tous vos déplacements privés : gares, aéroports, rendez-vous, sorties, événements, etc., en toute sérénité.</p></div>
    <div class="feature reveal"><span class="feature__ic">${icon('briefcase')}</span><h3>Services aux professionnels</h3><p>Nous facilitons les déplacements professionnels de vos équipes, avec un service fiable, flexible et adapté à vos besoins d’entreprise.</p></div>
    <div class="feature reveal"><span class="feature__ic">${icon('clock')}</span><h3>Chauffeurs disponibles 24/7</h3><p>Réservez à tout moment : nos chauffeurs sont disponibles jour et nuit pour vous offrir des trajets fiables et sans stress.</p></div>
  </div>
  <div class="wrap" style="margin-top:24px">
    <div class="banner reveal">
      ${img('svc-prive', { cls: 'banner__img', sizes: '100vw' })}
      <div><h2>Besoin d’un transport fiable dès maintenant ?</h2><p>Nos chauffeurs privés sont disponibles jour et nuit pour vous garantir des trajets fiables, ponctuels et adaptés à tous vos besoins.</p></div>
      <a class="btn btn--light" href="${book}">Réserver ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    ${head({ eyebrow: '+30 ans d’expérience', title: 'Pourquoi choisir notre service de taxi privé ?' })}
    <div class="features">
      <div class="feature reveal"><span class="feature__ic feature__ic--img">${img('ic-secure', { alt: '' })}</span><h3>Disponibilité &amp; chauffeurs pros</h3><p>Nos chauffeurs privés sont disponibles <strong>24h/24 et 7j/7</strong>, pour vos déplacements personnels comme professionnels. Qualifiés, ponctuels et discrets, ils mettent leur expérience à votre service.</p></div>
      <div class="feature reveal"><span class="feature__ic feature__ic--img">${img('ic-check', { alt: '' })}</span><h3>Confort, sécurité &amp; transparence</h3><p>Nos véhicules sont <strong>contrôlés régulièrement</strong>, propres et confortables. Nous garantissons des <strong>tarifs clairs et sans surprise</strong>, annoncés dès la réservation.</p></div>
      <div class="feature reveal"><span class="feature__ic feature__ic--img">${img('ic-flex', { alt: '' })}</span><h3>Flexibilité &amp; adaptation</h3><p>Pour un <strong>transfert aéroport ou gare, un déplacement d’affaires, une mise à disposition ou un trajet longue distance</strong>, notre service s’adapte avec la même exigence de qualité.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${head({ eyebrow: 'Nos services sur mesure', title: 'Nos services taxi privé', text: 'Transferts aéroport et gare, déplacements d’affaires, trajets réguliers ou longues distances : profitez d’un service de taxi privé fiable, confortable et disponible 24/7.' })}
    <div class="svc-grid svc-grid--3">
      ${card('Taxi d’affaires', 'Déplacements professionnels rapides et discrets.', 'prive-affaires')}
      ${card('Taxi aéroport', 'Transferts vers toutes les gares et aéroports (Roissy, Orly, Beauvais, etc.).', 'prive-aeroport')}
      ${card('Taxi régulier', 'Pour vos trajets courts ou récurrents en toute tranquillité.', 'prive-regulier')}
      ${card('Taxi touristique', 'Visites guidées, circuits touristiques sur mesure.', 'prive-touristique')}
      ${card('Taxi longue distance', 'Déplacements longue distance partout en France.', 'prive-longue')}
      ${card('Mise à disposition', 'Chauffeur privé disponible à l’heure ou à la journée.', 'prive-dispo')}
    </div>
    <div class="banner reveal" style="margin-top:32px">
      ${img('banner-equipe', { cls: 'banner__img', sizes: '100vw' })}
      <div><h2>Besoin d’un taxi privé dès maintenant ?</h2><p>Réservez votre trajet en ligne en quelques clics.</p></div>
      <a class="btn btn--light" href="${book}">Réserver mon trajet ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="wrap split">
    <div class="split__text reveal">
      <span class="eyebrow">Voyagez confortablement, avec ponctualité et discrétion</span>
      <h2>Votre service de taxi privé dans le Val-d’Oise et en Île-de-France</h2>
      <p>Que ce soit pour vos déplacements professionnels, vos trajets quotidiens ou vos rendez-vous personnels, notre service de taxi privé vous accompagne 24h/24 et 7j/7.</p>
    </div>
    <div class="split__media reveal">${img('voiture', { alt: 'Break gris de la flotte TaxiValdoise', sizes: '(max-width: 900px) 100vw, 50vw' })}</div>
  </div>
</section>

${steps('Réserver un transport privé n’a jamais été aussi facile.', 'Réserver maintenant', book, [
  ['Contactez-nous', 'Remplissez le formulaire ou appelez-nous pour réserver facilement.'],
  ['Chauffeur dédié', 'Un chauffeur professionnel vous prend en charge à l’heure et au bon endroit.'],
  ['Dépose sécurisée', 'Nous vous déposons en toute sécurité à votre destination.'],
  ['Retour', 'Nous vous raccompagnons à votre domicile en toute sérénité.'],
]).replace('section section--tint', 'section')}

${bookingSection({ mode: 'prive', id: 'taxi-prive', eyebrow: 'Réservation en ligne', title: 'Réservez votre transport privé en toute sérénité', text: 'Remplissez simplement le formulaire pour réserver votre trajet privé. Nous confirmons rapidement chaque demande !' })}
${contactCards()}
${ctaFinal()}`;
  return layout({
    path: '/taxiprive', bookHref: book, body,
    title: 'Taxi privé Val-d’Oise et Île-de-France, 24h/24 | TaxiValdoise',
    description: 'Taxi privé pour particuliers et professionnels : transferts gares et aéroports (Roissy, Orly, Beauvais), trajets d’affaires, longue distance, mise à disposition. 24/7.',
    jsonld: [business],
  });
}

/* ---------- PMR ---------- */
function pmr() {
  const book = '#formulaire-pmr';
  const body = `
${pageHero({ image: 'pmr-hero', crumb: 'Transport PMR', eyebrow: 'Fauteuil roulant, mobilité réduite', title: 'Transport de personnes à mobilité réduite (TPMR)', lead: 'Des véhicules adaptés, des chauffeurs formés et un accompagnement bienveillant, en conventionné comme en privé.', cta: 'Réserver mon trajet', ctaHref: book })}

<section class="section">
  <div class="wrap split">
    <div class="split__text reveal">
      <span class="eyebrow">Des solutions adaptées à tous</span>
      <h2>Un service de transport adapté aux PMR</h2>
      <p>Chez Taxi Val d’Oise, nous proposons un service de transport pensé pour <strong>les personnes en situation de handicap ou à mobilité réduite</strong>, ponctuel ou régulier. Grâce à des <strong>véhicules adaptés</strong>, des <strong>chauffeurs formés</strong> et un accompagnement bienveillant, nous facilitons vos trajets médicaux, personnels ou professionnels en toute autonomie.</p>
      <p>Nous intervenons partout en Île-de-France, avec un seul objectif : <strong>vous rendre la mobilité simple et sereine.</strong></p>
      ${ticks(['Chauffeurs formés à la prise en charge des personnes à mobilité réduite', 'Véhicules avec rampe d’accès et équipements sécurisés', 'Confort, ponctualité et respect de la dignité du passager', 'Réservation simple 24h/24, par téléphone ou formulaire en ligne', 'Adapté aux personnes en situation de handicap (fauteuil roulant, mobilité réduite, etc.)', 'Prise en charge possible par la CPAM (transport conventionné)', 'Suivi personnalisé et réactif pour chaque demande', 'Disponibilité 7j/7 pour tous types de trajets'])}
    </div>
    <div class="split__media reveal">
      <div class="collage">
        ${img('pmr-passager', { alt: 'Homme souriant en fauteuil roulant dans un parc', sizes: '(max-width: 900px) 50vw, 25vw' })}
        ${img('pmr-rampe-portrait', { alt: 'Passager en fauteuil roulant montant par une rampe d’accès', sizes: '(max-width: 900px) 50vw, 25vw' })}
      </div>
      ${callCard('Contactez-nous 24h/24, 7j/7')}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    <div class="split" style="margin-bottom:clamp(28px,4vw,48px)">
      <div class="split__text reveal">
        <h2>Des véhicules spécialement équipés pour votre confort</h2>
        <p>Nos véhicules TPMR sont <strong>spécialement aménagés</strong> pour accueillir des passagers en fauteuil roulant dans les meilleures conditions. Concrètement, ils disposent de tous les équipements nécessaires pour une <strong>accessibilité optimale</strong>.</p>
        <div class="badges">
          ${img('badge-pmr', { alt: 'Transport de PMR' })}
          ${img('badge-conventionne', { alt: 'Taxi conventionné par l’Assurance Maladie' })}
          ${img('badge-cpam95', { alt: 'Taxi partenaire officiel CPAM 95' })}
        </div>
      </div>
      <div class="split__media reveal">${img('pmr-caddy', { alt: 'Véhicule adapté avec rampe d’accès déployée' })}</div>
    </div>
    <div class="equip">
      <figure class="reveal">${img('pmr-rampe', { alt: 'Rampe d’accès déployée à l’arrière d’un véhicule' })}<figcaption>Rampe d’accès</figcaption></figure>
      <figure class="reveal">${img('pmr-arrimage', { alt: 'Systèmes de fixation au plancher du véhicule' })}<figcaption>Systèmes de fixation sécurisés</figcaption></figure>
      <figure class="reveal">${img('pmr-habitacle', { alt: 'Passager en fauteuil roulant dans un habitacle spacieux' })}<figcaption>Habitacle spacieux et aménagé</figcaption></figure>
      <figure class="reveal">${img('pmr-chauffeur', { alt: 'Chauffeur accompagnant un passager âgé en fauteuil roulant' })}<figcaption>Chauffeurs formés et attentionnés</figcaption></figure>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${head({ eyebrow: '+30 ans d’expérience', title: 'Des chauffeurs spécialisés, patients et attentifs à vos besoins', text: 'Nos chauffeurs assurent vos trajets dans le respect, la sécurité et la ponctualité, tout en apportant une aide humaine précieuse à chaque étape.' })}
    <div class="features">
      <div class="feature reveal"><span class="feature__ic">${icon('shield')}</span><h3>Spécialistes du transport PMR</h3><p>Nos chauffeurs sont <strong>habitués à accompagner les personnes en fauteuil roulant ou en situation de handicap</strong>, avec les bons gestes et une vraie maîtrise du service.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('heart')}</span><h3>Bienveillance et assistance humaine</h3><p>À chaque trajet, nous veillons à ce que <strong>vous soyez écouté, aidé et respecté</strong>. Notre équipe agit avec patience, douceur et attention.</p></div>
      <div class="feature reveal"><span class="feature__ic">${icon('clock')}</span><h3>Service fiable, ponctuel et professionnel</h3><p>Nos chauffeurs sont <strong>ponctuels, organisés et engagés</strong>. Vous pouvez compter sur eux pour être à l’heure, discrets et rassurants.</p></div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="wrap">
    ${head({ eyebrow: 'Adaptés à vos besoins', title: 'Nos services de transport PMR', text: 'Toutes nos prestations de transport médical ou privé sont 100 % accessibles aux personnes à mobilité réduite. Notre flotte accueille en toute sécurité les fauteuils roulants manuels ou électriques, avec arrimage, rampe d’accès et confort garanti.' })}
    <div class="svc-grid">
      ${svcCard({ title: 'TPMR conventionné', desc: 'Sur prescription médicale, avec prise en charge par votre caisse d’assurance maladie.', image: 'medecin', href: '/taximedicalise', ov: .75, pos: '50% 15%', size: 'tall' })}
      ${svcCard({ title: 'TPMR privé', desc: 'Pour vos sorties, démarches et déplacements personnels ou professionnels.', image: 'pmr-chauffeur', href: book, cta: 'Réserver', ov: .55, pos: '50% 30%', size: 'tall' })}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${head({ title: 'Des déplacements pour tous vos besoins', text: 'Des solutions sur mesure et adaptées aux personnes à mobilité réduite, pour vos trajets médicaux et privés, en toute sérénité.' })}
    <div class="svc-grid">
      ${HOME_SERVICES.map((s, i) => svcCard({ ...s, href: book, cta: 'Réserver', title: i === 0 ? 'Rendez-vous médicaux et hospitaliers' : s.title })).join('')}
    </div>
  </div>
</section>

${steps('Réserver un transport PMR n’a jamais été aussi facile. Et si vous avez une prescription médicale, c’est votre caisse d’assurance qui prend tout en charge.', 'Réservez maintenant', book)}
${testimonials().replace('section section--tint', 'section')}
${bookingSection({ mode: 'pmr', id: 'formulaire-pmr', eyebrow: 'Réservation en ligne', title: 'Réservez votre transport PMR, médical ou privé', text: 'Remplissez simplement le formulaire pour réserver votre trajet avec un taxi spécialisé PMR. Nous confirmons rapidement chaque demande !' })}
${contactCards()}
${ctaFinal()}`;
  return layout({
    path: '/taxipmr', bookHref: book, body,
    title: 'Transport PMR et taxi fauteuil roulant Val-d’Oise | TaxiValdoise',
    description: 'Transport de personnes à mobilité réduite : véhicules avec rampe et arrimage, chauffeurs formés, prise en charge CPAM possible. Île-de-France, 24h/24 et 7j/7.',
    jsonld: [business],
  });
}

/* ---------- Contact ---------- */
function contact() {
  const body = `
${pageHero({ image: 'svc-mise-dispo', crumb: 'Contact', title: 'Contact', lead: 'Particulier ou entreprise, nous sommes à votre écoute 24h/24.' })}
<section class="section">
  <div class="wrap booking-layout">
    <div>
      ${head({ eyebrow: 'Nous sommes à votre écoute', title: 'Comment pouvons-nous vous aider ?', text: 'Pour un devis, une information ou une demande spécifique, remplissez le formulaire et nous reviendrons vers vous rapidement !', center: false })}
      ${callCard('Un trajet urgent ? Appelez-nous')}
    </div>
    ${contactForm('formulaire-contact')}
  </div>
</section>
${contactCards()}`;
  return layout({
    path: '/contact', bookHref: '/#formulaire-accueil', body,
    title: 'Contact et devis | TaxiValdoise',
    description: 'Contactez TaxiValdoise pour un devis ou une réservation, par téléphone au 07 63 76 45 92 ou par mail. Disponible 24h/24, 7j/7.',
    jsonld: [business],
  });
}

/* ---------- Blog ---------- */
function blog() {
  const body = `
${pageHero({ image: 'bg-taxi-nuit', crumb: 'Blog', title: 'Blog &amp; articles', lead: 'Nos conseils et informations utiles autour du transport privé et médicalisé.' })}
<section class="section"><div class="wrap posts">${postCard()}</div></section>
${ctaFinal()}`;
  return layout({
    path: '/blog', bookHref: '/#formulaire-accueil', body,
    title: 'Blog et conseils sur le transport médical et PMR | TaxiValdoise',
    description: 'Conseils, réglementation et démarches : les articles de TaxiValdoise sur le transport médical conventionné, le transport PMR et le taxi privé.',
  });
}

function article() {
  const content = fs.readFileSync(new URL('./content/transport-pmr-95.html', import.meta.url), 'utf8');
  const body = `
${pageHero({ image: 'pmr-hero', crumb: '<a href="/blog">Blog</a> › Transport PMR 95', eyebrow: 'Transport PMR', title: 'Transport PMR 95', lead: 'Le guide complet et les avantages essentiels pour vos déplacements dans le Val-d’Oise.' })}
<section class="section">
  <div class="wrap article-layout">
    <article class="prose">${content}</article>
    <aside class="aside">
      <h3>Une question sur votre trajet ?</h3>
      <p>Notre équipe vous conseille, vous guide et vous propose les solutions de transport les plus adaptées à vos besoins dans le Val-d’Oise.</p>
      <a class="btn btn--light" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a>
      <a class="btn btn--outline-light" href="tel:${SITE.phones[1].tel}">${icon('phone')}${SITE.phones[1].label}</a>
      <a class="btn" href="/taxipmr#formulaire-pmr">Réserver un trajet PMR</a>
    </aside>
  </div>
</section>
${ctaFinal()}`;
  return layout({
    path: '/transport-pmr-95', bookHref: '/taxipmr#formulaire-pmr', body, ogType: 'article',
    title: 'Transport PMR 95 : le guide complet | TaxiValdoise',
    description: 'Tout savoir sur le transport PMR dans le Val-d’Oise : véhicules adaptés, prise en charge, hôpitaux desservis, tarifs et conseils pour bien choisir.',
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: 'Transport PMR 95 : le guide complet', datePublished: '2025-11-25', image: `${SITE.url}/assets/img/og-image.jpg`, author: { '@type': 'Organization', name: 'TaxiValdoise' }, publisher: { '@type': 'Organization', name: 'TaxiValdoise' } }],
  });
}

/* ---------- Pages légales : les champs surlignés restent à renseigner avant la mise en ligne ---------- */
const todo = (s) => `<mark>[À compléter : ${s}]</mark>`;
const valider = (s) => `${s} <mark>[À valider]</mark>`;
const UPDATED = '5 novembre 2026';
const mailLink = `<a href="${MAILTO}">${SITE.email}</a>`;

function mentions() {
  const body = `
${pageHero({ image: 'bg-podium', crumb: 'Mentions légales', title: 'Mentions légales' })}
<section class="section"><div class="wrap"><div class="prose">
  <p class="updated">Dernière mise à jour : ${UPDATED}</p>
  <h2>Éditeur du site</h2>
  <ul>
    <li>Dénomination : ${todo('raison sociale ou nom de l’exploitant')}</li>
    <li>Forme juridique et capital social : ${todo('forme et capital')}</li>
    <li>Siège : ${todo('adresse complète')}</li>
    <li>SIRET : ${todo('numéro')}</li>
    <li>Immatriculation (RCS ou registre national des entreprises) : ${todo('numéro et ville')}</li>
    <li>TVA intracommunautaire : ${todo('numéro, ou mention d’exonération')}</li>
    <li>Téléphone : ${SITE.phones[0].label}</li>
    <li>E-mail : ${mailLink}</li>
  </ul>
  <p>Directeur de la publication : ${todo('nom et prénom')}</p>
  <h2>Activité réglementée</h2>
  <p>Exploitant de taxi. Autorisation de stationnement : ${todo('numéro, commune et autorité de délivrance')}. Convention avec l’Assurance Maladie : ${todo('caisse et date de la convention')}.</p>
  <h2>Hébergement</h2>
  <p>Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis. Site : vercel.com. Téléphone : <mark>[À compléter : numéro de l’hébergeur]</mark></p>
  <h2>Conception du site</h2>
  <p>Ulycom.</p>
  <h2>Propriété intellectuelle</h2>
  <p>Les textes, images et éléments graphiques de ce site sont protégés par le droit d’auteur. Toute reproduction sans autorisation préalable est interdite. Les logos et marques cités appartiennent à leurs titulaires respectifs. Crédits photos : ${todo('banques d’images et auteurs')}.</p>
  <h2>Médiation de la consommation</h2>
  <p>En cas de litige, adressez d’abord votre réclamation à TaxiValdoise. Si aucun accord n’est trouvé, vous pouvez saisir gratuitement le médiateur de la consommation dont nous relevons : ${todo('nom, adresse et site du médiateur')}.</p>
  <h2>Données personnelles et cookies</h2>
  <p>Consultez notre <a href="/confidentialite">politique de confidentialité</a>. Ce site ne dépose aucun cookie.</p>
  <h2>Droit applicable</h2>
  <p>Le présent site est soumis au droit français.</p>
</div></div></section>`;
  return layout({ path: '/mentions-legales', bookHref: '/#formulaire-accueil', body, title: 'Mentions légales | TaxiValdoise', description: 'Mentions légales du site TaxiValdoise : éditeur, hébergeur, propriété intellectuelle et médiation.' });
}

function privacy() {
  const body = `
${pageHero({ image: 'bg-podium', crumb: 'Politique de confidentialité', title: 'Politique de confidentialité' })}
<section class="section"><div class="wrap"><div class="prose">
  <p class="updated">Dernière mise à jour : ${UPDATED}</p>
  <p>Cette page explique quelles données nous collectons, pourquoi, combien de temps nous les gardons et quels sont vos droits, conformément au RGPD et à la loi Informatique et Libertés.</p>

  <h2>Responsable du traitement</h2>
  <p>${todo('raison sociale et adresse')}. Pour toute question sur vos données : ${mailLink} ou ${SITE.phones[0].label}. Délégué à la protection des données : ${todo('nom et contact, ou « aucun délégué désigné »')}.</p>

  <h2>Données collectées et utilisation</h2>
  <h3>Demande de réservation</h3>
  <ul>
    <li><strong>Pour tous les trajets :</strong> nom, prénom, téléphone, e-mail si vous le donnez, adresses de départ et d’arrivée, date et heure, informations complémentaires.</li>
    <li><strong>Pour un trajet privé :</strong> nombre de passagers.</li>
    <li><strong>Pour un trajet conventionné :</strong> date de naissance, numéro de sécurité sociale, caisse d’affiliation, type de véhicule et, si vous le transmettez, bon de transport.</li>
  </ul>
  <p><strong>Pourquoi :</strong> répondre à votre demande, organiser le trajet et, pour un transport conventionné, préparer sa prise en charge.</p>
  <p><strong>Base légale :</strong> l’exécution du contrat de transport ou des mesures préalables demandées par vous (article 6.1.b du RGPD).</p>
  <h3>Données de santé</h3>
  <p>Une prescription ou un bon de transport révèle des informations sur votre santé. Nous ne les traitons qu’avec votre <strong>consentement explicite</strong> (article 9.2.a du RGPD), recueilli par la case à cocher du formulaire. Vous pouvez le retirer à tout moment en nous écrivant ; ce retrait ne remet pas en cause ce qui a été fait auparavant. Sans cet accord, vous pouvez réserver par téléphone.</p>
  <h3>Numéro de sécurité sociale</h3>
  <p>Il sert uniquement à établir la prise en charge de votre transport auprès de votre caisse d’assurance maladie. Il n’est demandé que pour un trajet conventionné et n’est jamais utilisé à d’autres fins. Si vous ne souhaitez pas le saisir en ligne, réservez par téléphone. <mark>[À valider : conformité de cet usage au décret n° 2019-341 du 19 avril 2019]</mark></p>
  <h3>Facturation</h3>
  <p>Après le trajet, nous conservons les éléments de facturation et, pour un transport conventionné, les transmettons à votre caisse d’assurance maladie. <strong>Base légale :</strong> nos obligations légales (article 6.1.c du RGPD).</p>
  <h3>Formulaire de contact</h3>
  <p>Nom, prénom, e-mail, téléphone, profil, société éventuelle et message, pour vous répondre. <strong>Base légale :</strong> les mesures préalables à un contrat ou notre intérêt légitime à répondre aux demandes reçues (article 6.1.b ou 6.1.f du RGPD).</p>
  <h3>Sécurité du site</h3>
  <p>Pour limiter les envois abusifs, votre adresse IP est transformée en empreinte non lisible et conservée 10 minutes au plus. L’hébergeur enregistre également des journaux techniques. <strong>Base légale :</strong> notre intérêt légitime à sécuriser le site (article 6.1.f du RGPD).</p>

  <h2>Champs obligatoires</h2>
  <p>Les champs marqués d’un astérisque sont nécessaires pour traiter votre demande. Sans eux, nous ne pouvons pas y répondre en ligne : vous pouvez alors nous appeler.</p>

  <h2>Destinataires</h2>
  <ul>
    <li>Le personnel habilité de TaxiValdoise et le chauffeur chargé de votre trajet.</li>
    <li>Votre caisse d’assurance maladie et, le cas échéant, votre mutuelle, pour un transport conventionné.</li>
    <li>Nos prestataires techniques, agissant sur nos instructions : Vercel (hébergement du site et traitement des formulaires) et IONOS (messagerie).</li>
  </ul>
  <p>Vos données ne sont ni vendues, ni louées, ni utilisées à des fins publicitaires. </p>
  <h3>Transferts hors de l’Union européenne</h3>
  <p>Notre hébergeur Vercel Inc. est une société américaine. Le traitement des formulaires est effectué sur ses serveurs situés à Paris, sans stockage des demandes, et les demandes sont ensuite conservées dans notre messagerie IONOS. Des données techniques peuvent être traitées aux États-Unis, dans le cadre des garanties prévues par le RGPD. <mark>[À valider : garanties indiquées dans le contrat Vercel (DPA, Data Privacy Framework)]</mark></p>

  <h2>Durées de conservation</h2>
  <ul>
    <li>Demande de réservation ou de contact restée sans suite : ${valider('12 mois')}</li>
    <li>Numéro de sécurité sociale et données de santé (bon de transport) : le temps de la prise en charge et de la période de contrôle par l’Assurance Maladie ${todo('durée précise')}</li>
    <li>Pièces comptables et factures : 10 ans (article L123-22 du Code de commerce)</li>
    <li>Empreinte de l’adresse IP (anti-abus) : 10 minutes</li>
    <li>Journaux techniques de l’hébergeur : ${todo('durée indiquée par Vercel')}</li>
  </ul>

  <h2>Sécurité</h2>
  <p>Le site est chiffré (HTTPS), l’envoi des demandes vers notre messagerie est chiffré et l’accès aux demandes reçues est limité aux personnes habilitées. Évitez d’écrire des détails médicaux dans les champs de message. Si vous préférez, vous pouvez remettre votre bon de transport directement au chauffeur.</p>

  <h2>Mineurs et personnes accompagnées</h2>
  <p>Pour un mineur ou une personne protégée, la demande doit être faite par son représentant légal, ou par un proche qui en a reçu l’accord.</p>

  <h2>Vos droits</h2>
  <p>Vous disposez des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité, ainsi que du droit de retirer votre consentement et de définir des directives sur le sort de vos données après votre décès.</p>
  <p>Pour les exercer, écrivez-nous à ${mailLink}. Nous répondons sous un mois. Nous pouvons vous demander de justifier de votre identité en cas de doute raisonnable.</p>
  <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL : 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, <a href="https://www.cnil.fr/fr/plaintes" rel="noopener">www.cnil.fr/fr/plaintes</a>.</p>
  <p>Aucune décision automatisée ni aucun profilage n’est réalisé à partir de vos données.</p>

  <h2>Cookies et services tiers</h2>
  <p>Ce site ne dépose aucun cookie, n’utilise aucun outil de mesure d’audience ni de publicité, et ne charge aucun service tiers : les polices et les images sont hébergées sur notre propre serveur. C’est pourquoi aucun bandeau de consentement ne s’affiche.</p>
</div></div></section>`;
  return layout({ path: '/confidentialite', bookHref: '/#formulaire-accueil', body, title: 'Politique de confidentialité | TaxiValdoise', description: 'Données collectées, finalités, durées de conservation et droits RGPD : comment TaxiValdoise protège vos données personnelles.' });
}

const simple = (path, title, text, noindex = true) => layout({
  path, noindex, bookHref: '/#formulaire-accueil', title: `${title} | TaxiValdoise`, description: text,
  body: `
${pageHero({ image: 'bg-podium', crumb: title, title })}
<section class="section center-page"><div class="wrap">
  <p>${text}</p>
  <div class="btn-row"><a class="btn" href="/">Retour à l’accueil</a><a class="btn btn--ghost" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a></div>
</div></section>`,
});

export const PAGES = {
  'index.html': home,
  'taximedicalise.html': conventionne,
  'taxiprive.html': prive,
  'taxipmr.html': pmr,
  'contact.html': contact,
  'blog.html': blog,
  'transport-pmr-95.html': article,
  'mentions-legales.html': mentions,
  'confidentialite.html': privacy,
  'merci.html': () => simple('/merci', 'Demande bien reçue', 'Merci ! Nous revenons vers vous rapidement pour confirmer votre demande.'),
  'erreur.html': () => simple('/erreur', 'Envoi impossible', 'Votre demande n’a pas pu être envoyée : vérifiez les champs obligatoires, ou appelez-nous directement.'),
  '404.html': () => simple('/404', 'Page introuvable', 'Cette page n’existe pas ou a été déplacée.'),
};

export const SITEMAP = ['/', '/taximedicalise', '/taxiprive', '/taxipmr', '/contact', '/blog', '/transport-pmr-95', '/mentions-legales', '/confidentialite'];

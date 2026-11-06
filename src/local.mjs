// Pages de référencement local : services PMR / conventionné, villes desservies, guide du bon de transport.
// Chaque ville a un contenu propre (établissements, accès, questions locales) : ne pas dupliquer en changeant le nom.
import {
  SITE, layout, img, icon, head, pageHero, svcCard, callCard, contactCards, ctaFinal, faq, ticks, bookingSection,
} from './components.mjs';

const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const CITIES = [
  {
    slug: 'pontoise', name: 'Pontoise', cp: '95300', image: 'pmr-rampe', alt: 'Rampe d’accès déployée à l’arrière d’un véhicule adapté',
    lead: 'Fauteuil roulant, dialyse, rendez-vous au centre hospitalier René-Dubos : un taxi adapté et conventionné, depuis votre porte à Pontoise.',
    intro: 'À Pontoise, beaucoup de nos demandes concernent le <strong>centre hospitalier René-Dubos</strong> : consultations, examens, hospitalisations et retours à domicile. Le chauffeur vous prend en charge chez vous et vous accompagne jusqu’à l’accueil du service concerné.',
    access: 'Le centre ancien de Pontoise est en pente, avec des rues étroites et des trottoirs parfois difficiles en fauteuil. Indiquez-nous votre étage et les marches éventuelles à la réservation : nous préparons le bon véhicule et le temps d’accompagnement nécessaire.',
    care: ['Centre hospitalier René-Dubos', 'Clinique Sainte-Marie à Osny', 'Cabinets de kinésithérapie et centres de radiologie de l’agglomération'],
    near: ['cergy', 'beaumont-sur-oise', 'lisle-adam'], nearText: 'Saint-Ouen-l’Aumône, Osny, Éragny et Ennery',
    faq: [
      { q: 'Pouvez-vous me conduire à l’hôpital René-Dubos en fauteuil roulant ?', a: 'Oui. Nos véhicules adaptés disposent d’une rampe et d’un arrimage pour fauteuil manuel ou électrique. Précisez le service et l’heure du rendez-vous à la réservation.' },
      { q: 'Faites-vous le retour après une hospitalisation à Pontoise ?', a: 'Oui. Donnez-nous l’heure de sortie prévue et transmettez-nous la prescription de transport remise par le service. Si la sortie change d’horaire, appelez-nous pour ajuster la prise en charge.' },
    ],
  },
  {
    slug: 'cergy', name: 'Cergy', cp: '95000', image: 'pmr-habitacle', alt: 'Passager en fauteuil roulant installé dans un habitacle spacieux',
    lead: 'Du Grand Centre aux Hauts-de-Cergy, un transport PMR et un taxi conventionné pour vos soins, vos démarches et vos déplacements du quotidien.',
    intro: 'Cergy accueille la <strong>préfecture du Val-d’Oise</strong> et de nombreux services administratifs. Nos trajets y combinent soins et démarches : rendez-vous médicaux à Pontoise ou Osny, mais aussi préfecture, MDPH et administrations pour les personnes à mobilité réduite.',
    access: 'Les dalles piétonnes de Cergy-Préfecture et de Saint-Christophe compliquent parfois l’arrivée au pied d’un immeuble. Dites-nous l’entrée la plus accessible ou le point de rendez-vous qui vous convient, nous nous organisons en conséquence.',
    care: ['Centre hospitalier René-Dubos à Pontoise', 'Clinique Sainte-Marie à Osny', 'Maisons médicales et cabinets du Grand Centre, de Saint-Christophe et des Hauts-de-Cergy'],
    near: ['pontoise', 'cormeilles-en-parisis', 'lisle-adam'], nearText: 'Osny, Éragny, Vauréal et Jouy-le-Moutier',
    faq: [
      { q: 'Pouvez-vous m’emmener à la préfecture de Cergy en fauteuil roulant ?', a: 'Oui, c’est un trajet privé que nous réalisons sur devis. Nous pouvons aussi attendre ou revenir vous chercher à l’issue de votre rendez-vous.' },
      { q: 'Quel trajet est pris en charge par la CPAM depuis Cergy ?', a: 'Seuls les trajets de soins prescrits par un médecin peuvent être pris en charge, selon votre situation. Une démarche administrative reste un trajet privé.' },
    ],
  },
  {
    slug: 'argenteuil', name: 'Argenteuil', cp: '95100', image: 'pmr-chauffeur', alt: 'Chauffeur accompagnant un passager âgé en fauteuil roulant',
    lead: 'Centre hospitalier Victor-Dupouy, centres de dialyse et hôpitaux parisiens : vos trajets PMR et conventionnés au départ d’Argenteuil, à toute heure.',
    intro: 'Argenteuil est la ville la plus peuplée du Val-d’Oise et dispose de son propre hôpital, le <strong>centre hospitalier Victor-Dupouy</strong>. Sa proximité avec Paris nous amène aussi à conduire des patients vers des hôpitaux spécialisés de la capitale et de la petite couronne.',
    access: 'L’A15 relie rapidement Argenteuil à Paris comme à Cergy-Pontoise, mais les heures de pointe sont chargées. Pour un rendez-vous à horaire fixe, réservez à l’avance : nous calculons le départ avec une marge suffisante.',
    care: ['Centre hospitalier Victor-Dupouy', 'Centres de dialyse et de rééducation du secteur', 'Hôpitaux parisiens et de petite couronne, sur prescription ou en privé'],
    near: ['cormeilles-en-parisis', 'ermont', 'sarcelles'], nearText: 'Bezons, Sannois et Saint-Gratien',
    faq: [
      { q: 'Allez-vous jusqu’aux hôpitaux parisiens depuis Argenteuil ?', a: 'Oui. Nous intervenons dans toute l’Île-de-France. La prise en charge d’un trajet médical dépend de votre prescription et de votre situation : le médecin indique le mode de transport adapté.' },
      { q: 'Pouvez-vous assurer plusieurs trajets par semaine vers le même centre ?', a: 'Oui. Pour une dialyse ou une rééducation, nous planifions vos créneaux à l’avance, avec le même niveau d’accompagnement à chaque séance.' },
    ],
  },
  {
    slug: 'gonesse', name: 'Gonesse', cp: '95500', image: 'svc-medical', alt: 'Patient pris en charge pour un rendez-vous médical',
    lead: 'Pour l’est du Val-d’Oise, un taxi PMR et conventionné vers le centre hospitalier de Gonesse et les établissements de santé du secteur.',
    intro: 'Le <strong>centre hospitalier de Gonesse</strong> est l’établissement public de référence de l’est du département. Nous y conduisons des patients pour leurs consultations, leurs examens et leurs séjours, depuis Gonesse et les communes voisines.',
    access: 'Entre la D317, l’A1 et la Francilienne, le secteur est bien relié, mais dense à proximité de Roissy. Prévoyez votre réservation dès que votre rendez-vous est connu, surtout pour les premières heures de la matinée.',
    care: ['Centre hospitalier de Gonesse', 'Institut de Cancérologie Paris Nord à Sarcelles', 'Centres de dialyse de Garges-lès-Gonesse et des environs'],
    near: ['sarcelles', 'beaumont-sur-oise', 'argenteuil'], nearText: 'Arnouville, Villiers-le-Bel, Goussainville et Garges-lès-Gonesse',
    faq: [
      { q: 'Couvrez-vous Goussainville et Arnouville pour aller à l’hôpital de Gonesse ?', a: 'Oui. Nous prenons en charge les patients à domicile dans ces communes voisines, en fauteuil roulant comme en position assise.' },
      { q: 'Pouvez-vous aussi me déposer à l’aéroport de Roissy en fauteuil roulant ?', a: 'Oui, sur réservation et en privé. Précisez votre terminal, votre horaire de vol et le type de fauteuil.' },
    ],
  },
  {
    slug: 'sarcelles', name: 'Sarcelles', cp: '95200', image: 'svc-dialyse', alt: 'Patient en séance de soins régulière',
    lead: 'Chimiothérapie, radiothérapie, dialyse : des trajets réguliers et rassurants depuis Sarcelles, en taxi conventionné ou en véhicule adapté.',
    intro: 'Sarcelles accueille l’<strong>Institut de Cancérologie Paris Nord</strong>. Les traitements y imposent souvent des trajets répétés, parfois éprouvants au retour. Nous adaptons la prise en charge : horaire stable, chauffeur prévenu de votre état et retour organisé dès la fin de la séance.',
    access: 'Le tramway T5 et la gare de Garges-Sarcelles desservent bien la ville, mais restent peu adaptés après un traitement fatigant. Le transport de porte à porte évite la marche et l’attente, depuis les Lochères comme depuis le village.',
    care: ['Institut de Cancérologie Paris Nord', 'Centre hospitalier de Gonesse', 'Centres de dialyse et cabinets de rééducation du secteur'],
    near: ['gonesse', 'eaubonne', 'argenteuil'], nearText: 'Garges-lès-Gonesse, Villiers-le-Bel, Groslay et Saint-Brice-sous-Forêt',
    faq: [
      { q: 'Le retour de chimiothérapie est-il possible à une heure variable ?', a: 'Oui. La fin d’une séance n’est pas toujours prévisible : prévenez-nous dès que possible ou demandez au service de nous appeler, nous organisons le retour.' },
      { q: 'Prenez-vous en charge les patients en fauteuil roulant à Sarcelles ?', a: 'Oui. Nos véhicules adaptés accueillent les fauteuils manuels et électriques, avec rampe et arrimage.' },
    ],
  },
  {
    slug: 'eaubonne', name: 'Eaubonne', cp: '95600', image: 'pmr-passager', alt: 'Homme souriant en fauteuil roulant dans un parc',
    lead: 'Un transport PMR et un taxi conventionné pour l’hôpital Simone-Veil et toute la vallée de Montmorency.',
    intro: 'L’<strong>hôpital Simone-Veil</strong>, implanté à Eaubonne et à Montmorency, concentre une grande partie des besoins de la vallée. Si vos rendez-vous se répartissent entre les deux sites, indiquez bien l’adresse exacte sur votre demande pour éviter toute erreur.',
    access: 'Les rues résidentielles de la vallée de Montmorency sont calmes, mais le stationnement y est parfois limité devant les entrées. Signalez-nous tout escalier ou accès difficile, et un proche présent à la prise en charge si c’est le cas.',
    care: ['Hôpital Simone-Veil, sites d’Eaubonne et de Montmorency', 'Clinique Claude-Bernard à Ermont', 'Cabinets de kinésithérapie et de rééducation de la vallée'],
    near: ['ermont', 'sarcelles', 'cormeilles-en-parisis'], nearText: 'Soisy-sous-Montmorency, Montmorency, Margency et Saint-Prix',
    faq: [
      { q: 'Allez-vous sur les deux sites de l’hôpital Simone-Veil ?', a: 'Oui. Précisez simplement si votre rendez-vous a lieu à Eaubonne ou à Montmorency au moment de la réservation.' },
      { q: 'Puis-je réserver un taxi PMR pour un proche âgé à Eaubonne ?', a: 'Oui. Vous pouvez réserver pour lui, par téléphone ou en ligne, et rester notre interlocuteur pour l’organisation du trajet.' },
    ],
  },
  {
    slug: 'ermont', name: 'Ermont', cp: '95120', image: 'svc-kine', alt: 'Séance de kinésithérapie',
    lead: 'Clinique Claude-Bernard, kiné, rendez-vous réguliers : un taxi adapté et conventionné au départ d’Ermont, de porte à porte.',
    intro: 'La <strong>clinique Claude-Bernard</strong> d’Ermont reçoit de nombreux patients pour des interventions et des suivis. Après une opération, un trajet stable et sans correspondance change vraiment le quotidien : c’est ce que nous organisons, à l’aller comme au retour.',
    access: 'La gare d’Ermont-Eaubonne est un important nœud ferroviaire, mais une correspondance avec des béquilles ou en fauteuil reste difficile. L’A115 permet aussi de rejoindre rapidement les établissements du secteur en voiture.',
    care: ['Clinique Claude-Bernard', 'Hôpital Simone-Veil à Eaubonne', 'Cabinets de kinésithérapie et centres d’imagerie du Parisis'],
    near: ['eaubonne', 'cormeilles-en-parisis', 'argenteuil'], nearText: 'Franconville, Sannois, Le Plessis-Bouchard et Saint-Leu-la-Forêt',
    faq: [
      { q: 'Pouvez-vous me raccompagner après une opération à la clinique Claude-Bernard ?', a: 'Oui. Demandez une prescription de transport si votre état le justifie, puis donnez-nous l’heure de sortie annoncée par le service.' },
      { q: 'Faites-vous les trajets de kiné réguliers à Ermont ?', a: 'Oui, nous pouvons planifier une série de séances. La prise en charge dépend de la prescription et de votre situation.' },
    ],
  },
  {
    slug: 'beaumont-sur-oise', name: 'Beaumont-sur-Oise', cp: '95260', image: 'svc-longue-distance', alt: 'Taxi sur la route pour un trajet longue distance',
    lead: 'Dans le nord du Val-d’Oise, où les transports adaptés sont plus rares : un taxi PMR et conventionné pour vos soins, de près comme de loin.',
    intro: 'Autour de Beaumont-sur-Oise et de Persan, les soins spécialisés imposent souvent de longs trajets vers Pontoise, Gonesse ou Paris. L’<strong>hôpital de Beaumont-sur-Oise</strong> assure une partie du suivi, et nous prenons le relais pour tous les déplacements plus lointains.',
    access: 'Le nord du département offre moins d’alternatives adaptées et des fréquences de train plus faibles. Réservez tôt pour un rendez-vous matinal : nous prévoyons le trajet complet et son retour, y compris pour un fauteuil électrique.',
    care: ['Hôpital de Beaumont-sur-Oise', 'Centre hospitalier René-Dubos à Pontoise', 'Établissements spécialisés d’Île-de-France, sur prescription ou en privé'],
    near: ['lisle-adam', 'pontoise', 'gonesse'], nearText: 'Persan, Bernes-sur-Oise, Mours et Nointel',
    faq: [
      { q: 'Venez-vous jusqu’à Beaumont-sur-Oise pour un trajet vers Paris ?', a: 'Oui. Pour les longues distances, la demande d’accord préalable peut être nécessaire au-delà de 150 km : votre médecin vous l’indiquera.' },
      { q: 'Couvrez-vous Persan et les communes voisines ?', a: 'Oui, nous intervenons à Persan, Bernes-sur-Oise, Mours et Nointel, et plus largement dans tout le Val-d’Oise.' },
    ],
  },
  {
    slug: 'lisle-adam', name: 'L’Isle-Adam', cp: '95290', image: 'svc-domicile', alt: 'Accompagnement d’une personne à son domicile',
    lead: 'Clinique Conti, soins réguliers, sorties : un chauffeur attentif et un véhicule adapté à L’Isle-Adam et dans la vallée de l’Oise.',
    intro: 'La <strong>clinique Conti</strong> est l’établissement de proximité de L’Isle-Adam. Pour de nombreux seniors du secteur, conserver une sortie, un rendez-vous ou un suivi passe par un transport fiable : nous intervenons à domicile, avec l’aide nécessaire pour descendre et monter à bord.',
    access: 'Entre forêt et bords de l’Oise, certains quartiers restent éloignés des gares et des arrêts accessibles. Un transport sur réservation vous évite de dépendre d’un proche ou d’une correspondance, y compris depuis Parmain ou Mériel.',
    care: ['Clinique Conti', 'Hôpital de Beaumont-sur-Oise', 'Centre hospitalier René-Dubos à Pontoise'],
    near: ['beaumont-sur-oise', 'pontoise', 'cergy'], nearText: 'Parmain, Mériel, Nesles-la-Vallée et Champagne-sur-Oise',
    faq: [
      { q: 'Pouvez-vous emmener un proche âgé à la clinique Conti ?', a: 'Oui. Le chauffeur l’aide à sortir de chez lui et à s’installer, puis l’accompagne jusqu’à l’accueil si besoin.' },
      { q: 'Proposez-vous aussi des sorties non médicales à L’Isle-Adam ?', a: 'Oui, en transport privé sur devis : courses, famille, activités ou démarches, en fauteuil roulant ou non.' },
    ],
  },
  {
    slug: 'cormeilles-en-parisis', name: 'Cormeilles-en-Parisis', cp: '95240', image: 'svc-pmr', alt: 'Passager à mobilité réduite accompagné vers un véhicule',
    lead: 'Clinique du Parisis, hôpital d’Argenteuil, rééducation : un taxi PMR et conventionné à Cormeilles-en-Parisis et dans le Parisis.',
    intro: 'La <strong>clinique du Parisis</strong> se trouve à Cormeilles-en-Parisis, et les patients du secteur se dirigent également vers Argenteuil ou Ermont. La ville s’est beaucoup développée, et nous intervenons aussi bien dans le centre historique que dans les quartiers récents.',
    access: 'Le centre de Cormeilles est sur une butte, avec des rues en pente qui compliquent les déplacements en fauteuil. L’A15 permet ensuite de rejoindre rapidement Argenteuil, Cergy-Pontoise ou Paris.',
    care: ['Clinique du Parisis', 'Centre hospitalier Victor-Dupouy à Argenteuil', 'Clinique Claude-Bernard à Ermont'],
    near: ['argenteuil', 'ermont', 'cergy'], nearText: 'Herblay-sur-Seine, Montigny-lès-Cormeilles, La Frette-sur-Seine et Franconville',
    faq: [
      { q: 'Intervenez-vous à Herblay et Montigny-lès-Cormeilles ?', a: 'Oui. Nous prenons en charge les patients et les personnes à mobilité réduite dans ces communes voisines, sur simple réservation.' },
      { q: 'Puis-je réserver un trajet récurrent vers Argenteuil ?', a: 'Oui. Donnez-nous votre calendrier de rendez-vous, et nous planifions vos trajets à l’avance.' },
    ],
  },
];

const cityUrl = (c) => `/transport-pmr-${c.slug}`;
const bySlug = Object.fromEntries(CITIES.map((c) => [c.slug, c]));

const SERVICES_LINKS = [
  ['/taxipmr', 'Transport PMR'], ['/transport-fauteuil-roulant-95', 'Taxi fauteuil roulant'], ['/transport-personnes-agees-95', 'Transport personnes âgées'],
  ['/taximedicalise', 'Taxi conventionné'], ['/taxi-dialyse-95', 'Taxi dialyse'], ['/taxi-chimiotherapie-radiotherapie-95', 'Taxi chimio et radiothérapie'],
  ['/bon-de-transport-cpam', 'Bon de transport CPAM'],
];

export const footerSeoLinks = () => ({ services: SERVICES_LINKS, cities: CITIES.map((c) => [cityUrl(c), c.name]) });

export const business = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE.url}/#entreprise`,
  name: 'TaxiValdoise',
  url: `${SITE.url}/`,
  logo: `${SITE.url}/assets/img/logo-500.webp`,
  image: `${SITE.url}/assets/img/og-image.jpg`,
  telephone: SITE.phones[0].tel,
  email: SITE.email,
  description: 'Transport de personnes à mobilité réduite et taxi conventionné CPAM dans le Val-d’Oise (95) et en Île-de-France, 24h/24 et 7j/7. Taxi privé sur réservation.',
  address: { '@type': 'PostalAddress', addressRegion: 'Île-de-France', addressCountry: 'FR' },
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  contactPoint: SITE.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p.tel, contactType: 'reservations', areaServed: 'FR', availableLanguage: 'French' })),
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Val-d’Oise' },
    { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    ...CITIES.map((c) => ({ '@type': 'City', name: c.name })),
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de transport',
    itemListElement: [
      ['Transport de personnes à mobilité réduite', '/taxipmr'], ['Taxi conventionné CPAM', '/taximedicalise'],
      ['Taxi pour fauteuil roulant', '/transport-fauteuil-roulant-95'], ['Taxi pour dialyse', '/taxi-dialyse-95'],
      ['Taxi pour chimiothérapie et radiothérapie', '/taxi-chimiotherapie-radiotherapie-95'], ['Transport de personnes âgées', '/transport-personnes-agees-95'],
    ].map(([name, p]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, url: SITE.url + p } })),
  },
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
};

const faqLd = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: stripTags(q), acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } })) });
const serviceLd = (name, path, areaServed = { '@type': 'AdministrativeArea', name: 'Val-d’Oise' }) => ({ '@context': 'https://schema.org', '@type': 'Service', name, serviceType: name, url: SITE.url + path, provider: { '@id': `${SITE.url}/#entreprise` }, areaServed });

const chips = (links) => `<ul class="zone-links">${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>`;

/* Bloc réutilisé (accueil, pages PMR et conventionné) : relie les services aux villes. */
export const zonesSection = ({ title = 'Transport PMR et taxi conventionné dans tout le Val-d’Oise', tint = true } = {}) => `
<section class="section${tint ? ' section--tint' : ''}">
  <div class="wrap">
    ${head({ eyebrow: 'Zones desservies', title, text: 'Nous intervenons dans tout le Val-d’Oise et en Île-de-France. Trouvez les informations utiles pour votre ville :' })}
    ${chips(CITIES.map((c) => [cityUrl(c), `Taxi PMR ${c.name}`]))}
    <div class="section-cta"><a class="btn btn--ghost" href="/zones-desservies">Voir toutes les zones desservies</a></div>
  </div>
</section>`;

const relatedServices = (exclude) => `
<section class="section section--tight">
  <div class="wrap">
    ${head({ title: 'Nos autres services' })}
    ${chips(SERVICES_LINKS.filter(([h]) => h !== exclude))}
  </div>
</section>`;

/* ---------- Pages villes ---------- */
function cityPage(c) {
  const path = cityUrl(c);
  const book = '#reserver';
  const body = `
${pageHero({ image: 'pmr-hero', crumb: `<a href="/zones-desservies">Zones desservies</a> › ${c.name}`, eyebrow: `${c.name} (${c.cp})`, title: `Transport PMR et taxi conventionné à ${c.name}`, lead: c.lead, cta: 'Réserver mon trajet', ctaHref: book })}

<section class="section">
  <div class="wrap split">
    <div class="split__text reveal">
      <span class="eyebrow">Votre transport à ${c.name}</span>
      <h2>Se déplacer à ${c.name} avec une mobilité réduite</h2>
      <p>${c.intro}</p>
      <p>${c.access}</p>
      ${ticks(['Véhicules avec rampe et arrimage pour fauteuil manuel ou électrique', 'Taxi conventionné : prise en charge possible sur prescription médicale', 'Accompagnement de la porte de chez vous jusqu’à l’accueil', 'Réservation 24h/24 et 7j/7, ponctuelle ou régulière'])}
    </div>
    <div class="split__media reveal">
      ${img(c.image, { alt: c.alt, sizes: '(max-width: 900px) 100vw, 50vw' })}
      ${callCard(`Un trajet à ${c.name} ? Appelez-nous`)}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap split">
    <div class="split__text reveal">
      <h2>Vos destinations de soins depuis ${c.name}</h2>
      <ul class="care-list">${c.care.map((d) => `<li>${icon('check')}<span>${d}</span></li>`).join('')}</ul>
      <p style="margin-top:16px">Nous desservons aussi tout établissement de votre choix, sur simple indication de l’adresse. Pour un trajet remboursable, c’est votre médecin qui prescrit le transport adapté : <a href="/bon-de-transport-cpam">voir le fonctionnement du bon de transport</a>.</p>
    </div>
    <div class="split__text reveal">
      <h2>Communes voisines</h2>
      <p>Nous intervenons également à ${c.nearText}.</p>
      ${chips(c.near.map((s) => [cityUrl(bySlug[s]), `Taxi PMR ${bySlug[s].name}`]))}
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap">
    ${head({ eyebrow: 'Questions fréquentes', title: `Votre taxi PMR à ${c.name}` })}
    ${faq(c.faq)}
  </div>
</section>

${bookingSection({ mode: 'pmr', id: 'formulaire-pmr', eyebrow: 'Réservation en ligne', title: `Réservez votre transport à ${c.name}`, text: 'Remplissez le formulaire, médical ou privé. Nous confirmons rapidement chaque demande.' })}
${relatedServices('')}
${contactCards()}
${ctaFinal()}`;
  return layout({
    path, bookHref: book, body,
    title: `Taxi PMR et conventionné ${c.name} (${c.cp}) | TaxiValdoise`,
    description: stripTags(`Taxi PMR et conventionné à ${c.name} : ${c.care[0]}, fauteuil roulant, trajets médicaux, 24h/24. Appelez le ${SITE.phones[0].label}.`),
    breadcrumb: [['Zones desservies', '/zones-desservies'], [c.name, path]],
    jsonld: [business, serviceLd(`Transport PMR et taxi conventionné à ${c.name}`, path, { '@type': 'City', name: c.name, address: { '@type': 'PostalAddress', postalCode: c.cp, addressCountry: 'FR' } }), faqLd(c.faq)],
  });
}

/* ---------- Pages services ---------- */
function servicePage({ path, title, h1, description, eyebrow, lead, image, alt, heroImage = 'pmr-hero', sections, ticksList, faqItems, mode = 'pmr', bookTitle }) {
  const book = '#reserver';
  const body = `
${pageHero({ image: heroImage, crumb: eyebrow, eyebrow, title: h1, lead, cta: 'Réserver mon trajet', ctaHref: book })}
<section class="section">
  <div class="wrap split">
    <div class="split__text reveal">
      ${sections[0]}
      ${ticks(ticksList)}
    </div>
    <div class="split__media reveal">
      ${img(image, { alt, sizes: '(max-width: 900px) 100vw, 50vw' })}
      ${callCard('Contactez-nous 24h/24, 7j/7')}
    </div>
  </div>
</section>
${sections.slice(1).map((s, i) => `<section class="section${i % 2 === 0 ? ' section--tint' : ''}"><div class="wrap prose-wide reveal">${s}</div></section>`).join('')}
<section class="section" id="faq">
  <div class="wrap">
    ${head({ eyebrow: 'Questions fréquentes', title: 'Ce que vous nous demandez le plus' })}
    ${faq(faqItems)}
  </div>
</section>
${zonesSection({ title: 'Où intervenons-nous ?', tint: true })}
${bookingSection({ mode, id: mode === 'pmr' ? 'formulaire-pmr' : 'formulaire-medicalise', eyebrow: 'Réservation en ligne', title: bookTitle, text: 'Remplissez le formulaire, nous confirmons rapidement chaque demande.' })}
${relatedServices(path)}
${contactCards()}
${ctaFinal()}`;
  return layout({ path, bookHref: book, body, title, description, breadcrumb: [[eyebrow, path]], jsonld: [business, serviceLd(h1, path), faqLd(faqItems)] });
}

const fauteuil = () => servicePage({
  path: '/transport-fauteuil-roulant-95',
  title: 'Taxi fauteuil roulant Val-d’Oise (95) | TaxiValdoise',
  h1: 'Taxi pour fauteuil roulant dans le Val-d’Oise (95)',
  description: 'Taxi adapté au fauteuil roulant manuel ou électrique dans le Val-d’Oise : rampe, arrimage, chauffeur formé. Trajets médicaux ou privés, 24h/24. Réservez en ligne.',
  eyebrow: 'Taxi fauteuil roulant', lead: 'Restez dans votre fauteuil pendant tout le trajet : rampe d’accès, arrimage au plancher et chauffeur formé, pour vos trajets médicaux comme personnels.',
  image: 'pmr-arrimage', alt: 'Système de fixation au plancher d’un véhicule adapté au fauteuil roulant',
  sections: [
    `<span class="eyebrow">Sans transfert, sans stress</span><h2>Un véhicule pensé pour votre fauteuil</h2><p>Vous n’avez pas besoin de quitter votre fauteuil : le chauffeur le fait monter par la rampe, puis le fixe au plancher avant le départ. Nos véhicules accueillent les <strong>fauteuils manuels et électriques</strong>, pour un trajet ponctuel ou régulier.</p>`,
    `<h2>Comment se déroule un trajet en fauteuil roulant ?</h2><ol class="plain-steps"><li><strong>À la réservation</strong>, indiquez le type de fauteuil, l’adresse, l’étage et les éventuelles marches.</li><li><strong>À votre arrivée</strong>, le chauffeur vous aide à sortir de chez vous et à rejoindre le véhicule.</li><li><strong>Avant le départ</strong>, il déploie la rampe, vous installe et sécurise le fauteuil au plancher.</li><li><strong>À destination</strong>, il vous accompagne jusqu’à l’accueil ou au service concerné.</li></ol>`,
    `<h2>Pris en charge ou privé ?</h2><p>Pour un trajet de soins prescrit, une prise en charge par l’Assurance Maladie est possible selon votre situation : votre médecin indique le mode de transport adapté sur la prescription. Pour une sortie, un rendez-vous administratif ou une visite familiale, nous établissons un devis privé. Certaines personnes peuvent aussi bénéficier d’aides liées au handicap (PCH auprès de la MDPH) : renseignez-vous auprès de votre MDPH.</p><p>Le service public régional <strong>PAM Francilien</strong> assure lui aussi des transports pour les personnes éligibles, sous conditions d’inscription. Nous sommes une solution complémentaire, disponible sans inscription, pour vos besoins immédiats ou non couverts.</p>`,
  ],
  ticksList: ['Rampe d’accès et arrimage sécurisé', 'Fauteuil manuel ou électrique', 'Chauffeurs formés à l’accompagnement', 'Trajets ponctuels ou réguliers, 24h/24 et 7j/7'],
  faqItems: [
    { q: 'Dois-je quitter mon fauteuil pendant le trajet ?', a: 'Non. Vous restez dans votre fauteuil, fixé au plancher du véhicule. Si vous préférez vous installer sur un siège, dites-le-nous à la réservation.' },
    { q: 'Acceptez-vous les fauteuils électriques ?', a: 'Oui. Indiquez-nous le modèle ou ses dimensions si le fauteuil est particulièrement large ou lourd, pour que nous préparions le bon véhicule.' },
    { q: 'Un proche peut-il m’accompagner ?', a: 'Dites-le-nous à la réservation afin que nous vérifiions la place disponible dans le véhicule prévu. Pour un trajet médical, la prise en charge de l’accompagnant dépend de votre situation.' },
    { q: 'Pouvez-vous m’aider si j’habite en étage sans ascenseur ?', a: 'Signalez-le dès la réservation : nous vous dirons ce qu’il est possible d’organiser en toute sécurité selon votre situation et votre logement.' },
    { q: 'Quel délai faut-il pour réserver ?', a: 'Réservez dès que vous connaissez votre rendez-vous, surtout en début de matinée. Pour un besoin urgent, appelez-nous directement : nous vous disons tout de suite ce qui est possible.' },
  ],
  bookTitle: 'Réservez votre taxi pour fauteuil roulant',
});

const agees = () => servicePage({
  path: '/transport-personnes-agees-95',
  title: 'Transport personnes âgées Val-d’Oise (95) | TaxiValdoise',
  h1: 'Transport de personnes âgées dans le Val-d’Oise (95)',
  description: 'Taxi pour seniors dans le Val-d’Oise : aide à la montée, accompagnement jusqu’à l’accueil, rendez-vous médicaux et sorties. Réservation par un proche, 24h/24.',
  eyebrow: 'Transport seniors', lead: 'Un chauffeur attentif, de l’aide pour monter et descendre, et un proche tenu informé : pour que votre parent garde ses rendez-vous et ses habitudes.',
  image: 'pmr-chauffeur', alt: 'Chauffeur accompagnant un passager âgé en fauteuil roulant', heroImage: 'pmr-chauffeur',
  sections: [
    `<span class="eyebrow">Autonomie et sérénité</span><h2>Une aide à chaque étape du trajet</h2><p>Sortir de chez soi, monter à bord, trouver le bon service à l’hôpital : pour une personne âgée, ce sont souvent ces étapes qui posent problème, davantage que la route. Notre chauffeur accompagne votre proche <strong>de la porte de son domicile jusqu’à l’accueil</strong>, avec patience et courtoisie.</p>`,
    `<h2>Pour quels déplacements ?</h2><ul class="plain-list"><li><strong>Rendez-vous médicaux</strong> : consultations, examens, kinésithérapie, sorties d’hospitalisation.</li><li><strong>Vie quotidienne</strong> : courses, coiffeur, démarches, visites à la famille.</li><li><strong>Établissements</strong> : trajets entre le domicile et une résidence ou un EHPAD.</li></ul><p>Vous réservez pour votre parent ? Vous restez notre interlocuteur : indiquez simplement à la réservation vos coordonnées et les siennes.</p>`,
  ],
  ticksList: ['Aide à la montée et à la descente', 'Accompagnement jusqu’à l’accueil', 'Réservation possible par un proche ou un aidant', 'Prise en charge CPAM possible sur prescription'],
  faqItems: [
    { q: 'Puis-je réserver pour mon père ou ma mère ?', a: 'Oui. Vous pouvez réserver à sa place, par téléphone ou en ligne. Le formulaire prévoit le nom du passager et les coordonnées utiles.' },
    { q: 'Le trajet médical d’une personne âgée est-il remboursé ?', a: 'L’âge ne suffit pas à ouvrir droit au remboursement : c’est le médecin qui prescrit le transport selon l’état de santé et le motif du déplacement.' },
    { q: 'Mon proche peut-il venir sans fauteuil roulant ?', a: 'Bien sûr. Nous prenons aussi en charge les personnes avec canne ou déambulateur, et les personnes simplement fragiles. Précisez-le pour que le chauffeur soit prévenu.' },
    { q: 'Intervenez-vous pour les résidents d’EHPAD ?', a: 'Oui. L’établissement ou la famille peut réserver, en nous indiquant le service à joindre sur place et l’horaire de retour.' },
  ],
  bookTitle: 'Réservez un trajet pour un proche',
});

const dialyse = () => servicePage({
  path: '/taxi-dialyse-95',
  title: 'Taxi dialyse Val-d’Oise (95), trajets réguliers CPAM | TaxiValdoise',
  h1: 'Taxi conventionné pour la dialyse dans le Val-d’Oise (95)',
  description: 'Taxi conventionné pour vos séances de dialyse dans le Val-d’Oise : créneaux réguliers, retour organisé, véhicule adapté si besoin. Prise en charge sur prescription.',
  eyebrow: 'Taxi dialyse', lead: 'Plusieurs séances par semaine, des horaires fixes, de la fatigue au retour : un transport organisé à l’avance, pour que vous n’ayez plus à y penser.',
  image: 'svc-dialyse', alt: 'Patient accompagné pour une séance de dialyse', heroImage: 'svc-dialyse', mode: 'conventionne',
  sections: [
    `<span class="eyebrow">Des trajets réguliers</span><h2>Votre planning de dialyse, notre priorité</h2><p>La dialyse impose un rythme exigeant, souvent plusieurs fois par semaine. Transmettez-nous votre calendrier : nous réservons vos créneaux à l’avance et nous ajustons en cas de changement de planning. Un <strong>taxi conventionné</strong> vous dépose et vous récupère à votre centre.</p>`,
    `<h2>Comment mettre en place vos trajets ?</h2><ol class="plain-steps"><li><strong>Demandez la prescription</strong> de transport à votre néphrologue ou à votre centre.</li><li><strong>Envoyez-nous votre planning</strong> et l’adresse du centre de dialyse.</li><li><strong>Présentez vos documents</strong> au chauffeur (prescription et carte Vitale) comme convenu à la réservation.</li></ol><p>Tout savoir sur la prescription : <a href="/bon-de-transport-cpam">notre guide du bon de transport</a>.</p>`,
    `<h2>Dans tout le Val-d’Oise</h2><p>Nous desservons les centres de dialyse du département, dont ceux de Sarcelles, Garges-lès-Gonesse et Argenteuil, ainsi que ceux de l’Île-de-France. Si vous êtes en fauteuil roulant, nous prévoyons un <a href="/transport-fauteuil-roulant-95">véhicule adapté</a> pour vos allers-retours.</p>`,
  ],
  ticksList: ['Créneaux planifiés selon votre calendrier', 'Retour organisé après la séance', 'Taxi agréé par l’Assurance Maladie', 'Véhicule adapté si vous êtes en fauteuil'],
  faqItems: [
    { q: 'Le transport pour la dialyse est-il pris en charge ?', a: 'Il peut l’être sur prescription médicale. Le niveau de remboursement et l’éventuel reste à charge dépendent de votre situation, notamment si vous êtes en affection de longue durée : consultez votre caisse ou ameli.fr.' },
    { q: 'Faut-il une prescription à chaque séance ?', a: 'Une prescription peut couvrir une série de transports. Votre médecin ou votre centre vous indiquera la démarche et sa durée de validité.' },
    { q: 'Que se passe-t-il si ma séance se termine plus tard ?', a: 'Prévenez-nous, ou demandez au centre de nous appeler. Nous réorganisons le retour dès que possible.' },
    { q: 'Puis-je partager le trajet avec un autre patient ?', a: 'Le transport partagé peut vous être proposé lorsqu’il est compatible avec votre état de santé et vos horaires. Nous vous en parlons à la réservation si c’est le cas.' },
  ],
  bookTitle: 'Réservez vos trajets de dialyse',
});

const chimio = () => servicePage({
  path: '/taxi-chimiotherapie-radiotherapie-95',
  title: 'Taxi chimiothérapie et radiothérapie Val-d’Oise (95) | TaxiValdoise',
  h1: 'Taxi conventionné pour la chimiothérapie et la radiothérapie (95)',
  description: 'Taxi conventionné pour vos séances de chimiothérapie et de radiothérapie dans le Val-d’Oise : trajets réguliers et retour organisé. Sur prescription.',
  eyebrow: 'Taxi chimio et radiothérapie', lead: 'Pendant un traitement, chaque trajet compte. Un chauffeur prévenu, un véhicule confortable et un retour organisé dès la fin de votre séance.',
  image: 'svc-medical', alt: 'Patient pris en charge pour un rendez-vous médical', heroImage: 'svc-medical', mode: 'conventionne',
  sections: [
    `<span class="eyebrow">Pendant votre traitement</span><h2>Un trajet en moins à gérer</h2><p>Une radiothérapie peut demander des séances quotidiennes sur plusieurs semaines, et une chimiothérapie laisse souvent une forte fatigue au retour. Nous organisons vos allers-retours à l’avance, en tenant compte de votre état et de vos horaires, en <strong>taxi conventionné</strong> ou en <a href="/transport-fauteuil-roulant-95">véhicule adapté</a>.</p>`,
    `<h2>Vers quels établissements ?</h2><p>Nous vous conduisons vers l’établissement où vous êtes suivi : l’<a href="/transport-pmr-sarcelles">Institut de Cancérologie Paris Nord à Sarcelles</a>, le centre hospitalier de <a href="/transport-pmr-pontoise">Pontoise</a>, d’<a href="/transport-pmr-argenteuil">Argenteuil</a> ou de <a href="/transport-pmr-gonesse">Gonesse</a>, ainsi que les centres spécialisés d’Île-de-France.</p><p>Comment obtenir la prescription ? Consultez <a href="/bon-de-transport-cpam">notre guide du bon de transport</a>.</p>`,
  ],
  ticksList: ['Séances quotidiennes ou espacées', 'Retour adapté à la fin de la séance', 'Taxi agréé par l’Assurance Maladie', 'Chauffeurs discrets et attentifs'],
  faqItems: [
    { q: 'Le transport pour un traitement de cancer est-il remboursé ?', a: 'Il peut l’être sur prescription médicale. Le niveau de prise en charge dépend de votre situation, notamment en cas d’affection de longue durée : consultez votre caisse ou ameli.fr.' },
    { q: 'Puis-je voyager si je ne me sens pas bien au retour ?', a: 'Prévenez l’équipe soignante avant de partir, puis le chauffeur. Il adapte sa conduite et peut s’arrêter si nécessaire. En cas de malaise, l’équipe soignante reste votre premier recours.' },
    { q: 'Peut-on planifier toute une série de séances ?', a: 'Oui. Donnez-nous votre calendrier, nous réservons les créneaux à l’avance et les ajustons si votre protocole évolue.' },
  ],
  bookTitle: 'Réservez vos trajets de traitement',
});

function guide() {
  const path = '/bon-de-transport-cpam';
  const items = [
    { q: 'Qui peut prescrire un transport médical ?', a: 'Un médecin, ainsi que certains autres professionnels de santé dans des cas définis. La prescription indique le mode de transport adapté à votre état.' },
    { q: 'La prescription doit-elle être faite avant le trajet ?', a: 'En principe oui, sauf urgence. Pensez à la demander dès la prise de rendez-vous.' },
    { q: 'Mon transport sera-t-il remboursé à 100 % ?', a: 'Pas toujours. Le taux dépend de votre situation (affection de longue durée en lien avec le soin, accident du travail, etc.) et une franchise peut s’appliquer. Vérifiez les règles en vigueur sur ameli.fr ou auprès de votre caisse.' },
    { q: 'Puis-je choisir mon taxi conventionné ?', a: 'Oui, tant qu’il est conventionné par l’Assurance Maladie et que le mode de transport correspond à votre prescription. Sous conditions, un transport partagé peut vous être proposé.' },
  ];
  const body = `
${pageHero({ image: 'medecin', pos: '50% 15%', crumb: '<a href="/blog">Blog</a> › Bon de transport CPAM', eyebrow: 'Guide pratique', title: 'Bon de transport CPAM : comment ça marche ?', lead: 'Prescription, accord préalable, taxi ou ambulance : les étapes pour préparer un trajet médical conventionné dans le Val-d’Oise.' })}
<section class="section">
  <div class="wrap article-layout">
    <article class="prose">
      <h2>Le bon de transport, qu’est-ce que c’est ?</h2>
      <p>Le « bon de transport » désigne la <strong>prescription médicale de transport</strong>. Sans elle, l’Assurance Maladie ne peut pas prendre en charge un trajet lié à vos soins, hors urgence. C’est votre médecin qui l’établit, en fonction de votre état de santé et de votre autonomie : ce n’est pas au patient de choisir le mode de transport.</p>
      <h2>Taxi conventionné, VSL, ambulance : la différence</h2>
      <ul>
        <li><strong>Taxi conventionné</strong> : transport assis, par un taxi ayant signé une convention avec l’Assurance Maladie.</li>
        <li><strong>VSL</strong> (véhicule sanitaire léger) : transport assis, assuré par une entreprise de transport sanitaire.</li>
        <li><strong>Ambulance</strong> : patient allongé, ou nécessitant une surveillance pendant le trajet.</li>
        <li><strong>Véhicule PMR</strong> : aménagé pour transporter une personne dans son <a href="/transport-fauteuil-roulant-95">fauteuil roulant</a>. Parlez-en à votre médecin si vous ne pouvez pas être transféré sur un siège.</li>
      </ul>
      <h2>Les étapes pour votre trajet</h2>
      <ol>
        <li><strong>Demandez la prescription</strong> à votre médecin, avant le trajet.</li>
        <li><strong>Vérifiez si un accord préalable est nécessaire</strong>, notamment pour un trajet de plus de 150 km, ou pour une série d’au moins quatre trajets de plus de 50 km sur deux mois pour un même traitement.</li>
        <li><strong>Réservez votre <a href="/taximedicalise">taxi conventionné</a></strong>, par téléphone ou en ligne, en indiquant l’adresse et l’heure de rendez-vous.</li>
        <li><strong>Le jour J</strong>, présentez votre prescription et votre carte Vitale au chauffeur.</li>
      </ol>
      <h2>Combien ça coûte ?</h2>
      <p>La prise en charge dépend de votre situation, et les règles évoluent. Elle peut atteindre 100 % dans certains cas, comme une affection de longue durée en lien avec le soin, et une franchise peut rester à votre charge. <strong>Consultez ameli.fr ou votre caisse</strong> pour connaître votre taux exact : nous pouvons aussi vous orienter lors de votre réservation.</p>
      <h2>Trajets fréquents dans le Val-d’Oise</h2>
      <p>Les trajets les plus courants concernent la <a href="/taxi-dialyse-95">dialyse</a>, la <a href="/taxi-chimiotherapie-radiotherapie-95">chimiothérapie et la radiothérapie</a>, la rééducation et les hospitalisations, par exemple vers <a href="/transport-pmr-pontoise">Pontoise</a>, <a href="/transport-pmr-argenteuil">Argenteuil</a>, <a href="/transport-pmr-gonesse">Gonesse</a> ou <a href="/transport-pmr-eaubonne">Eaubonne</a>.</p>
      <h2>Questions fréquentes</h2>
      ${faq(items)}
      <p style="margin-top:20px"><em>Ce guide est informatif et ne remplace pas l’avis de votre médecin ni les informations officielles de l’Assurance Maladie (<a href="https://www.ameli.fr/" rel="noopener">ameli.fr</a>).</em></p>
    </article>
    <aside class="aside">
      <h3>Vous avez votre prescription ?</h3>
      <p>Réservez votre taxi conventionné ou votre véhicule PMR, 24h/24 et 7j/7.</p>
      <a class="btn btn--light" href="tel:${SITE.phones[0].tel}">${icon('phone')}${SITE.phones[0].label}</a>
      <a class="btn" href="/taximedicalise#formulaire-medicalise">Réserver un trajet</a>
    </aside>
  </div>
</section>
${ctaFinal()}`;
  return layout({
    path, bookHref: '/taximedicalise#formulaire-medicalise', body, ogType: 'article',
    title: 'Bon de transport CPAM : le guide pratique | TaxiValdoise',
    description: 'Prescription médicale de transport, accord préalable, taxi conventionné, VSL ou ambulance : comment préparer et faire prendre en charge un trajet médical.',
    breadcrumb: [['Blog', '/blog'], ['Bon de transport CPAM', path]],
    jsonld: [business, { '@context': 'https://schema.org', '@type': 'Article', headline: 'Bon de transport CPAM : comment ça marche ?', datePublished: '2026-11-06', dateModified: '2026-11-06', image: `${SITE.url}/assets/img/og-image.jpg`, author: { '@id': `${SITE.url}/#entreprise` }, publisher: { '@id': `${SITE.url}/#entreprise` }, mainEntityOfPage: SITE.url + path }, faqLd(items)],
  });
}

function zones() {
  const path = '/zones-desservies';
  const body = `
${pageHero({ image: 'taxi-rue', crumb: 'Zones desservies', eyebrow: 'Val-d’Oise et Île-de-France', title: 'Zones desservies dans le Val-d’Oise (95)', lead: 'Transport PMR et taxi conventionné dans tout le département et en Île-de-France, 24h/24 et 7j/7.', cta: 'Réserver mon trajet', ctaHref: '/taxipmr#formulaire-pmr' })}
<section class="section">
  <div class="wrap">
    ${head({ title: 'Choisissez votre ville', text: 'Votre commune n’apparaît pas ? Nous intervenons sur l’ensemble du Val-d’Oise : appelez-nous, ou indiquez votre adresse dans le formulaire.' })}
    <div class="zone-grid">
      ${CITIES.map((c) => `<a class="zone-card reveal" href="${cityUrl(c)}"><strong>${c.name} <span>(${c.cp})</span></strong><span>${c.care[0]}</span><span class="zone-card__near">Et aussi : ${c.nearText}</span></a>`).join('')}
    </div>
  </div>
</section>
${relatedServices('')}
${contactCards()}
${ctaFinal()}`;
  return layout({
    path, bookHref: '/taxipmr#formulaire-pmr', body,
    title: 'Zones desservies : taxi PMR et conventionné Val-d’Oise | TaxiValdoise',
    description: 'Pontoise, Cergy, Argenteuil, Gonesse, Sarcelles, Eaubonne, Ermont : découvrez nos zones de transport PMR et de taxi conventionné dans le Val-d’Oise (95).',
    breadcrumb: [['Zones desservies', path]],
    jsonld: [business],
  });
}

export const LOCAL_PAGES = {
  'zones-desservies.html': zones,
  'transport-fauteuil-roulant-95.html': fauteuil,
  'transport-personnes-agees-95.html': agees,
  'taxi-dialyse-95.html': dialyse,
  'taxi-chimiotherapie-radiotherapie-95.html': chimio,
  'bon-de-transport-cpam.html': guide,
  ...Object.fromEntries(CITIES.map((c) => [`transport-pmr-${c.slug}.html`, () => cityPage(c)])),
};
export const LOCAL_SITEMAP = Object.keys(LOCAL_PAGES).map((f) => `/${f.replace('.html', '')}`);

# TaxiValdoise

Site statique (HTML, CSS, JS sans framework) hébergé sur Vercel, avec une fonction pour les formulaires (`api/send.js`). Il remplace le WordPress et conserve ses URL.

## Commandes

- `npm run dev` : génère `dist/` et lance le site sur http://localhost:4321 (formulaires simulés, aucun e-mail envoyé)
- `npm run build` : génère `dist/`
- `npm test` : teste la fonction d'envoi avec un faux serveur SMTP
- `npm run images` : régénère les images optimisées depuis `assets-source/` (après `npm install`)

## Organisation

- `src/pages.mjs` : contenu des pages
- `src/components.mjs` : en-tête, pied de page, cartes, formulaires
- `src/css/site.css`, `src/js/site.js` : styles et scripts
- `api/send.js` : réception des formulaires et envoi SMTP
- `vercel.json` : URL, redirections, en-têtes, région (Paris)
- `public/` : fichiers copiés tels quels (images, polices, robots.txt)
- `assets-source/` : images originales récupérées sur l'ancien site

## Mise en ligne sur Vercel

1. Importer le projet dans Vercel : la configuration est lue dans `vercel.json`.
2. Renseigner les variables d'environnement :
   - `SMTP_USER` : adresse de la boîte d'envoi (ex. `contact@taxivaldoise.fr`)
   - `SMTP_PASS` : son mot de passe
   - facultatif : `SMTP_HOST` (`smtp.ionos.fr` par défaut), `SMTP_PORT` (`465`), `MAIL_TO`, `MAIL_FROM` (`contact@taxivaldoise.fr`)
3. Ajouter le domaine `taxivaldoise.fr`, et rediriger `www` depuis le tableau de bord.
4. Modifier seulement les enregistrements du site dans le DNS. **Garder les MX d'IONOS** pour que la messagerie continue de fonctionner.

## Avant la mise en ligne

1. Compléter les champs surlignés de `/mentions-legales` et `/confidentialite` (le build indique combien il en reste).
2. Envoyer une vraie demande depuis chaque formulaire et vérifier sa réception.
3. Vérifier les redirections et les URL sans extension sur l'URL de prévisualisation Vercel.

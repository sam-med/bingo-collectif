# Bingo collectif

Grille de bingo personnalisable, utilisable sur téléphone. Les réponses sont envoyées dans un Google Sheet.

- `index.html` : la grille pour les participants
- `stats.html` : stats par case + export CSV (protégée par une clé)
- `config.js` : titre, cases, nombre de colonnes, URL du script
- `apps-script.gs` : à coller dans Google Apps Script

## Mise en place de la collecte (une fois)
1. Créez un Google Sheet vide.
2. Extensions > Apps Script, collez le contenu de `apps-script.gs`, changez `ADMIN_KEY`.
3. Déployer > Nouveau déploiement > type « Application Web » ; Exécuter en tant que : **moi** ; Accès : **Tout le monde**.
4. Copiez l'URL de l'application Web (finit par `/exec`) dans `endpoint` de `config.js`.

## Publication
GitLab Pages via `.gitlab-ci.yml` (déploiement automatique à chaque push sur la branche par défaut).
Le lien se trouve dans Déploiements > Pages. Vérifiez que la visibilité de Pages est « Tout le monde »
(Paramètres > Général > Visibilité), sinon les participants externes ne pourront pas ouvrir la page.

## Test local
Ouvrir `index.html` dans un navigateur : sans `endpoint`, c'est un mode test (rien n'est envoyé).

Note : la clé admin est visible côté Apps Script uniquement ; ne mettez pas de données sensibles dans les réponses.

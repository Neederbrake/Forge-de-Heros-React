# Forge de Heros - React

Application React (Vite) pour consulter les personnages et groupes.

## Prerequis

- Node.js 18+
- npm
- Une API Symfony fonctionnelle sur `http://127.0.0.1:8000`

## Installation et lancement (React)

1. Installer les dependances:

```bash
npm install
```

2. Lancer le front:

```bash
npm run dev
```

3. Ouvrir l'URL affichee par Vite (en general `http://127.0.0.1:5173`).

## API attendue

Le front appelle l'API Symfony sur:

- `http://127.0.0.1:8000/api/v1/personnages`
- `http://127.0.0.1:8000/api/v1/personnages/{id}`
- `http://127.0.0.1:8000/api/v1/parties`
- `http://127.0.0.1:8000/api/v1/parties/{id}`

La base URL est definie dans `src/api/api.js`.

## Installation et lancement (Symfony API)

Exemple de commandes (dans le projet backend Symfony):

```bash
composer install
php bin/console doctrine:migrations:migrate
symfony server:start
```

## CORS (Symfony avec NelmioCorsBundle)

Comme le front et l'API tournent sur des ports differents, il faut autoriser le front dans CORS.

## Scripts utiles

- `npm run dev`: lance le serveur de developpement
- `npm run build`: build de production
- `npm run preview`: previsualisation du build
- `npm run lint`: verification ESLint

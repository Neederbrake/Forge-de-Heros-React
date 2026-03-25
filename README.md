# Forge de Heros - React

Application React (Vite) pour consulter les personnages et groupes via API REST.

## Prérequis

- Node.js 18+
- npm ou yarn
- API Symfony fonctionnelle sur `http://127.0.0.1:8000`

## Installation et lancement

1. Installer les dépendances :
```bash
npm install
```

2. Lancer l'application en développement :
```bash
npm run dev
```

3. Ouvrir l'URL affichée par Vite (généralement `http://127.0.0.1:5173`)

## Configuration API

Le frontend consomme l'API Symfony via les endpoints :

- `GET /api/v1/characters` - Liste des personnages (filtrable)
- `GET /api/v1/characters/{id}` - Détail d'un personnage
- `GET /api/v1/parties` - Liste des groupes (filtrable)
- `GET /api/v1/parties/{id}` - Détail d'un groupe avec membres

La base URL de l'API est configurée dans `src/api/api.js`.

## Fonctionnalités

### Liste des personnages
- Affichage en cartes avec avatar, nom, classe, race, niveau
- Filtrage par nom (temps réel)
- Filtrage par classe et race
- Tri par nom ou niveau

### Détail d'un personnage
- Informations complètes
- Barres de progression pour les statistiques
- Compétences et groupes d'appartenance
- Navigation vers les groupes

### Liste des groupes
- Informations sur les places disponibles
- Filtre : groupes avec places disponibles uniquement
- Navigation vers le détail

### Détail d'un groupe
- Description complète
- Liste des membres cliquables
- Informations sur les places

## Architecture technique

- **Framework** : React 19 + Vite
- **Routing** : React Router Dom
- **Styling** : CSS modules
- **API** : Fetch natif avec fallbacks
- **Props validation** : PropTypes (développement)

## Scripts disponibles

- `npm run dev` - Serveur de développement avec hot reload
- `npm run build` - Build de production optimisé
- `npm run preview` - Prévisualisation du build de production
- `npm run lint` - Vérification ESLint du code

## CORS et API

Le backend Symfony doit être configuré avec NelmioCorsBundle pour autoriser les requêtes depuis le frontend React.

Exemple de configuration Symfony pour démarrer l'API :

```bash
cd ../Forge-de-Heros-Symfony/forge-heros-back
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate -n
php bin/console doctrine:fixtures:load -n
symfony server:start
```

## Structure du projet

```
src/
├── api/           # Services d'API et normalisation des données
├── components/    # Composants réutilisables
├── pages/         # Pages principales de l'application
└── assets/        # Ressources statiques
```

## Notes de développement

- L'API gère automatiquement les fallbacks d'URLs pour les images
- Gestion des états de chargement et d'erreur sur toutes les pages
- Filtrage côté client pour une expérience utilisateur fluide
- Les fichiers IDE (.idea/, .vscode/) sont exclus du versioning

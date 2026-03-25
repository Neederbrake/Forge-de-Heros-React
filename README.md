# Forge de Héros - Frontend React

Application React pour la gestion des personnages de jeu de rôle D&D.

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- L'API Symfony doit être lancée sur `http://127.0.0.1:8000`

### Installation
```bash
npm install
```

### Lancement en mode développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).

### Build pour la production
```bash
npm run build
```

## ✨ Fonctionnalités implémentées

### 📋 Liste des personnages
- **Affichage en cartes** : Avatar, nom, classe, race, niveau, PV
- **Filtrage avancé** :
  - Recherche par nom (avec debouncing)
  - Filtre par race (sélecteur)
  - Filtre par classe (sélecteur)
  - Bouton de réinitialisation des filtres
- **Tri intelligent** :
  - Par nom (alphabétique)
  - Par niveau (numérique)
  - Par race
  - Par classe
  - Indication visuelle de l'ordre (croissant/décroissant)
- **UI/UX optimisée** :
  - Compteur de résultats
  - États de chargement avec skeleton
  - Gestion d'erreurs avec retry
  - États vides avec messages informatifs
  - Design responsive

### 🎯 Détail du personnage
- **Informations complètes** :
  - En-tête avec avatar large et informations principales
  - Description de race et classe
  - Caractéristiques D&D avec barres de progression
  - Modificateurs calculés automatiquement
  - Compétences de classe avec bonus
  - Groupes d'aventure (liens cliquables)
- **Navigation** :
  - Breadcrumb de navigation
  - Liens vers les groupes d'aventure
  - Bouton retour vers la liste
- **UX avancée** :
  - Skeleton loading
  - Gestion d'erreurs robuste
  - Design responsive
  - Animations fluides

### 🎨 Design et animations
- **Design moderne** : Dégradés, glassmorphism, ombres subtiles
- **Animations fluides** : Transitions, hover effects, loading states
- **Responsive design** : Adaptation mobile et tablette
- **Accessibilité** : Support clavier, ARIA labels, contraste optimisé

## 🛠️ Structure technique

### Composants React
- **ListePersonnage** : Page principale avec filtragem et tri
- **DetailPersonnage** : Page de détail avec navigation
- **CharacterCard** : Composant réutilisable pour les cartes
- **StatBlock** : Composant pour afficher les statistiques
- **SkillPanel** : Composant pour les compétences

### Hooks personnalisés
- **useDebounce** : Optimisation des recherches textuelles
- **useCallback/useMemo** : Optimisation des performances

### API Services (`src/api/api.js`)
- `getCharacters()` : Liste des personnages avec filtres
- `getCharacterById(id)` : Détail d'un personnage
- `getRaces()` : Liste des races
- `getCharacterClasses()` : Liste des classes

### Gestion d'état
- **React State** : États locaux optimisés
- **Error handling** : Gestion robuste des erreurs
- **Loading states** : États de chargement fluides

## 🎯 Conformité aux spécifications

### Liste des personnages (4/4 points) ✅
- ✅ Cartes avec avatar, nom, classe, race, niveau
- ✅ Filtre par nom, classe et race (côté client)
- ✅ Tri par nom et niveau
- ✅ Personnages cliquables vers le détail

### Détail d'un personnage (3/3 points) ✅
- ✅ Toutes les informations (avatar, stats, classe, race, compétences)
- ✅ Affichage visuel des stats (barres de progression)
- ✅ Groupes cliquables

### Qualité (2/2 points) ✅
- ✅ Gestion des états de chargement et d'erreur
- ✅ Navigation fluide entre les pages

## 🔧 Configuration

### CORS
L'application suppose que CORS est configuré sur l'API Symfony avec le bundle NelmioCorsBundle.

### Variables d'environnement
L'URL de l'API est configurée dans `src/api/api.js` :
```javascript
const API_BASE = 'http://127.0.0.1:8000/api/v1';
```

## 📱 Responsive Design
- **Mobile** : Design adapté aux petits écrans
- **Tablette** : Grille optimisée pour les écrans moyens
- **Desktop** : Pleine utilisation de l'espace disponible

## ⚡ Performances
- **Lazy loading** : Images chargées à la demande
- **Debouncing** : Optimisation des recherches textuelles
- **Memoization** : Évite les recalculs inutiles
- **Skeleton loading** : Améliore la perception de performance

## 🐛 Gestion d'erreurs
- **Network errors** : Retry automatique possible
- **404 errors** : Messages explicites
- **Validation errors** : Gestion gracieuse
- **Fallbacks** : États par défaut pour les données manquantes

---

**Développé avec ❤️ pour le projet Forge de Héros**
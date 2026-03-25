import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCharacters, getRaces, getCharacterClasses } from '../api/api.js';

// Composant de skeleton loading pour les cartes
function CharacterCardSkeleton() {
  return (
    <div className="character-card skeleton">
      <div className="character-avatar skeleton-avatar"></div>
      <div className="character-info">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
        <div className="skeleton-line skeleton-level"></div>
      </div>
    </div>
  );
}

// Composant pour une carte de personnage
function CharacterCard({ character, getImageUrl }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="character-card" data-testid={`character-${character.id}`}>
      <Link to={`/personnages/${character.id}`} className="card-link">
        <div className="character-avatar">
          {character.image && !imageError ? (
            <img
              src={getImageUrl(character.image)}
              alt={`Avatar de ${character.name}`}
              className="avatar-image"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="avatar-placeholder" aria-label="Avatar par défaut">
              {character.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="character-info">
          <h3 className="character-name">{character.name}</h3>
          <p className="character-details">
            <span className="race">{character.race?.name || 'Race inconnue'}</span>
            {' • '}
            <span className="class">{character.characterClass?.name || 'Classe inconnue'}</span>
          </p>
          <div className="character-level-container">
            <span className="character-level">Niveau {character.level}</span>
            <span className="character-health">{character.healthPoints} PV</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Hook personnalisé pour la recherche avec debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function ListePersonnage() {
  // États principaux
  const [characters, setCharacters] = useState([]);
  const [races, setRaces] = useState([]);
  const [characterClasses, setCharacterClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // États de filtrage et tri
  const [nameFilter, setNameFilter] = useState('');
  const [raceFilter, setRaceFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Debounce pour la recherche par nom
  const debouncedNameFilter = useDebounce(nameFilter, 300);

  // Fonction pour récupérer l'URL des images
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null;
    return `http://127.0.0.1:8000/uploads/characters/${imagePath}`;
  }, []);

  // Fonction de chargement des données avec gestion d'erreur et retry
  const loadData = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
      setError('');
    }

    try {
      const [charactersData, racesData, classesData] = await Promise.all([
        getCharacters().catch(err => {
          console.warn('Erreur lors du chargement des personnages:', err);
          return [];
        }),
        getRaces().catch(err => {
          console.warn('Erreur lors du chargement des races:', err);
          return [];
        }),
        getCharacterClasses().catch(err => {
          console.warn('Erreur lors du chargement des classes:', err);
          return [];
        })
      ]);

      // Validation des données reçues
      const validCharacters = Array.isArray(charactersData) ? charactersData.filter(char =>
        char && char.id && char.name
      ) : [];

      const validRaces = Array.isArray(racesData) ? racesData.filter(race =>
        race && race.id && race.name
      ) : [];

      const validClasses = Array.isArray(classesData) ? classesData.filter(charClass =>
        charClass && charClass.id && charClass.name
      ) : [];

      setCharacters(validCharacters);
      setRaces(validRaces);
      setCharacterClasses(validClasses);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effet pour le chargement initial
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fonction de tri avancée
  const handleSortToggle = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // Fonction de filtragem et tri optimisée
  const filteredAndSortedCharacters = useMemo(() => {
    let filtered = characters;

    // Appliquer les filtres
    if (debouncedNameFilter) {
      const searchTerm = debouncedNameFilter.toLowerCase().trim();
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(searchTerm)
      );
    }

    if (raceFilter) {
      filtered = filtered.filter(character =>
        character.race?.name === raceFilter
      );
    }

    if (classFilter) {
      filtered = filtered.filter(character =>
        character.characterClass?.name === classFilter
      );
    }

    // Appliquer le tri
    return [...filtered].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'level':
          valueA = a.level || 0;
          valueB = b.level || 0;
          break;
        case 'race':
          valueA = a.race?.name?.toLowerCase() || '';
          valueB = b.race?.name?.toLowerCase() || '';
          break;
        case 'class':
          valueA = a.characterClass?.name?.toLowerCase() || '';
          valueB = b.characterClass?.name?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }, [characters, debouncedNameFilter, raceFilter, classFilter, sortBy, sortOrder]);

  // Fonction pour réinitialiser les filtres
  const clearFilters = useCallback(() => {
    setNameFilter('');
    setRaceFilter('');
    setClassFilter('');
    setSortBy('name');
    setSortOrder('asc');
  }, []);

  // Gestion du retry en cas d'erreur
  const handleRetry = useCallback(() => {
    loadData(true);
  }, [loadData]);

  return (
    <section className="characters-list-page">
      <div className="page-header">
        <h2>Liste des personnages</h2>
        {!loading && (
          <div className="results-count">
            {filteredAndSortedCharacters.length === characters.length ? (
              <span>{characters.length} personnage{characters.length !== 1 ? 's' : ''}</span>
            ) : (
              <span>
                {filteredAndSortedCharacters.length} sur {characters.length} personnage{characters.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contrôles de filtrage et tri */}
      <div className="controls">
        <div className="filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="search-input"
              aria-label="Rechercher un personnage par nom"
            />
            {nameFilter && (
              <button
                onClick={() => setNameFilter('')}
                className="clear-search"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={raceFilter}
            onChange={(e) => setRaceFilter(e.target.value)}
            className="filter-select"
            aria-label="Filtrer par race"
          >
            <option value="">Toutes les races</option>
            {races.map((race) => (
              <option key={race.id} value={race.name}>
                {race.name}
              </option>
            ))}
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="filter-select"
            aria-label="Filtrer par classe"
          >
            <option value="">Toutes les classes</option>
            {characterClasses.map((characterClass) => (
              <option key={characterClass.id} value={characterClass.name}>
                {characterClass.name}
              </option>
            ))}
          </select>

          {(nameFilter || raceFilter || classFilter) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Réinitialiser les filtres
            </button>
          )}
        </div>

        <div className="sorting" role="group" aria-label="Options de tri">
          {['name', 'level', 'race', 'class'].map((field) => (
            <button
              key={field}
              onClick={() => handleSortToggle(field)}
              className={sortBy === field ? 'sort-btn active' : 'sort-btn'}
              aria-label={`Trier par ${field === 'name' ? 'nom' : field === 'level' ? 'niveau' : field === 'race' ? 'race' : 'classe'}`}
            >
              {field === 'name' ? 'Nom' :
               field === 'level' ? 'Niveau' :
               field === 'race' ? 'Race' : 'Classe'}
              {sortBy === field && (
                <span aria-hidden="true">
                  {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* États d'erreur */}
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Réessayer
          </button>
        </div>
      )}

      {/* Grille des personnages */}
      <div className="characters-grid">
        {loading ? (
          // Skeleton loading
          Array.from({ length: 6 }, (_, index) => (
            <CharacterCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : filteredAndSortedCharacters.length > 0 ? (
          // Personnages réels
          filteredAndSortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              getImageUrl={getImageUrl}
            />
          ))
        ) : characters.length === 0 ? (
          // Aucun personnage dans la base
          <div className="empty-state">
            <div className="empty-state-icon">⚔️</div>
            <h3>Aucun personnage disponible</h3>
            <p>Il semblerait qu'aucun personnage n'ait encore été créé.</p>
          </div>
        ) : (
          // Aucun résultat de recherche
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Aucun personnage trouvé</h3>
            <p>Aucun personnage ne correspond à vos critères de recherche.</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ListePersonnage;
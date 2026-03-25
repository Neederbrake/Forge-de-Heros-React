import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCharacters } from '../api/api.js';
import './CharacterList.css';

function CharacterCardAvatar({ character }) {
  const candidates = character.avatarCandidates ?? (character.avatar ? [character.avatar] : []);
  const [avatarIndex, setAvatarIndex] = useState(0);

  if (candidates.length === 0 || avatarIndex >= candidates.length) {
    return null;
  }

  return (
    <img
      src={candidates[avatarIndex]}
      alt={character.name}
      className="character-list-avatar"
      onError={() => {
        setAvatarIndex((current) => (current + 1 < candidates.length ? current + 1 : candidates.length));
      }}
    />
  );
}

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterRace, setFilterRace] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await getCharacters();
        if (active) {
          setCharacters(data);
        }
      } catch {
        if (active) {
          setError('Impossible de charger les personnages.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  // Get unique classes and races
  const availableClasses = useMemo(() => {
    return [...new Set(characters.map((c) => c.class))].sort();
  }, [characters]);

  const availableRaces = useMemo(() => {
    return [...new Set(characters.map((c) => c.race))].sort();
  }, [characters]);

  // Apply filters and sort
  const displayedCharacters = useMemo(() => {
    let filtered = characters.filter((char) => {
      const matchName = char.name.toLowerCase().includes(searchName.toLowerCase());
      const matchClass = !filterClass || char.class === filterClass;
      const matchRace = !filterRace || char.race === filterRace;
      return matchName && matchClass && matchRace;
    });

    // Apply sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'level') {
      filtered.sort((a, b) => b.level - a.level);
    }

    return filtered;
  }, [characters, searchName, filterClass, filterRace, sortBy]);

  return (
    <section>
      <h2>Liste des personnages</h2>

      {/* Filters */}
      <div className="character-list-filters">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="character-list-filter-input"
        />

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="character-list-filter-select"
        >
          <option value="">Toutes les classes</option>
          {availableClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={filterRace}
          onChange={(e) => setFilterRace(e.target.value)}
          className="character-list-filter-select"
        >
          <option value="">Toutes les races</option>
          {availableRaces.map((race) => (
            <option key={race} value={race}>
              {race}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="character-list-filter-select"
        >
          <option value="name">Trier par nom</option>
          <option value="level">Trier par niveau</option>
        </select>
      </div>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p className="character-list-error">{error}</p> : null}

      <ul className="character-list-grid">
        {displayedCharacters.map((char) => (
          <li key={char.id} className="character-list-card">
            <CharacterCardAvatar character={char} />
            <Link to={`/characters/${char.id}`} className="character-list-link">
              <strong>{char.name}</strong>
            </Link>
            <p>
              <span className="character-list-badge">{char.class}</span>
              <span className="character-list-badge">{char.race}</span>
            </p>
            <p>Niveau: <strong>{char.level}</strong></p>
          </li>
        ))}
      </ul>

      {!loading && displayedCharacters.length === 0 ? (
        <p>Aucun personnage a afficher.</p>
      ) : null}
    </section>
  );
}

export default CharacterList;

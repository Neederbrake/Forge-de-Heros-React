import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroups } from '../api/api.js';
import './GroupList.css';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await getGroups();
        if (active) {
          setGroups(data);
        }
      } catch {
        if (active) {
          setError('Impossible de charger les groupes.');
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

  const displayedGroups = useMemo(() => {
    if (!onlyAvailable) {
      return groups;
    }
    return groups.filter((group) => group.remainingPlaces > 0);
  }, [groups, onlyAvailable]);

  return (
    <section>
      <h2>Liste des groupes</h2>

      <label className="group-list-toggle">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(e) => setOnlyAvailable(e.target.checked)}
        />
        Afficher seulement les groupes disponibles
      </label>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p className="group-list-error">{error}</p> : null}

      <ul className="group-list-grid">
        {displayedGroups.map((group) => (
          <li key={group.id} className="group-list-card">
            <Link to={`/parties/${group.id}`} className="group-list-link">
              <strong>{group.name}</strong>
            </Link>
            <p>Membres: {group.membersCount}</p>
            <p>Places restantes: {group.remainingPlaces}</p>
          </li>
        ))}
      </ul>

      {!loading && displayedGroups.length === 0 ? <p>Aucun groupe a afficher.</p> : null}
    </section>
  );
}

export default GroupList;

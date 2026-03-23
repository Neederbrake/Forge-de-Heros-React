import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getParties } from '../api/api.js';

function ListeGroupe() {
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
        const data = await getParties();
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
    return groups.filter((p) => p.remainingPlaces > 0);
  }, [groups, onlyAvailable]);

  return (
    <section>
      <h2>Liste des groupes</h2>

      <label className="toggle">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(e) => setOnlyAvailable(e.target.checked)}
        />
        Afficher seulement les groupes disponibles
      </label>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <ul className="list">
        {displayedGroups.map((group) => (
          <li key={group.id} className="card">
            <Link to={`/groupes/${group.id}`}>
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

export default ListeGroupe;

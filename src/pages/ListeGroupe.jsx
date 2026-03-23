import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getParties } from '../api/api.js';

function ListeGroupe() {
  const [parties, setParties] = useState([]);
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
          setParties(data);
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

  const displayedParties = useMemo(() => {
    if (!onlyAvailable) {
      return parties;
    }
    return parties.filter((p) => p.placesRestantes > 0);
  }, [parties, onlyAvailable]);

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
        {displayedParties.map((party) => (
          <li key={party.id} className="card">
            <Link to={`/groupes/${party.id}`}>
              <strong>{party.nom}</strong>
            </Link>
            <p>Membres: {party.membersCount}</p>
            <p>Places restantes: {party.placesRestantes}</p>
          </li>
        ))}
      </ul>

      {!loading && displayedParties.length === 0 ? <p>Aucun groupe a afficher.</p> : null}
    </section>
  );
}

export default ListeGroupe;

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPartyById } from '../api/api.js';

function DetailGroupe() {
  const { id } = useParams();
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await getPartyById(id);
        if (active) {
          setParty(data);
        }
      } catch {
        if (active) {
          setError('Impossible de charger le detail du groupe.');
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
  }, [id]);

  return (
    <section>
      <Link to="/groupes">Retour a la liste</Link>
      <h2>Detail du groupe</h2>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {party && !loading ? (
        <>
          <h3>{party.nom}</h3>
          <p>{party.description}</p>
          <p>Places totales: {party.maxPlaces}</p>
          <p>Nombre de membres: {party.membersCount}</p>
          <p>Places restantes: {party.placesRestantes}</p>

          <h4>Membres</h4>
          {party.members.length === 0 ? (
            <p>Aucun membre</p>
          ) : (
            <ul>
              {party.members.map((member, index) => {
                const memberId = member.id ?? member.personnage_id;
                const memberName =
                  member.nom ??
                  member.name ??
                  member.pseudo ??
                  (memberId ? `Personnage #${memberId}` : `Membre ${index + 1}`);

                return (
                  <li key={`${memberId ?? 'm'}-${index}`}>
                    {memberId ? (
                      <a
                        href={`http://127.0.0.1:8000/api/v1/personnages/${memberId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {memberName}
                      </a>
                    ) : (
                      <span>{memberName}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : null}
    </section>
  );
}

export default DetailGroupe;

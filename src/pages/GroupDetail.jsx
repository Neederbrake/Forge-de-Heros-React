import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGroupById } from '../api/api.js';
import './GroupDetail.css';

function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await getGroupById(id);
        if (active) {
          setGroup(data);
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
      <Link to="/parties" className="group-detail-back-link">Retour a la liste</Link>
      <h2>Detail du groupe</h2>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p className="group-detail-error">{error}</p> : null}

      {group && !loading ? (
        <>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
          <p>Places totales: {group.maxPlaces}</p>
          <p>Nombre de membres: {group.membersCount}</p>
          <p>Places restantes: {group.remainingPlaces}</p>

          <h4>Membres</h4>
          {group.members.length === 0 ? (
            <p>Aucun membre</p>
          ) : (
            <ul className="group-detail-members-list">
              {group.members.map((member, index) => {
                const memberId = member.id ?? member.character_id;
                const memberName =
                  member.name ??
                  member.pseudo ??
                  (memberId ? `Personnage #${memberId}` : `Membre ${index + 1}`);

                return (
                  <li key={`${memberId ?? 'm'}-${index}`} className="group-detail-member-item">
                    {memberId ? (
                      <Link to={`/characters/${memberId}`} className="group-detail-link">
                        {memberName}
                      </Link>
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

export default GroupDetail;

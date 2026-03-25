import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCharacterById } from '../api/api.js';
import './CharacterDetail.css';

function CharacterDetailAvatar({ character }) {
  const candidates = character.avatarCandidates ?? (character.avatar ? [character.avatar] : []);
  const [avatarIndex, setAvatarIndex] = useState(0);

  if (candidates.length === 0 || avatarIndex >= candidates.length) {
    return null;
  }

  return (
    <img
      src={candidates[avatarIndex]}
      alt={character.name}
      className="character-detail-avatar"
      onError={() => {
        setAvatarIndex((current) => (current + 1 < candidates.length ? current + 1 : candidates.length));
      }}
    />
  );
}

function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await getCharacterById(id);
        if (active) {
          setCharacter(data);
        }
      } catch {
        if (active) {
          setError('Impossible de charger le detail du personnage.');
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

  const StatBar = ({ label, value, max = 100 }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="character-detail-stat-bar">
        <label className="character-detail-stat-label">{label}</label>
        <div className="character-detail-progress-bar">
          <div className="character-detail-progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="character-detail-stat-value">
          {value}/{max}
        </span>
      </div>
    );
  };

  return (
    <section>
      <Link to="/characters" className="character-detail-back-link">Retour a la liste</Link>
      <h2>Detail du personnage</h2>

      {loading ? <p>Chargement...</p> : null}
      {error ? <p className="character-detail-error">{error}</p> : null}

      {character && !loading ? (
        <div className="character-detail-container">
          <div className="character-detail-header">
            <CharacterDetailAvatar character={character} />
            <div className="character-detail-info">
              <h3 className="character-detail-name">{character.name}</h3>
              <p className="character-detail-level">Niveau {character.level}</p>
              <div className="character-detail-tags">
                <span className="character-detail-class-tag">{character.class}</span>
                <span className="character-detail-race-tag">{character.race}</span>
              </div>
              <p className="character-detail-description">{character.description}</p>
            </div>
          </div>

          {/* Stats */}
          <section className="character-detail-stats-section">
            <h4 className="character-detail-stats-title">Statistiques</h4>
            <div className="character-detail-stats-grid">
              <StatBar label="Santé (PV)" value={character.stats.health} max={100} />
              <StatBar label="Mana" value={character.stats.mana} max={100} />
              <StatBar label="Force" value={character.stats.strength} max={20} />
              <StatBar label="Dextérité" value={character.stats.dexterity} max={20} />
              <StatBar label="Constitution" value={character.stats.constitution} max={20} />
              <StatBar label="Intelligence" value={character.stats.intelligence} max={20} />
              <StatBar label="Sagesse" value={character.stats.wisdom} max={20} />
              <StatBar label="Charisme" value={character.stats.charisma} max={20} />
            </div>
          </section>

          {/* Skills */}
          {character.skills && character.skills.length > 0 && (
            <section className="character-detail-skills-section">
              <h4 className="character-detail-skills-title">Compétences</h4>
              <ul className="character-detail-skills-list">
                {character.skills.map((skill, index) => {
                  const skillName = skill.nom ?? skill.name ?? `Compétence ${index + 1}`;
                  const skillDesc = skill.description ?? '';
                  return (
                    <li key={`${skillName}-${index}`} className="character-detail-skill-item">
                      <strong className="character-detail-skill-name">{skillName}</strong>
                      {skillDesc && <p className="character-detail-skill-desc">{skillDesc}</p>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Groups */}
          {character.groups && character.groups.length > 0 && (
            <section className="character-detail-groups-section">
              <h4 className="character-detail-groups-title">Groupes</h4>
              <ul className="character-detail-groups-list">
                {character.groups.map((group, index) => {
                  const groupId = group.id ?? group.group_id;
                  const groupName = group.nom ?? group.name ?? `Groupe #${groupId}`;

                  return (
                    <li key={`${groupId ?? 'g'}-${index}`} className="character-detail-group-item">
                      {groupId ? (
                        <Link to={`/parties/${groupId}`} className="character-detail-group-link">{groupName}</Link>
                      ) : (
                        <span>{groupName}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {(!character.skills || character.skills.length === 0) && (
            <p>Aucune compétence enregistrée.</p>
          )}
          {(!character.groups || character.groups.length === 0) && (
            <p>Ce personnage n'apartient a aucun groupe.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default CharacterDetail;

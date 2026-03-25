import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getCharacterById } from '../api/api.js';

// Composant Skeleton pour le loading
function CharacterDetailSkeleton() {
  return (
    <div className="character-detail skeleton-detail">
      <div className="character-header skeleton-header">
        <div className="character-avatar-large skeleton-avatar-large"></div>
        <div className="character-basic-info">
          <div className="skeleton-line skeleton-title-large"></div>
          <div className="skeleton-line skeleton-subtitle"></div>
          <div className="skeleton-line skeleton-level"></div>
          <div className="skeleton-line skeleton-health"></div>
        </div>
      </div>
      <div className="character-section">
        <div className="skeleton-line skeleton-section-title"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
  );
}

// Composant pour afficher une statistique
function StatBlock({ stat, getModifier, formatModifier }) {
  const modifier = getModifier(stat.value);
  const statPercent = Math.min(((stat.value - 8) / 7) * 100, 100);

  return (
    <div className="stat-block" data-stat={stat.key}>
      <div className="stat-name">{stat.name}</div>
      <div className="stat-key">({stat.key})</div>
      <div className="stat-value" aria-label={`${stat.name}: ${stat.value}`}>
        {stat.value}
      </div>
      <div className="stat-modifier" aria-label={`Modificateur: ${formatModifier(modifier)}`}>
        {formatModifier(modifier)}
      </div>
      <div className="stat-bar" role="progressbar" aria-valuenow={stat.value} aria-valuemin="8" aria-valuemax="15">
        <div
          className="stat-bar-fill"
          style={{ width: `${statPercent}%` }}
        />
      </div>
    </div>
  );
}

// Composant pour afficher les compétences
function SkillPanel({ skills, character, getModifier, formatModifier }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="skills-empty">
        <p>Aucune compétence de classe</p>
      </div>
    );
  }

  return (
    <div className="skills-grid">
      {skills.map((skill) => {
        const abilityValue = character[skill.ability.toLowerCase()] || 10;
        const modifier = getModifier(abilityValue);

        return (
          <div key={skill.id} className="skill-item">
            <div className="skill-main">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-bonus">{formatModifier(modifier)}</span>
            </div>
            <div className="skill-meta">
              <span className="skill-ability">({skill.ability})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Composant pour le breadcrumb
function Breadcrumb({ character }) {
  return (
    <nav className="breadcrumb" aria-label="Navigation">
      <ol>
        <li>
          <Link to="/personnages">Personnages</Link>
        </li>
        <li aria-current="page">
          {character ? character.name : 'Chargement...'}
        </li>
      </ol>
    </nav>
  );
}

// Composant principal
function DetailPersonnage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  // Fonctions utilitaires
  const getModifier = useCallback((stat) => {
    return Math.floor((stat - 10) / 2);
  }, []);

  const formatModifier = useCallback((modifier) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }, []);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null;
    return `http://127.0.0.1:8000/uploads/characters/${imagePath}`;
  }, []);

  // Calcul des statistiques secondaires
  const getSecondaryStats = useCallback((character) => {
    if (!character) return {};

    const conModifier = getModifier(character.constitution);
    const dexModifier = getModifier(character.dexterity);
    const wisModifier = getModifier(character.wisdom);

    return {
      armorClass: 10 + dexModifier,
      passivePerception: 10 + wisModifier,
      initiative: dexModifier,
      constitutionModifier: conModifier
    };
  }, [getModifier]);

  // Fonction de chargement du personnage
  const loadCharacter = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
      setError('');
    }

    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('ID de personnage invalide');
      }

      const data = await getCharacterById(id);

      // Validation des données
      if (!data || !data.id || !data.name) {
        throw new Error('Données de personnage invalides');
      }

      setCharacter(data);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement du personnage:', err);

      if (err.message.includes('404') || err.message.includes('not found')) {
        setError('Personnage non trouvé');
      } else {
        setError(err.message || 'Impossible de charger le personnage');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Effet pour charger le personnage
  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  // Gestion du retry
  const handleRetry = useCallback(() => {
    loadCharacter(true);
  }, [loadCharacter]);

  // Retour à la liste si personnage non trouvé
  const handleGoBack = useCallback(() => {
    navigate('/personnages');
  }, [navigate]);

  // Statistiques du personnage
  const stats = character ? [
    { name: 'Force', value: character.strength, key: 'STR' },
    { name: 'Dextérité', value: character.dexterity, key: 'DEX' },
    { name: 'Constitution', value: character.constitution, key: 'CON' },
    { name: 'Intelligence', value: character.intelligence, key: 'INT' },
    { name: 'Sagesse', value: character.wisdom, key: 'WIS' },
    { name: 'Charisme', value: character.charisma, key: 'CHA' }
  ] : [];

  const secondaryStats = character ? getSecondaryStats(character) : {};

  return (
    <section className="character-detail-page">
      <Breadcrumb character={character} />

      {loading && <CharacterDetailSkeleton />}

      {error && (
        <div className="error-container">
          <div className="error-content">
            <h3>Erreur</h3>
            <p className="error">{error}</p>
            <div className="error-actions">
              <button onClick={handleRetry} className="retry-btn">
                Réessayer
              </button>
              <button onClick={handleGoBack} className="back-btn">
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      )}

      {character && !loading && (
        <div className="character-detail">
          {/* En-tête du personnage */}
          <div className="character-header">
            <div className="character-avatar-large">
              {character.image && !imageError ? (
                <img
                  src={getImageUrl(character.image)}
                  alt={`Portrait de ${character.name}`}
                  className="avatar-image-large"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="avatar-placeholder-large" aria-label="Portrait par défaut">
                  {character.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="character-basic-info">
              <h2>{character.name}</h2>
              <p className="character-race-class">
                <span className="race">{character.race?.name || 'Race inconnue'}</span>
                <span className="separator"> • </span>
                <span className="class">{character.characterClass?.name || 'Classe inconnue'}</span>
              </p>
              <div className="character-details-grid">
                <div className="detail-item">
                  <span className="label">Niveau</span>
                  <span className="value level">{character.level}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Points de vie</span>
                  <span className="value health">{character.healthPoints}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Classe d'armure</span>
                  <span className="value">{secondaryStats.armorClass}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Initiative</span>
                  <span className="value">{formatModifier(secondaryStats.initiative)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions de race et classe */}
          {character.race && (
            <div className="character-section">
              <h3>Race : {character.race.name}</h3>
              <p className="description">{character.race.description}</p>
            </div>
          )}

          {character.characterClass && (
            <div className="character-section">
              <h3>Classe : {character.characterClass.name}</h3>
              <p className="description">{character.characterClass.description}</p>
              <div className="class-details">
                <span className="health-dice">Dé de vie : d{character.characterClass.healthDice}</span>
              </div>
            </div>
          )}

          {/* Caractéristiques */}
          <div className="character-section">
            <h3>Caractéristiques</h3>
            <div className="stats-grid">
              {stats.map((stat) => (
                <StatBlock
                  key={stat.key}
                  stat={stat}
                  getModifier={getModifier}
                  formatModifier={formatModifier}
                />
              ))}
            </div>
          </div>

          {/* Compétences */}
          {character.characterClass?.skills && (
            <div className="character-section">
              <h3>Compétences de classe</h3>
              <SkillPanel
                skills={character.characterClass.skills}
                character={character}
                getModifier={getModifier}
                formatModifier={formatModifier}
              />
            </div>
          )}

          {/* Groupes d'aventure */}
          <div className="character-section">
            <h3>Groupes d'aventure</h3>
            {character.parties && character.parties.length > 0 ? (
              <div className="parties-list">
                {character.parties.map((party) => (
                  <div key={party.id} className="party-item">
                    <Link to={`/groupes/${party.id}`} className="party-link">
                      <div className="party-header">
                        <h4>{party.name || party.nom}</h4>
                        <span className="party-indicator">→</span>
                      </div>
                      {party.description && (
                        <p className="party-description">{party.description}</p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-parties">
                <div className="empty-icon">👥</div>
                <p>Ce personnage ne fait partie d'aucun groupe d'aventure.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default DetailPersonnage;
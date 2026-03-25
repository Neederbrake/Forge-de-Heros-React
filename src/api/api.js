const API_BASE = 'http://127.0.0.1:8000/api/v1';

function normalizeGroup(rawGroup) {
  const members = rawGroup.membres ?? rawGroup.members ?? [];
  const maxPlaces = rawGroup.places_max ?? rawGroup.max_places ?? rawGroup.nb_places ?? 0;
  const membersCount = rawGroup.nb_membres ?? rawGroup.members_count ?? members.length ?? 0;

  return {
    id: rawGroup.id,
    name: rawGroup.nom ?? rawGroup.name ?? 'Groupe sans nom',
    description: rawGroup.description ?? 'Aucune description',
    maxPlaces,
    membersCount,
    remainingPlaces: Math.max(maxPlaces - membersCount, 0),
    members,
  };
}

export async function getGroups() {
  const res = await fetch(`${API_BASE}/parties`);
  if (!res.ok) {
    throw new Error('Erreur de chargement des groupes');
  }

  const data = await res.json();
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(normalizeGroup);
}

export async function getGroupById(id) {
  const res = await fetch(`${API_BASE}/parties/${id}`);
  if (!res.ok) {
    throw new Error('Erreur de chargement du detail groupe');
  }

  const data = await res.json();
  return normalizeGroup(data);
}

function normalizeCharacter(char) {
  const stats = char.stats ?? {};
  const groups = char.groupes ?? char.groups ?? [];

  return {
    id: char.id,
    name: char.nom ?? char.name ?? 'Personnage sans nom',
    avatar: char.avatar ?? char.image ?? null,
    class: char.classe ?? char.class ?? 'Pas de classe',
    race: char.race ?? 'Pas de race',
    level: char.niveau ?? char.level ?? 1,
    description: char.description ?? 'Aucune description',
    stats: {
      health: stats.hp ?? stats.health ?? 0,
      mana: stats.mana ?? 0,
      strength: stats.force ?? stats.strength ?? 0,
      dexterity: stats.dexterite ?? stats.dexterity ?? 0,
      constitution: stats.constitution ?? 0,
      intelligence: stats.intelligence ?? 0,
      wisdom: stats.sagesse ?? stats.wisdom ?? 0,
      charisma: stats.charisme ?? stats.charisma ?? 0,
    },
    skills: char.competences ?? char.skills ?? [],
    groups,
  };
}

export async function getCharacters() {
  const res = await fetch(`${API_BASE}/characters`);
  if (!res.ok) {
    throw new Error('Erreur de chargement des personnages');
  }

  const data = await res.json();
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(normalizeCharacter);
}

export async function getCharacterById(id) {
  const res = await fetch(`${API_BASE}/characters/${id}`);
  if (!res.ok) {
    throw new Error('Erreur de chargement du detail personnage');
  }

  const data = await res.json();
  return normalizeCharacter(data);
}

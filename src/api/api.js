const API_BASE = 'http://127.0.0.1:8000/api/v1';

function normalizeParties(party) {
  const members = party.membres ?? party.members ?? [];
  const maxPlaces = party.places_max ?? party.max_places ?? party.nb_places ?? 0;
  const membersCount = party.nb_membres ?? party.members_count ?? members.length ?? 0;

  return {
    id: party.id,
    name: party.nom ?? party.name ?? 'Groupe sans nom',
    description: party.description ?? 'Aucune description',
    maxPlaces,
    membersCount,
    remainingPlaces: Math.max(maxPlaces - membersCount, 0),
    members,
  };
}

export async function getParties() {
  const res = await fetch(`${API_BASE}/parties`);
  if (!res.ok) {
    throw new Error('Erreur de chargement des groupes');
  }

  const data = await res.json();
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(normalizeParties);
}

export async function getPartiesById(id) {
  const res = await fetch(`${API_BASE}/parties/${id}`);
  if (!res.ok) {
    throw new Error('Erreur de chargement du detail groupe');
  }

  const data = await res.json();
  return normalizeParties(data);
}

// Characters functions
function normalizeCharacter(character) {
  return {
    id: character.id,
    name: character.name ?? character.nom ?? 'Personnage sans nom',
    level: character.level ?? character.niveau ?? 1,
    strength: character.strength ?? character.force ?? 10,
    dexterity: character.dexterity ?? character.dexterite ?? 10,
    constitution: character.constitution ?? 10,
    intelligence: character.intelligence ?? 10,
    wisdom: character.wisdom ?? character.sagesse ?? 10,
    charisma: character.charisma ?? character.charisme ?? 10,
    healthPoints: character.healthPoints ?? character.health_points ?? character.pv ?? 0,
    image: character.image ?? null,
    race: character.race ?? null,
    characterClass: character.characterClass ?? character.character_class ?? character.classe ?? null,
    parties: character.parties ?? character.groupes ?? []
  };
}

export async function getCharacters({ name, race, characterClass } = {}) {
  let url = `${API_BASE}/characters`;
  const params = new URLSearchParams();

  if (name) params.append('name', name);
  if (race) params.append('race', race);
  if (characterClass) params.append('class', characterClass);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);
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
    throw new Error('Erreur de chargement du detail du personnage');
  }

  const data = await res.json();
  return normalizeCharacter(data);
}

// Races functions
export async function getRaces() {
  const res = await fetch(`${API_BASE}/races`);
  if (!res.ok) {
    throw new Error('Erreur de chargement des races');
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? [];
}

// Classes functions
export async function getCharacterClasses() {
  const res = await fetch(`${API_BASE}/classes`);
  if (!res.ok) {
    throw new Error('Erreur de chargement des classes');
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results ?? [];
}

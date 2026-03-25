const API_BASE = 'http://127.0.0.1:8000/api/v1';
const API_ROOT = API_BASE.replace('/api/v1', '');

function pickFirst(source, keys, fallback = null) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }
  return fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildAvatarCandidates(imageValue) {
  if (!imageValue) {
    return [];
  }

  if (
    imageValue.startsWith('http://') ||
    imageValue.startsWith('https://') ||
    imageValue.startsWith('/')
  ) {
    return [imageValue];
  }

  return [
    `${API_ROOT}/uploads/images/${imageValue}`,
    `${API_ROOT}/uploads/personnages/${imageValue}`,
    `${API_ROOT}/uploads/characters/${imageValue}`,
    `${API_ROOT}/uploads/${imageValue}`,
  ];
}

async function fetchJsonWithFallback(paths) {
  let lastResponse = null;

  for (const path of paths) {
    const response = await fetch(`${API_BASE}${path}`);
    if (response.ok) {
      return response.json();
    }
    lastResponse = response;
  }

  throw new Error(`Request failed with status ${lastResponse?.status ?? 'unknown'}`);
}

function normalizeGroup(rawGroup) {
  const members = pickFirst(rawGroup, ['membres', 'members', 'characters', 'personnages'], []);
  const maxPlaces = toNumber(
    pickFirst(rawGroup, ['maxSize', 'MaxSize', 'places_max', 'max_places', 'nb_places'], 0),
    0,
  );
  const membersCount = toNumber(
    pickFirst(rawGroup, ['membersCount', 'nb_membres', 'members_count'], members.length ?? 0),
    members.length ?? 0,
  );

  return {
    id: pickFirst(rawGroup, ['id', 'Id'], null),
    name: pickFirst(rawGroup, ['nom', 'name', 'Name'], 'Unnamed Group'),
    description: pickFirst(rawGroup, ['description', 'Description'], 'No description'),
    maxPlaces,
    membersCount,
    remainingPlaces: Math.max(maxPlaces - membersCount, 0),
    members,
  };
}

export async function getGroups() {
  const data = await fetchJsonWithFallback(['/parties', '/groups']);
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(normalizeGroup);
}

export async function getGroupById(id) {
  const data = await fetchJsonWithFallback([`/parties/${id}`, `/groups/${id}`]);
  return normalizeGroup(data);
}

function normalizeCharacter(char) {
  const stats = char.stats ?? {};
  const groups = char.groupes ?? char.groups ?? char.parties ?? [];
  const rawImage = pickFirst(char, ['avatar', 'image', 'Image'], null);
  const avatarCandidates = buildAvatarCandidates(rawImage);
  const rawRace = pickFirst(char, ['race', 'Race'], null);
  const rawClass = pickFirst(char, ['characterClass', 'class', 'Class', 'classe'], null);

  const raceName =
    typeof rawRace === 'object' && rawRace !== null
      ? pickFirst(rawRace, ['name', 'nom'], 'No race')
      : rawRace ?? 'No race';

  const className =
    typeof rawClass === 'object' && rawClass !== null
      ? pickFirst(rawClass, ['name', 'nom'], 'No class')
      : rawClass ?? 'No class';

  return {
    id: pickFirst(char, ['id', 'Id'], null),
    name: pickFirst(char, ['nom', 'name', 'Name'], 'Unnamed Character'),
    avatar: avatarCandidates[0] ?? null,
    avatarCandidates,
    class: className,
    race: raceName,
    level: toNumber(pickFirst(char, ['niveau', 'level', 'Level'], 1), 1),
    description: char.description ?? 'No description',
    stats: {
      health: toNumber(pickFirst(char, ['healthPoints', 'HealthPoints'], pickFirst(stats, ['hp', 'health'], 0)), 0),
      mana: toNumber(pickFirst(char, ['mana', 'Mana'], pickFirst(stats, ['mana'], 0)), 0),
      strength: toNumber(pickFirst(char, ['strength', 'Strength'], pickFirst(stats, ['force', 'strength'], 0)), 0),
      dexterity: toNumber(pickFirst(char, ['dexterity', 'Dexterity'], pickFirst(stats, ['dexterite', 'dexterity'], 0)), 0),
      constitution: toNumber(pickFirst(char, ['constitution', 'Constitution'], pickFirst(stats, ['constitution'], 0)), 0),
      intelligence: toNumber(pickFirst(char, ['intelligence', 'Intelligence'], pickFirst(stats, ['intelligence'], 0)), 0),
      wisdom: toNumber(pickFirst(char, ['wisdom', 'Wisdom'], pickFirst(stats, ['sagesse', 'wisdom'], 0)), 0),
      charisma: toNumber(pickFirst(char, ['charisma', 'Charisma'], pickFirst(stats, ['charisme', 'charisma'], 0)), 0),
    },
    skills: char.competences ?? char.skills ?? [],
    groups,
  };
}

export async function getCharacters() {
  const data = await fetchJsonWithFallback(['/personnages', '/characters']);
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(normalizeCharacter);
}

export async function getCharacterById(id) {
  const data = await fetchJsonWithFallback([`/personnages/${id}`, `/characters/${id}`]);
  return normalizeCharacter(data);
}

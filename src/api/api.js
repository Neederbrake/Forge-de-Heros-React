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

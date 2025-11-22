import { apiUrl } from '../../../shared/utils/apiBase';

export async function listGames() {
  const res = await fetch(apiUrl('/api/juegos'));
  if (!res.ok) throw new Error('No se pudieron cargar los juegos');
  return res.json();
}

export async function createGame(payload) {
  const res = await fetch(apiUrl('/api/juegos'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('No se pudo crear el juego');
  return res.json();
}

export async function updateGame(id, payload) {
  const res = await fetch(apiUrl(`/api/juegos/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el juego');
  return res.json();
}

export async function deleteGame(id) {
  const res = await fetch(apiUrl(`/api/juegos/${id}`), { method: 'DELETE' });
  if (!res.ok) throw new Error('No se pudo eliminar el juego');
  return res.json();
}
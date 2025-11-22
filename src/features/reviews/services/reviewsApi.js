import { apiUrl } from '../../../shared/utils/apiBase';

async function fetchWithFallback(paths, options) {
  for (const p of paths) {
    try {
      const res = await fetch(apiUrl(p), options);
      if (res.ok) return res;
    } catch {}
  }
  // If none succeeded, throw the last path for context
  throw new Error('No se pudieron contactar las rutas de reseñas');
}

export async function listReviews() {
  const res = await fetchWithFallback(['/api/reviews', '/api/resenas', '/api/reseñas']);
  return res.json();
}

export async function listReviewsByGame(gameId) {
  const res = await fetchWithFallback([
    `/api/reviews/juego/${gameId}`,
    `/api/resenas/juego/${gameId}`,
    `/api/reseñas/juego/${gameId}`,
  ]);
  return res.json();
}

export async function createReview(payload) {
  const res = await fetchWithFallback(['/api/reviews', '/api/resenas', '/api/reseñas'], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteReview(id) {
  const res = await fetchWithFallback([
    `/api/reviews/${id}`,
    `/api/resenas/${id}`,
    `/api/reseñas/${id}`,
  ], { method: 'DELETE' });
  return res.json();
}
export const REVIEWS_KEY = 'gametracker_reviews';

export function loadReviews() {
  try {
    const saved = localStorage.getItem(REVIEWS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
}

export function saveReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch (_) {
    // noop
  }
}
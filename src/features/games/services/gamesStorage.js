export const GAMES_KEY = 'gametracker_games';

export function loadGames() {
  try {
    const saved = localStorage.getItem(GAMES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
}

export function saveGames(games) {
  try {
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  } catch (_) {
    // noop
  }
}
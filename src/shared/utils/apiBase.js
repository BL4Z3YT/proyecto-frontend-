const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
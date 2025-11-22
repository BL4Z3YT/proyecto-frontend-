import React from 'react';

const GENRES = ['Acción', 'RPG', 'Estrategia', 'Aventura', 'Deportes', 'Simulación', 'Plataformas', 'Shooter', 'Sandbox'];
const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

export default function GamesFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <div className="filters-grid">
        <div className="form-group">
          <label className="form-label">Buscar</label>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar juegos..."
            value={filters.search}
            onChange={(e) => onChange((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Género</label>
          <select
            className="form-select"
            value={filters.genre}
            onChange={(e) => onChange((f) => ({ ...f, genre: e.target.value }))}
          >
            <option value="">Todos los géneros</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Plataforma</label>
          <select
            className="form-select"
            value={filters.platform}
            onChange={(e) => onChange((f) => ({ ...f, platform: e.target.value }))}
          >
            <option value="">Todas las plataformas</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => onChange((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">Todos los estados</option>
            <option value="completado">Completado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Ordenar por</label>
          <select
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => onChange((f) => ({ ...f, sortBy: e.target.value }))}
          >
            <option value="">Sin orden</option>
            <option value="fecha">Fecha de creación</option>
            <option value="puntuacion">Puntuación promedio</option>
            <option value="titulo">Título</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Orden</label>
          <select
            className="form-select"
            value={filters.sortOrder}
            onChange={(e) => onChange((f) => ({ ...f, sortOrder: e.target.value }))}
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>
    </div>
  );
}
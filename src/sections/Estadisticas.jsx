import React from 'react';
import StatsCharts from '../features/games/components/StatsCharts';

export default function Estadisticas({ active, stats, games, reviews }) {
  return (
    <section id="estadisticas" className={`section ${active ? 'active' : ''}`}>
      <h2 className="section-title">Estadísticas</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total de Juegos</h3>
            <span id="totalGames" className="stat-number">{stats.totalGames}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Juegos Completados</h3>
            <span id="completedGames" className="stat-number">{stats.completedGames}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Reseñas Escritas</h3>
            <span id="totalReviews" className="stat-number">{stats.totalReviews}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Completado (%)</h3>
            <span className="stat-number">
              {stats.totalGames > 0 ? Math.round((stats.completedGames / stats.totalGames) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <StatsCharts games={games} reviews={reviews} />
      </div>
    </section>
  );
}
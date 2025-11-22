import React from 'react';

export default function GameCard({ game, onToggleStatus, onDelete, onOpenDetails }) {
  return (
    <div className="game-card" onClick={() => onOpenDetails && onOpenDetails(game)}>
      {game.imagenPortada && (
        <img src={game.imagenPortada} alt={game.titulo} className="game-cover" />
      )}
      <div className="game-content">
        <div className="game-title">{game.titulo}</div>
        <div className="game-meta">
          {game.genero} · {game.plataforma} {game.añoLanzamiento ? `· ${game.añoLanzamiento}` : ''}
        </div>
        <div className="game-actions">
          <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); onToggleStatus(game.id); }}>
            {game.completado ? 'Marcar como pendiente' : 'Marcar como completado'}
          </button>
          <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); onDelete(game.id); }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
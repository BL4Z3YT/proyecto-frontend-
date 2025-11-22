import React, { useEffect, useState } from 'react';

export default function GameModal({ game, reviews = [], onClose, onToggleStatus, onDelete }) {
  const [closing, setClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    setClosing(false);
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 0);
    return () => clearTimeout(t);
  }, [game]);

  if (!game) return null;

  const gameReviews = reviews.filter((r) => (r.juegoId || r.gameId) === game.id);

  function handleClose() {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  }

  return (
    <div className={`modal-overlay ${closing ? 'closing' : (entered ? 'open' : '')}`} onClick={handleClose}>
      <div className={`modal-content ${closing ? 'closing' : (entered ? 'open' : '')}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{game.titulo}</h3>
          <button className="btn btn-outline" onClick={handleClose}>Cerrar</button>
        </div>
        <div className="modal-body">
          {game.imagenPortada && (
            <img src={game.imagenPortada} alt={game.titulo} className="modal-cover" />
          )}
          <div className="modal-details">
            <div><strong>Desarrollador:</strong> {game.desarrollador || 'N/D'}</div>
            <div><strong>Género:</strong> {game.genero || 'N/D'}</div>
            <div><strong>Plataforma:</strong> {game.plataforma || 'N/D'}</div>
            <div><strong>Año:</strong> {game.añoLanzamiento || 'N/D'}</div>
            <div><strong>Estado:</strong> {game.completado ? 'Completado' : 'Pendiente'}</div>
            {game.descripcion && (
              <div style={{ marginTop: '0.5rem' }}><strong>Descripción:</strong> {game.descripcion}</div>
            )}
          </div>
        </div>
        {(
          <div style={{ padding: '0 var(--space-lg) var(--space-lg) var(--space-lg)' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Reseñas</h4>
            {gameReviews.length === 0 ? (
              <div className="card">No hay reseñas para este juego.</div>
            ) : (
              <div className="reviews-list">
                {gameReviews.map((r) => (
                  <div key={r.id} className="card" style={{ marginBottom: '0.5rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {"★".repeat(Number(r.puntuacion ?? r.rating))}
                      {"☆".repeat(5 - Number(r.puntuacion ?? r.rating))}
                    </div>
                    <div>{r.textoReseña ?? r.contenido}</div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {r.horasJugadas != null ? `Horas: ${r.horasJugadas}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => onToggleStatus(game.id)}>
            {game.completado ? 'Marcar como pendiente' : 'Marcar como completado'}
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(game.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
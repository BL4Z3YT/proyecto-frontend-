import React from 'react';

export default function Reseñas({ active, reviews, games, handleAddReview, deleteReview }) {
  return (
    <section id="reseñas" className={`section ${active ? 'active' : ''}`}>
      <h2 className="section-title">Mis Reseñas</h2>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <form onSubmit={handleAddReview}>
          <div className="form-group">
            <label className="form-label" htmlFor="reviewGame">Juego</label>
            <select id="reviewGame" name="reviewGame" className="form-select" required>
              <option value="">Seleccionar juego</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.titulo}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Calificación</label>
            <div className="form-rating">
              <div className="rating">
                {[5,4,3,2,1].map((v) => (
                  <>
                    <input key={`r${v}`} id={`star-${v}`} type="radio" name="reviewRating" value={v} required />
                    <label key={`l${v}`} htmlFor={`star-${v}`}>★</label>
                  </>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reviewContent">Comentario</label>
            <textarea id="reviewContent" name="reviewContent" className="form-textarea" rows={3} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reviewHours">Horas jugadas</label>
            <input id="reviewHours" name="reviewHours" type="number" min="0" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reviewDifficulty">Dificultad</label>
            <select id="reviewDifficulty" name="reviewDifficulty" className="form-select" required>
              {['Fácil','Normal','Difícil'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reviewRecommend">¿Recomendaría?</label>
            <select id="reviewRecommend" name="reviewRecommend" className="form-select" required>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Agregar Reseña</button>
        </form>
      </div>
      <div id="reviewsList" className="reviews-list">
        {reviews.length === 0 ? (
          <div className="card">No hay reseñas aún.</div>
        ) : (
          reviews.map((r) => {
            const game = games.find((g) => g.id === (r.juegoId || r.gameId));
            return (
              <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{game ? game.titulo : 'Juego eliminado'}</strong>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {"★".repeat(Number(r.puntuacion ?? r.rating))}
                    {"☆".repeat(5 - Number(r.puntuacion ?? r.rating))}
                  </div>
                  <div>{r.textoReseña ?? r.contenido}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Horas: {r.horasJugadas}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Dificultad: {r.dificultad}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Recomendaría: {r.recomendaria ? 'Sí' : 'No'}</div>
                </div>
                <button className="btn btn-danger" onClick={() => deleteReview(r.id)}>Eliminar</button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
import React from 'react';

export default function Agregar({ active, handleAddGame }) {
  return (
    <section id="agregar" className={`section ${active ? 'active' : ''}`}>
      <h2 className="section-title">Agregar Nuevo Juego</h2>
      <div className="card">
        <form onSubmit={handleAddGame}>
          <div className="form-group">
            <label className="form-label" htmlFor="gameTitle">Título del Juego</label>
            <input id="gameTitle" name="gameTitle" type="text" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gameDeveloper">Desarrollador</label>
            <input id="gameDeveloper" name="gameDeveloper" type="text" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gameGenre">Género</label>
            <select id="gameGenre" name="gameGenre" className="form-select" required>
              <option value="">Seleccionar género</option>
              {['Acción','RPG','Estrategia','Aventura','Deportes','Simulación','Puzzle','Horror','Plataformas','Shooter','Sandbox'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gamePlatform">Plataforma</label>
            <select id="gamePlatform" name="gamePlatform" className="form-select" required>
              <option value="">Seleccionar plataforma</option>
              {['PC','PlayStation','Xbox','Nintendo Switch','Mobile'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gameYear">Año de lanzamiento</label>
            <input id="gameYear" name="gameYear" type="number" className="form-input" min="1970" max="2100" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gameDescription">Descripción</label>
            <textarea id="gameDescription" name="gameDescription" className="form-textarea" rows={4} placeholder="Descripción del juego..." required></textarea>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="gameCover">URL de la Portada</label>
            <input id="gameCover" name="gameCover" type="url" className="form-input" placeholder="https://ejemplo.com/imagen.jpg" />
          </div>
          <button type="submit" className="btn btn-primary">Agregar Juego</button>
        </form>
      </div>
    </section>
  );
}
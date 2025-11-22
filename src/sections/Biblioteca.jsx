import React, { useState } from 'react';
import GamesFilters from '../features/games/components/GamesFilters';
import GameCard from '../features/games/components/GameCard';
import GameModal from '../features/games/components/GameModal';

export default function Biblioteca({ active, filters, setFilters, filteredGames, reviews, toggleGameStatus, deleteGame }) {
  const [selectedGame, setSelectedGame] = useState(null);
  return (
    <section id="biblioteca" className={`section ${active ? 'active' : ''}`}>
      <h2 className="section-title">Mi Biblioteca de Juegos</h2>
      <GamesFilters filters={filters} onChange={setFilters} />
      <div id="gamesContainer" className="games-grid">
        {filteredGames.map((g) => (
          <GameCard key={g.id} game={g} onToggleStatus={toggleGameStatus} onDelete={deleteGame} onOpenDetails={setSelectedGame} />
        ))}
        {filteredGames.length === 0 && (
          <div className="card">No hay juegos con esos filtros.</div>
        )}
      </div>
      {selectedGame && (
        <GameModal
          game={selectedGame}
          reviews={reviews}
          onClose={() => setSelectedGame(null)}
          onToggleStatus={toggleGameStatus}
          onDelete={(id) => { deleteGame(id); setSelectedGame(null); }}
        />
      )}
    </section>
  );
}
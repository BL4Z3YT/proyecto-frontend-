import React, { useEffect, useMemo, useState } from 'react';
import './GameTracker.css';
import Header from '../layout/Header';
import Body from '../layout/Body';
import Footer from '../layout/Footer';
import Biblioteca from '../sections/Biblioteca';
import Agregar from '../sections/Agregar';
import Reseñas from '../sections/Reseñas';
import Estadisticas from '../sections/Estadisticas';
import { listGames, createGame, updateGame, deleteGame as apiDeleteGame } from '../features/games/services/gamesApi';
import { listReviews, createReview, deleteReview as apiDeleteReview } from '../features/reviews/services/reviewsApi';

export default function GameTracker() {
  const [section, setSection] = useState('biblioteca');
  const [theme, setTheme] = useState(() => localStorage.getItem('gametracker_theme') || 'dark');

  const [games, setGames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gametracker_cache_games') || '[]');
    } catch {
      return [];
    }
  });
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gametracker_cache_reviews') || '[]');
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    platform: '',
    status: '',
    sortBy: '',
    sortOrder: 'desc',
  });

  // Estado de refresco eliminado; la sincronización ocurre automáticamente al cargar y por polling

  // Cargar datos desde API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [g, r] = await Promise.all([listGames(), listReviews()]);
        if (mounted) {
          setGames(g);
          setReviews(r);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Refrescar datos manualmente (y reutilizable)
  async function refreshData() {
    try {
      const [g, r] = await Promise.all([listGames(), listReviews()]);
      setGames(g);
      setReviews(r);
    } catch (err) {
      console.error(err);
    }
  }

  // Polling periódico para sincronizar con el backend
  useEffect(() => {
    const interval = setInterval(() => {
      // Solo sincronizar cuando la pestaña está visible para no desperdiciar recursos
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    }, 10000); // cada 10 segundos
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    try { localStorage.setItem('gametracker_cache_games', JSON.stringify(games)); } catch {}
  }, [games]);
  useEffect(() => {
    try { localStorage.setItem('gametracker_cache_reviews', JSON.stringify(reviews)); } catch {}
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('gametracker_theme', theme);
    document.body.dataset.theme = theme === 'light' ? 'light' : '';
  }, [theme]);

  const ratingsMap = useMemo(() => {
    const map = new Map();
    for (const g of games) {
      const rs = reviews.filter((r) => (r.juegoId || r.gameId) === g.id);
      const vals = rs.map((r) => Number(r.puntuacion ?? r.rating)).filter((n) => Number.isFinite(n));
      const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
      map.set(g.id, avg);
    }
    return map;
  }, [games, reviews]);

  const filteredGames = useMemo(() => {
    const base = games.filter((g) => {
      const matchSearch = [g.titulo, g.desarrollador, g.descripcion]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchGenre = !filters.genre || g.genero === filters.genre;
      const matchPlatform = !filters.platform || g.plataforma === filters.platform;
      const matchStatus = !filters.status || (filters.status === 'completado' ? g.completado : !g.completado);
      return matchSearch && matchGenre && matchPlatform && matchStatus;
    });
    if (!filters.sortBy) return base;
    const dir = filters.sortOrder === 'asc' ? 1 : -1;
    const sorted = [...base].sort((a, b) => {
      if (filters.sortBy === 'fecha') {
        const da = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
        const db = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
        return (da - db) * dir;
      }
      if (filters.sortBy === 'puntuacion') {
        const pa = ratingsMap.get(a.id) || 0;
        const pb = ratingsMap.get(b.id) || 0;
        return (pa - pb) * dir;
      }
      if (filters.sortBy === 'titulo') {
        return a.titulo.localeCompare(b.titulo) * dir;
      }
      return 0;
    });
    return sorted;
  }, [games, filters, ratingsMap]);

  const stats = useMemo(() => ({
    totalGames: games.length,
    completedGames: games.filter((g) => g.completado).length,
    totalReviews: reviews.length,
  }), [games, reviews]);

  // Acciones juegos
  async function handleAddGame(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const payload = {
      titulo: data.gameTitle?.trim(),
      desarrollador: data.gameDeveloper?.trim(),
      genero: data.gameGenre,
      plataforma: data.gamePlatform,
      descripcion: data.gameDescription?.trim() || '',
      imagenPortada: data.gameCover?.trim() || '',
      añoLanzamiento: data.gameYear ? Number(data.gameYear) : undefined,
      completado: false,
      fechaCreacion: new Date().toISOString(),
    };
    try {
      const created = await createGame(payload);
      setGames((prev) => [created, ...prev]);
      setSection('biblioteca');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('No se pudo agregar el juego');
    }
  }

  async function toggleGameStatus(id) {
    const current = games.find((g) => g.id === id);
    if (!current) return;
    try {
      const updated = await updateGame(id, { completado: !current.completado });
      setGames((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el estado del juego');
    }
  }

  async function deleteGame(id) {
    try {
      await apiDeleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      // también eliminar reseñas asociadas localmente (el backend ya las borra)
      setReviews((prev) => prev.filter((r) => (r.juegoId || r.gameId) !== id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el juego');
    }
  }

  // Reseñas
  async function handleAddReview(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const rating = Number(data.reviewRating);
    const horas = Number(data.reviewHours);
    const recomendaria = String(data.reviewRecommend) === 'true';
    const payload = {
      juegoId: data.reviewGame,
      gameId: data.reviewGame,
      textoReseña: data.reviewContent?.trim(),
      textoResena: data.reviewContent?.trim(),
      contenido: data.reviewContent?.trim(),
      puntuacion: rating,
      rating,
      horasJugadas: horas,
      dificultad: data.reviewDifficulty,
      recomendaria,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
    try {
      const created = await createReview(payload);
      setReviews((prev) => [created, ...prev]);
      form.reset();
    } catch (err) {
      console.error(err);
      alert('No se pudo agregar la reseña');
    }
  }

  async function deleteReview(id) {
    try {
      await apiDeleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la reseña');
    }
  }

  // UI helpers (NavButton movido a componente compartido)

  return (
    <div>
      <Header
        section={section}
        setSection={setSection}
        theme={theme}
        setTheme={setTheme}
      />
      <Body>
        <Biblioteca
          active={section === 'biblioteca'}
          filters={filters}
          setFilters={setFilters}
          filteredGames={filteredGames}
          reviews={reviews}
          toggleGameStatus={toggleGameStatus}
          deleteGame={deleteGame}
        />
        <Agregar active={section === 'agregar'} handleAddGame={handleAddGame} />
        <Reseñas
          active={section === 'reseñas'}
          reviews={reviews}
          games={games}
          handleAddReview={handleAddReview}
          deleteReview={deleteReview}
        />
        <Estadisticas active={section === 'estadisticas'} stats={stats} games={games} reviews={reviews} />
      </Body>
      <Footer />
    </div>
  );
}
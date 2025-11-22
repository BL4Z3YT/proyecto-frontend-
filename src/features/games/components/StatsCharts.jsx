import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const Utils = {
  months: ({ count }) => {
    const base = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return base.slice(0, count);
  },
};

export default function StatsCharts({ games, reviews }) {
  function monthKey(d) {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = dt.getMonth();
    return `${y}-${String(m + 1).padStart(2, '0')}`;
  }
  function monthLabel(key) {
    const [y, m] = key.split('-');
    const base = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${base[Number(m) - 1]} ${y}`;
  }
  const months = useMemo(() => {
    const set = new Set();
    for (const g of games) if (g.fechaCreacion) set.add(monthKey(g.fechaCreacion));
    for (const r of reviews) if (r.fechaCreacion || r.fecha) set.add(monthKey(r.fechaCreacion || r.fecha));
    const arr = Array.from(set);
    arr.sort();
    const last = arr.slice(-7);
    return last.length ? last : Utils.months({ count: 7 }).map((_, i) => `${new Date().getFullYear()}-${String(i+1).padStart(2,'0')}`);
  }, [games, reviews]);
  const labels = months.map(monthLabel);
  const monthlyGames = useMemo(() => {
    const map = new Map(months.map((k) => [k, 0]));
    for (const g of games) if (g.fechaCreacion) {
      const k = monthKey(g.fechaCreacion);
      if (map.has(k)) map.set(k, (map.get(k) || 0) + 1);
    }
    return months.map((k) => map.get(k) || 0);
  }, [months, games]);
  const monthlyReviews = useMemo(() => {
    const map = new Map(months.map((k) => [k, 0]));
    for (const r of reviews) {
      const k = monthKey(r.fechaCreacion || r.fecha || Date.now());
      if (map.has(k)) map.set(k, (map.get(k) || 0) + 1);
    }
    return months.map((k) => map.get(k) || 0);
  }, [months, reviews]);
  const monthlyHours = useMemo(() => {
    const map = new Map(months.map((k) => [k, 0]));
    for (const r of reviews) {
      const k = monthKey(r.fechaCreacion || r.fecha || Date.now());
      const h = Number(r.horasJugadas) || 0;
      if (map.has(k)) map.set(k, (map.get(k) || 0) + h);
    }
    return months.map((k) => map.get(k) || 0);
  }, [months, reviews]);
  const dataLine = {
    labels,
    datasets: [
      {
        label: 'Juegos agregados',
        data: monthlyGames,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.15)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Reseñas escritas',
        data: monthlyReviews,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.15)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const DIFFS = ['Fácil','Normal','Difícil'];
  const hoursByDifficulty = useMemo(() => {
    const init = Object.fromEntries(DIFFS.map((d) => [d, new Map(months.map((k) => [k, 0]))]));
    for (const r of reviews) {
      const k = monthKey(r.fechaCreacion || r.fecha || Date.now());
      const d = r.dificultad;
      const h = Number(r.horasJugadas) || 0;
      if (init[d] && init[d].has(k)) init[d].set(k, (init[d].get(k) || 0) + h);
    }
    return Object.fromEntries(DIFFS.map((d) => [d, months.map((k) => init[d].get(k) || 0)]));
  }, [months, reviews]);
  const dataBar = {
    labels,
    datasets: [
      {
        label: 'Fácil',
        data: hoursByDifficulty['Fácil'] || months.map(() => 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        stack: 'horas',
      },
      {
        label: 'Normal',
        data: hoursByDifficulty['Normal'] || months.map(() => 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
        stack: 'horas',
      },
      {
        label: 'Difícil',
        data: hoursByDifficulty['Difícil'] || months.map(() => 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        stack: 'horas',
      },
    ],
  };
  const optionsBar = {
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        title: { display: true, text: 'Horas' },
        grid: { color: 'rgba(148,163,184,0.2)' },
      },
      x: {
        stacked: true,
        title: { display: true, text: 'Mes' },
        grid: { display: false },
      },
    },
    plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Horas por dificultad (comparativo)' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const completedCount = useMemo(() => games.filter((g) => !!g.completado).length, [games]);
  const notCompletedCount = useMemo(() => games.filter((g) => !g.completado).length, [games]);
  const dataPieCompletion = {
    labels: ['Completados', 'No completados'],
    datasets: [
      {
        data: [completedCount, notCompletedCount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(201, 203, 207, 0.6)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(201, 203, 207)'],
        borderWidth: 1,
      },
    ],
  };
  const optionsPieCompletion = {
    plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Estado de finalización' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const hoursByGameData = useMemo(() => {
    const map = new Map();
    for (const r of reviews) {
      const gid = r.juegoId || r.gameId;
      const g = games.find((x) => x.id === gid);
      if (!g) continue;
      const key = g.titulo;
      const h = Number(r.horasJugadas) || 0;
      map.set(key, (map.get(key) || 0) + h);
    }
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return {
      labels: sorted.map((x) => x[0]),
      values: sorted.map((x) => x[1]),
    };
  }, [games, reviews]);
  const dataHoursByGame = {
    labels: hoursByGameData.labels,
    datasets: [
      {
        label: 'Horas jugadas por juego (Top 10)',
        data: hoursByGameData.values,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };
  const optionsHoursByGame = {
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.2)' }, title: { display: true, text: 'Horas' } },
      y: { grid: { display: false } },
    },
    plugins: { legend: { display: false }, title: { display: true, text: 'Ranking de horas por juego' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="charts-grid">
      <div className="card" style={{ height: 320 }}>
        <Line
          data={dataLine}
          options={{
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.2)' } },
              x: { grid: { display: false } },
            },
            plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Comparativo: juegos vs reseñas' } },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
      <div className="card" style={{ height: 320 }}>
        <Bar data={dataBar} options={optionsBar} />
      </div>
      <div className="card" style={{ height: 320 }}>
        <Doughnut data={dataPieCompletion} options={optionsPieCompletion} />
      </div>
      <div className="card" style={{ height: 320 }}>
        <Bar data={dataHoursByGame} options={optionsHoursByGame} />
      </div>
    </div>
  );
}
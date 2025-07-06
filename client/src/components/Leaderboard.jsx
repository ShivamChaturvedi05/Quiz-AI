// src/components/Leaderboard.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Leaderboard() {
  const { id } = useParams();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    api.get(`/results/leaderboard/${id}`).then(r => setBoard(r.data));
  }, [id]);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {board.map((r, i) => (
          <li key={r.enrollment_no || r.name}>
            {i+1}. {r.name} ({r.enrollment_no || '—'}) — {r.score}
          </li>
        ))}
      </ol>
    </div>
  );
}

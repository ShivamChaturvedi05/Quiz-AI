// src/components/Leaderboard.jsx
import { useEffect, useState } from 'react';
import { useParams }         from 'react-router-dom';
import api                   from '../api';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const { id } = useParams();    // this is the quizId from /leaderboard/:id
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // kick off the fetch
    api
      .get(`/results/leaderboard/${id}`)
      .then(res => setBoard(res.data))
      .catch(err => {
        console.error('Could not load leaderboard', err);
        setError(
          err.response?.data?.message
            || 'Unable to load leaderboard'
        );
      });
  }, [id]);

  if (error) 
    return <p className="error">{error}</p>;

  if (board === null)
    return <p>Loading leaderboard…</p>;

  if (!board.length)
    return <p>No attempts yet.</p>;

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Enrollment No</th>
            <th>Score</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {board.map((r, i) => {
            const dt = new Date(r.submittedAt);
            const date = dt.toLocaleDateString(); // e.g. "7/8/2025"
            const time = dt.toLocaleTimeString(undefined, {
              hour:   '2-digit',
              minute: '2-digit'
            }); // e.g. "8:24 PM"

            return (
              <tr key={`${r.enrollmentNo}-${i}`}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.enrollmentNo}</td>
                <td>{r.score}</td>
                <td>{date} {time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

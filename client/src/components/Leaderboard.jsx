// src/components/Leaderboard.jsx
import { useEffect, useState } from 'react';
import { useParams }           from 'react-router-dom';
import api                     from '../api';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const { id } = useParams();    // quizId
  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/results/leaderboard/${id}`)
       .then(res => setBoard(res.data))
       .catch(err => {
         console.error('Could not load leaderboard', err);
         setError(err.response?.data?.message || 'Unable to load leaderboard');
       });
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (board === null) return <p>Loading leaderboard…</p>;
  if (!board.length) return <p>No attempts yet.</p>;

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
            // notice we're using the lowercase column names:
            const dt = new Date(r.submittedat);
            const date = dt.toLocaleDateString();
            const time = dt.toLocaleTimeString(undefined, {
              hour: '2-digit', minute: '2-digit'
            });

            return (
              <tr key={`${r.enrollmentno}-${i}`}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.enrollmentno}</td>
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

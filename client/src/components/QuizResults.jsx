// src/components/QuizResults.jsx
import { useEffect, useState } from 'react';
import { useParams }           from 'react-router-dom';
import api                     from '../api';
import '../styles/Leaderboard.css';

export default function QuizResults() {
  const { id } = useParams();     // quizId
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/quizzes/${id}/results`)
       .then(res => setRows(res.data))
       .catch(() => setError('Unable to load results'));
  }, [id]);

  if (error)     return <p className="error">{error}</p>;
  if (rows === null) return <p>Loading results…</p>;
  if (!rows.length)  return <p>No submissions yet.</p>;

  return (
    <div className="leaderboard">
      <h2>Results for Quiz #{id}</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th><th>Name</th><th>Enrollment No</th>
            <th>Score</th><th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const dt   = new Date(r.submittedAt);
            const date = dt.toLocaleDateString();
            const time = dt.toLocaleTimeString(undefined, {
              hour: '2-digit', minute: '2-digit'
            });
            return (
              <tr key={`${r.enrollmentNo}-${i}`}>
                <td>{i+1}</td>
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

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function QuizResult() {
  const { id } = useParams(); // quiz id
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/results/${id}`)
      .then(res => {
        console.log('Result:', res.data);
        setResult(res.data);
      })
      .catch(err => {
        console.error('Failed to load result', err);
        setError('Could not fetch result.');
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!result) return <p>Loading result…</p>;

  const dt = new Date(result.submittedAt);
  const date = dt.toLocaleDateString();
  const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="quiz-result">
      <h2>Result: {result.quizTitle}</h2>
      <p><strong>Score:</strong> {result.score}</p>
      <p><strong>Completed at:</strong> {date} {time}</p>

      <Link to={`/leaderboard/${id}`}>
        <button>View Leaderboard</button>
      </Link>
    </div>
  );
}

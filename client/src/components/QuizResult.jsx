// src/components/QuizResult.jsx
import { useLocation, Link } from 'react-router-dom';

export default function QuizResult() {
  const { state } = useLocation();
  return (
    <div className="card">
      <h2>Your Score</h2>
      <p>{state.score} / {state.total}</p>
      <Link to={`/leaderboard/${state.quizId}`}><button className="btn-ghost">View Leaderboard</button></Link>
    </div>
  );
}

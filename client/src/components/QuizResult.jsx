import { useLocation, Link } from 'react-router-dom';
import '../styles/QuizResult.css';

export default function QuizResult() {     // singular
  const { state } = useLocation();
  return (
    <div className="card">
      <h2>Your Score</h2>
      <p className="result-score">
        {state.score} / {state.total}
      </p>
      <Link to={`/leaderboard/${state.quizId}`}>
        <button className="btn btn-ghost">View Leaderboard</button>
      </Link>
    </div>
  );
}

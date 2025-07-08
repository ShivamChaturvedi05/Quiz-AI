// src/components/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/StudentDashboard.css';

export default function StudentDashboard() {
  const [pending, setPending]     = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function fetchQuizzes() {
      setError(null);
      try {
        const res = await api.get('/quizzes/student');
        setPending(res.data.pending);
        setCompleted(res.data.completed);
      } catch (err) {
        console.error('Quiz load error:', err);
        setError('Could not load your quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  if (loading) return <p className="dashboard-loading">Loading quizzes…</p>;
  if (error)   return <p className="dashboard-error">{error}</p>;

  return (
    <div className="dashboard">
      <section className="dashboard-section">
        <h2>Pending Quizzes</h2>
        {pending.length > 0 ? (
          pending.map(q => (
            <div className="quiz-card" key={q.id}>
              <div className="quiz-info">
                <p className="quiz-title">{q.title}</p>
                <p className="quiz-meta">
                  Topic: <strong>{q.topic}</strong> · Difficulty: {q.difficulty}
                </p>
              </div>
              <Link to={`/take-quiz/${q.id}`}>
                <button className="btn btn-primary">Start Quiz</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="empty-text">You're all caught up! 🎉</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Completed Quizzes</h2>
        {completed.length > 0 ? (
          completed.map(q => (
            <div className="quiz-card" key={q.id}>
              <div className="quiz-info">
                <p className="quiz-title">{q.title}</p>
                <p className="quiz-meta">
                  Completed on{' '}
                  {new Date(q.completedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Link to={`/result/${q.id}`}>
                <button className="btn btn-ghost">View Result</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="empty-text">You haven’t completed any quizzes yet.</p>
        )}
      </section>
    </div>
  );
}

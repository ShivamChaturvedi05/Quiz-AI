import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/StudentDashboard.css';

export default function StudentDashboard() {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/students/${userId}/quizzes`);
        setPending(res.data.pending);
        setCompleted(res.data.completed);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      }
    }
    fetchData();
  }, [userId]);

  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <h2>Pending Quizzes</h2>
        {pending.length > 0 ? (
          pending.map(q => (
            <div className="quiz-card" key={q.id}>
              <div className="quiz-info">
                <p className="quiz-title">{q.title}</p>
                <p className="quiz-meta">Topic: {q.topic}</p>
              </div>
              <Link to={`/take-quiz/${q.id}`}>
                <button className="btn btn-primary">Start Quiz</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="empty-text">You're all caught up! 🎉</p>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Completed Quizzes</h2>
        {completed.length > 0 ? (
          completed.map(r => (
            <div className="quiz-card" key={r.id}>
              <div className="quiz-info">
                <p className="quiz-title">{r.title}</p>
                <p className="quiz-meta">Score: {r.score}</p>
              </div>
              <Link to={`/result/${r.id}`}>
                <button className="btn btn-ghost">View Result</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="empty-text">You haven’t completed any quizzes yet.</p>
        )}
      </div>
    </div>
  );
}

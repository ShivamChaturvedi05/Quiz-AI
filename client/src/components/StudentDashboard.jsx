// src/components/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:5000/api/quizzes/student', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuizzes(res.data.quizzes);
        setResults(res.data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  const completedQuizIds = results.map((r) => r.quiz_id);
  const pending = quizzes.filter((q) => !completedQuizIds.includes(q.id));
  const completed = quizzes.filter((q) => completedQuizIds.includes(q.id));

  return (
    <div className="student-dashboard">
      <h2>📚 Pending Quizzes</h2>
      {pending.length === 0 ? (
        <p className="status-msg">✅ All quizzes completed!</p>
      ) : (
        <ul>
          {pending.map((quiz) => (
            <li key={quiz.id} className="quiz-card">
              <div>
                <h3>{quiz.title}</h3>
                <p>Topic: {quiz.topic}</p>
                <p>Difficulty: {quiz.difficulty}</p>
              </div>
              <button
                className="primary-btn"
                onClick={() => navigate(`/take-quiz/${quiz.id}`)}
              >
                Take Quiz →
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>🏁 Completed Quizzes</h2>
      {completed.length === 0 ? (
        <p className="status-msg">🚫 None yet!</p>
      ) : (
        <ul>
          {completed.map((quiz) => (
            <li key={quiz.id} className="quiz-card">
              <div>
                <h3>{quiz.title}</h3>
                <p>Topic: {quiz.topic}</p>
                <p>Difficulty: {quiz.difficulty}</p>
              </div>
              <button
                className="secondary-btn"
                onClick={() => navigate(`/result/${quiz.id}`)}
              >
                View Result 📊
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

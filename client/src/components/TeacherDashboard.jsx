import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    api.get('/quizzes/teacher').then(res=>setQuizzes(res.data));
  }, []);
  return (
    <div>
      <h2>Your Quizzes</h2>
      <button className="btn btn-primary" onClick={()=>nav('/create-quiz')}>+ Create New Quiz</button>
      <ul>
        {quizzes.map(q=>(
          <li key={q.id} className="card">
            <h3>{q.title}</h3>
            <p>{q.topic} – {q.difficulty}</p>
            <button className="btn btn-ghost" onClick={()=>nav(`/quiz/${q.id}/results`)}>
              View Results
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

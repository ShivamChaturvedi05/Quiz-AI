import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import '../styles/Leaderboard.css'; // or QuizResults.css if you prefer

export default function QuizResults() {   // plural
  const { id } = useParams();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    api.get(`/quizzes/${id}/results`)
       .then(res => setBoard(res.data))
       .catch(console.error);
  }, [id]);

  return (
    <div className="leaderboard">
      <h2>Results for Quiz #{id}</h2>
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
          {board.map((r, i) => (
            <tr key={`${r.enrollment_no}-${i}`}>
              <td>{i + 1}</td>
              <td>{r.name}</td>
              <td>{r.enrollment_no}</td>
              <td>{r.score}</td>
              <td>{new Date(r.submitted_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

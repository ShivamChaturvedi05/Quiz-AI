// src/components/QuizTake.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function QuizTake() {
  const { id } = useParams();
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(r => setQuiz(r.data));
  }, [id]);

  const select = (qid, val) => setAnswers(a => ({ ...a, [qid]: val }));
  const submit = async () => {
    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    const res = await api.post(`/results/${id}/submit`, { answers: payload });
    nav(`/result/${id}`, { state: { score: res.data.score, total: quiz.totalQuestions, quizId: id } });
  };

  if (!quiz) return <p>Loading...</p>;
  return (
    <div>
      <h2>{quiz.title}</h2>
      {quiz.questions.map(q => (
        <div className="card" key={q.id}>
          <p>{q.questionText}</p>
          {q.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name={String(q.id)}
                value={opt}
                checked={answers[q.id]===opt}
                onChange={()=>select(q.id, opt)}
              /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button className="btn btn-primary" onClick={submit}>Submit</button>
    </div>
  );
}

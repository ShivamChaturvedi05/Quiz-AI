import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/QuizTake.css';

function Timer({ initialSeconds, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const id = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, onExpire]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return <div className="timer">{mm}:{ss}</div>;
}

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(0);

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(res => {
      setQuiz(res.data);
      timerRef.current = res.data.timer_seconds ?? 30 * 60;
    });
  }, [id]);

  const select = (qid, opt) =>
    setAnswers(a => ({ ...a, [qid]: opt }));

  const submitQuiz = async () => {
    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    const res = await api.post(`/results/${id}/submit`, { answers: payload });
    navigate(`/result/${id}`, {
      state: { score: res.data.score, total: quiz.totalQuestions, quizId: id }
    });
  };

  const handleExpire = () => submitQuiz();

  if (!quiz) return <p>Loading quiz…</p>;

  const question = quiz.questions[current];
  const isFirst = current === 0;
  const isLast  = current === quiz.questions.length - 1;

  return (
    <div className="quiz-take">
      <header>
        <h2>{quiz.title}</h2>
        <Timer initialSeconds={timerRef.current} onExpire={handleExpire}/>
      </header>

      <div className="question-card">
        <p className="question-number">
          {current + 1} / {quiz.questions.length}
        </p>
        <h3 className="question-text">{question.questionText}</h3>
        <ul className="options-list">
          {question.options.map(opt => (
            <li key={opt}>
              <label className={answers[question.id] === opt ? 'option selected' : 'option'}>
                <input
                  type="radio"
                  name={String(question.id)}
                  value={opt}
                  checked={answers[question.id] === opt}
                  onChange={() => select(question.id, opt)}
                />
                {opt}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <nav className="quiz-nav">
        <button className="btn btn-ghost" onClick={() => setCurrent(current - 1)} disabled={isFirst}>
          ← Prev
        </button>
        {isLast ? (
          <button className="btn btn-primary" onClick={submitQuiz}>
            Submit Quiz
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrent(current + 1)}>
            Next →
          </button>
        )}
      </nav>
    </div>
  );
}

// src/components/QuizForm.jsx
import { useState } from 'react';
import api from '../api';

export default function QuizForm() {
  const [form, setForm] = useState({
    title: '', topic: '', description: '', totalQuestions: 5, difficulty: 'Easy'
  });
  const [msg, setMsg] = useState('');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await api.post('/quizzes', form);
    setMsg(`Quiz created! ID: ${res.data.quizId}`);
  };

  return (
    <div className="card">
      <h2>Create Quiz</h2>
      {msg && <p className="success">{msg}</p>}
      <form onSubmit={handleSubmit}>
        {['title','topic','description'].map(f => (
          <div className="form-group" key={f}>
            <label>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
            <input name={f} value={form[f]} onChange={handleChange} required />
          </div>
        ))}
        <div className="form-group">
          <label>Number of Questions</label>
          <input
            type="number" name="totalQuestions" min="1"
            value={form.totalQuestions} onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange}>
            {['Easy','Medium','Hard'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Generate via AI</button>
      </form>
    </div>
  );
}

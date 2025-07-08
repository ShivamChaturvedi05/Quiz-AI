// src/components/QuizForm.jsx
import { useState } from 'react';
import api from '../api';

export default function QuizForm() {
  const [form, setForm] = useState({
    title: '',
    topic: '',
    description: '',
    totalQuestions: 5,
    difficulty: 'Medium',
    timerMinutes: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/quizzes', {
        title: form.title,
        topic: form.topic,
        description: form.description,
        totalQuestions: Number(form.totalQuestions),
        difficulty: form.difficulty,
        timerSeconds: Number(form.timerMinutes) * 60,
      });

      setSuccess(`Quiz created! ID: ${res.data.quizId}`);
    } catch (err) {
      // handle rate limit
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait a minute and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to create quiz.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Quiz</h2>
      {error   && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Topic */}
        <div className="form-group">
          <label>Topic</label>
          <input
            name="topic"
            value={form.topic}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Number of Questions */}
        <div className="form-group">
          <label>Number of Questions</label>
          <input
            type="number"
            name="totalQuestions"
            min="1"
            value={form.totalQuestions}
            onChange={handleChange}
            required
          />
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label>Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            {['Easy','Medium','Hard'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Timer */}
        <div className="form-group">
          <label>Timer (minutes)</label>
          <input
            type="number"
            name="timerMinutes"
            min="1"
            value={form.timerMinutes}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate via AI'}
        </button>
      </form>
    </div>
  );
}

// src/components/Auth/SignUp.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');           // 'teacher' or 'student'
  const [form, setForm] = useState({
    name: '', email: '', enrollmentNo: '', password: ''
  });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', {
        ...form,
        role
      });
      nav(`/login?role=${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="card">
      <h2>Sign Up as {role?.toUpperCase()}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        {role === 'student' && (
          <div className="form-group">
            <label>Enrollment No</label>
            <input name="enrollmentNo" value={form.enrollmentNo} onChange={handleChange} required />
          </div>
        )}
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <Link to={`/login?role=${role}`} className="btn-ghost">
          Login
        </Link>
      </p>
    </div>
  );
}

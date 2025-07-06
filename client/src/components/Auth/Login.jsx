// src/components/Auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { ...form, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);
      nav(res.data.role === 'teacher' ? '/teacher-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login as {role?.toUpperCase()}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don’t have an account?{' '}
        <Link to={`/signup?role=${role}`} className="btn-ghost">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

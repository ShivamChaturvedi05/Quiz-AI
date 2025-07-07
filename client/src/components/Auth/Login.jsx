import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';

export default function Login() {
  const [search] = useSearchParams();
  const role = search.get('role');
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { ...form, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);
      // Reload app to reflect role immediately
      window.location.href = res.data.role === 'teacher' ? '/teacher-dashboard' : '/dashboard';
    } catch (err) {
      setErr(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <div className="card">
      <h2>Login as {role}</h2>
      {err && <p className="error">{err}</p>}
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handle} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handle} required />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
      <p>
        Don’t have an account?{' '}
        <Link to={`/signup?role=${role}`} className="btn-ghost">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const nav   = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav('/');
  };

  return (
    <nav className="navbar">
      <Link to="/">Quiz AI</Link>
      {token ? (
        <>
          {role === 'teacher'
            ? <Link to="/teacher-dashboard">Teacher</Link>
            : <Link to="/dashboard">Student</Link>}
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </>
      ) : null}
    </nav>
  );
}

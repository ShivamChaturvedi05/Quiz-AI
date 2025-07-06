import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const nav   = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav('/home');  // go back to role selector
  };

  return (
    <nav className="navbar">
      <Link to="/home">Quiz AI</Link>

      {token ? (
        <>
          {role === 'teacher'
            ? <Link to="/teacher-dashboard">Teacher</Link>
            : <Link to="/dashboard">Student</Link>
          }
          <button className="btn-ghost" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/home" className="btn-ghost">
          Switch Role
        </Link>
      )}
    </nav>
  );
}

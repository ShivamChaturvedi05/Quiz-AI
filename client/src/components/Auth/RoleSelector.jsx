// src/components/Auth/RoleSelector.jsx
import { useNavigate } from 'react-router-dom';

export default function RoleSelector() {
  const nav = useNavigate();
  return (
    <div className="card">
      <h2>Select your role</h2>
      <button className="btn btn-primary" onClick={() => nav('/signup?role=teacher')}>
        I am a Teacher
      </button>
      <button className="btn btn-primary" onClick={() => nav('/signup?role=student')}>
        I am a Student
      </button>
    </div>
  );
}

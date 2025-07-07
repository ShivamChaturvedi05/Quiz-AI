import { useNavigate } from 'react-router-dom';
export default function RoleSelector() {
  const nav = useNavigate();
  return (
    <div className="card">
      <h2>Select Role</h2>
      <button className="btn btn-primary" onClick={()=>nav('/signup?role=teacher')}>Teacher</button>
      <button className="btn btn-primary" onClick={()=>nav('/signup?role=student')}>Student</button>
    </div>
  );
}

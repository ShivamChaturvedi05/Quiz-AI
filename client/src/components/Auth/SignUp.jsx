import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';
export default function SignUp() {
  const [search] = useSearchParams();
  const role = search.get('role');
  const [form,set] = useState({name:'',email:'',enrollmentNo:'',password:''});
  const [err,setErr] = useState('');
  const nav=useNavigate();
  const handle = e=> set({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();try{
    await api.post('/auth/signup',{...form,role});
    nav(`/login?role=${role}`);
  }catch(err){setErr(err.response?.data?.message||'Error');}};
  return (
    <div className="card">
      <h2>Sign Up as {role}</h2>
      {err&&<p className="error">{err}</p>}
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handle} required/>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handle} required/>
        </div>
        {role==='student'&&(
          <div className="form-group">
            <label>Enrollment No</label>
            <input name="enrollmentNo" value={form.enrollmentNo} onChange={handle} required/>
          </div>
        )}
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handle} required/>
        </div>
        <button className="btn btn-primary">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to={`/login?role=${role}`} className="btn-ghost">Login</Link>
      </p>
    </div>
  );
}

import { useState } from 'react';
import api from '../api';
export default function QuizForm() {
  const [form,set]=useState({
    title:'',topic:'',description:'',totalQuestions:5,difficulty:'Easy',timerMinutes:30
  });
  const [msg,setMsg]=useState('');
  const handle=e=>set({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();
    const res = await api.post('/quizzes', {
      ...form,
      timerMinutes: Number(form.timerMinutes)
    });
    setMsg(`Quiz created! ID: ${res.data.quizId}`);
  };
  return (
    <div className="card">
      <h2>Create Quiz</h2>
      {msg && <p className="success">{msg}</p>}
      <form onSubmit={submit}>
        {['title','topic','description'].map(f=>(
          <div className="form-group" key={f}>
            <label>{f}</label>
            <input name={f} value={form[f]} onChange={handle} required/>
          </div>
        ))}
        <div className="form-group">
          <label>Number of Questions</label>
          <input type="number" name="totalQuestions" min="1" value={form.totalQuestions} onChange={handle}/>
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handle}>
            {['Easy','Medium','Hard'].map(d=> <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Timer (minutes)</label>
          <input type="number" name="timerMinutes" min="1" value={form.timerMinutes} onChange={handle}/>
        </div>
        <button className="btn btn-primary">Generate via AI</button>
      </form>
    </div>
  );
}

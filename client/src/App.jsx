// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar           from './components/Navbar';
import RoleSelector     from './components/Auth/RoleSelector';
import SignUp           from './components/Auth/SignUp';
import Login            from './components/Auth/Login';
import QuizForm         from './components/QuizForm';
import StudentDashboard from './components/StudentDashboard';
import QuizTake         from './components/QuizTake';
import QuizResult       from './components/QuizResult';
import Leaderboard      from './components/Leaderboard';

export default function App() {
  const isAuth = Boolean(localStorage.getItem('token'));
  const role   = localStorage.getItem('role'); // should be 'student' or 'teacher'

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Role picker at root */}
          <Route path="/"     element={<RoleSelector />} />
          <Route path="/home" element={<RoleSelector />} />

          {/* Sign up / Login with ?role=student|teacher */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login"  element={<Login />} />

          {/* Teacher dashboard */}
          <Route
            path="/teacher-dashboard"
            element={
              isAuth && role === 'teacher'
                ? <QuizForm />
                : <Navigate to="/home" replace />
            }
          />

          {/* Student dashboard */}
          <Route
            path="/dashboard"
            element={
              isAuth && role === 'student'
                ? <StudentDashboard />
                : <Navigate to="/home" replace />
            }
          />

          {/* Student quiz-taking */}
          <Route
            path="/take-quiz/:id"
            element={
              isAuth && role === 'student'
                ? <QuizTake />
                : <Navigate to="/login?role=student" replace />
            }
          />
          <Route
            path="/result/:id"
            element={
              isAuth && role === 'student'
                ? <QuizResult />
                : <Navigate to="/login?role=student" replace />
            }
          />

          {/* Leaderboard (any logged-in user) */}
          <Route
            path="/leaderboard/:id"
            element={
              isAuth
                ? <Leaderboard />
                : <Navigate to="/login" replace />
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoleSelector from './components/Auth/RoleSelector';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import TeacherDashboard from './components/TeacherDashboard';
import QuizForm from './components/QuizForm';
import QuizResults from './components/QuizResults';
import StudentDashboard from './components/StudentDashboard';
import QuizTake from './components/QuizTake';
import QuizResult from './components/QuizResult';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      setIsAuth(!!token);
      setRole(storedRole?.toLowerCase());
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              isAuth
                ? <Navigate to={role === 'teacher' ? '/teacher-dashboard' : '/dashboard'} />
                : <RoleSelector />
            }
          />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Teacher Routes */}
          <Route
            path="/teacher-dashboard"
            element={
              isAuth && role === 'teacher'
                ? <TeacherDashboard />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/create-quiz"
            element={
              isAuth && role === 'teacher'
                ? <QuizForm />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/quiz/:id/results"
            element={
              isAuth && role === 'teacher'
                ? <QuizResults />
                : <Navigate to="/" replace />
            }
          />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              isAuth && role === 'student'
                ? <StudentDashboard />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/take-quiz/:id"
            element={
              isAuth && role === 'student'
                ? <QuizTake />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/result/:id"
            element={
              isAuth && role === 'student'
                ? <QuizResult />
                : <Navigate to="/" replace />
            }
          />

          {/* Shared */}
          <Route
            path="/leaderboard/:id"
            element={
              isAuth
                ? <Leaderboard />
                : <Navigate to="/login" replace />
            }
          />

          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </div>
    </>
  );
}

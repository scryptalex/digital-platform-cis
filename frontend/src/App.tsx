import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/Home';
import { LoginPage, RegisterPage } from './pages/Auth';
import { CalendarPage } from './pages/Calendar';
import type { ReactNode } from 'react';
import './App.css';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/my-events" element={
        <ProtectedRoute>
          <CalendarPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <footer className="footer">
            <p>© 2026 Экономический форум СНГ. Все права защищены.</p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

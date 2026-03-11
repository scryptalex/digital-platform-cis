import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">Форум СНГ</span>
        </Link>

        <div className="navbar-links">
          <Link to="/calendar">Календарь</Link>
          <Link to="/discussions">Дискуссии</Link>
          <Link to="/forum">Бизнес-форум</Link>
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="user-name">{user?.name}</span>
              <button onClick={handleLogout} className="btn-outline">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Войти</Link>
              <Link to="/register" className="btn-primary">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Цифровая платформа<br />Экономического форума СНГ</h1>
          <p>
            Единое пространство для экономического сотрудничества, 
            обмена знаниями и развития интеграционных проектов
            государств-участников СНГ
          </p>
          <div className="hero-actions">
            <Link to="/calendar" className="btn-primary">Календарь событий</Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-secondary">Регистрация</Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Возможности платформы</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Календарь событий</h3>
            <p>Актуальная информация о форумах, конференциях и выставках стран СНГ</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Дискуссионная площадка</h3>
            <p>Онлайн и офлайн обсуждения, круглые столы, семинары</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏦</div>
            <h3>Банковско-экономический форум</h3>
            <p>Поиск инвесторов, партнёров и финансирования проектов</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Экспертное сообщество</h3>
            <p>Консультации и экспертизы от ведущих специалистов СНГ</p>
          </div>
        </div>
      </section>

      <section className="countries">
        <h2>Государства-участники</h2>
        <div className="countries-list">
          {['Россия', 'Беларусь', 'Казахстан', 'Армения', 'Азербайджан', 
            'Кыргызстан', 'Молдова', 'Таджикистан', 'Узбекистан'].map(country => (
            <span key={country} className="country-badge">{country}</span>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Присоединяйтесь к сообществу</h2>
        <p>Станьте частью единого экономического пространства СНГ</p>
        {!isAuthenticated ? (
          <Link to="/register" className="btn-primary">Зарегистрироваться</Link>
        ) : (
          <Link to="/calendar" className="btn-primary">Смотреть события</Link>
        )}
      </section>
    </div>
  );
};

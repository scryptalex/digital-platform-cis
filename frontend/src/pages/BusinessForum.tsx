import { useState, useEffect } from 'react';
import { businessApi, type BusinessProject } from '../api';

export const BusinessForumPage = () => {
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<{ sector?: string; country?: string }>({});

  const sectors = [
    { value: 'logistics', label: 'Логистика', icon: '🚛' },
    { value: 'energy', label: 'Энергетика', icon: '⚡' },
    { value: 'technology', label: 'Технологии', icon: '💻' },
    { value: 'agriculture', label: 'Сельское хозяйство', icon: '🌾' },
    { value: 'tourism', label: 'Туризм', icon: '✈️' },
    { value: 'pharma', label: 'Фармацевтика', icon: '💊' },
    { value: 'manufacturing', label: 'Производство', icon: '🏭' },
  ];

  const countries = [
    'Россия', 'Беларусь', 'Казахстан', 'Армения', 'Азербайджан',
    'Кыргызстан', 'Молдова', 'Таджикистан', 'Туркменистан', 'Узбекистан'
  ];

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await businessApi.getAll(filters);
      setProjects(data);
    } catch {
      setError('Ошибка загрузки проектов');
    } finally {
      setIsLoading(false);
    }
  };

  const formatInvestment = (amount: string, currency: string) => {
    const num = parseInt(amount);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)} млн ${currency}`;
    }
    return `${num.toLocaleString()} ${currency}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getSectorInfo = (sector: string) => {
    return sectors.find(s => s.value === sector) || { label: sector, icon: '📊' };
  };

  return (
    <div className="business-page">
      <header className="page-header">
        <h1>Бизнес-форум СНГ</h1>
        <p>Инвестиционные проекты и бизнес-возможности государств-участников</p>
      </header>

      <div className="filters-section">
        <div className="filter-group">
          <label>Отрасль</label>
          <select
            value={filters.sector || ''}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value || undefined })}
          >
            <option value="">Все отрасли</option>
            {sectors.map(s => (
              <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Страна</label>
          <select
            value={filters.country || ''}
            onChange={(e) => setFilters({ ...filters, country: e.target.value || undefined })}
          >
            <option value="">Все страны</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="loading">Загрузка проектов...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="projects-grid">
        {projects.map(project => {
          const sectorInfo = getSectorInfo(project.sector);
          return (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <span className="sector-badge">
                  {sectorInfo.icon} {sectorInfo.label}
                </span>
                <span className="country-badge">🌍 {project.country}</span>
              </div>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-investment">
                <span className="investment-label">Требуемые инвестиции:</span>
                <span className="investment-amount">
                  {formatInvestment(project.investment_required, project.investment_currency || 'USD')}
                </span>
              </div>
              <div className="project-meta">
                <div className="company-info">
                  <span className="company-name">🏢 {project.company_name}</span>
                </div>
                <div className="project-stats">
                  <span className="stat">👁 {project.views_count}</span>
                  <span className="stat">📅 {formatDate(project.created_at)}</span>
                </div>
              </div>
              <div className="project-actions">
                <button className="btn-primary">Связаться</button>
                <button className="btn-secondary">Подробнее</button>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && projects.length === 0 && (
        <div className="no-events">
          <p>Проекты не найдены</p>
          <p>Попробуйте изменить фильтры поиска</p>
        </div>
      )}
    </div>
  );
};

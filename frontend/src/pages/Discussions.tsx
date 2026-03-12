import { useState, useEffect } from 'react';
import { discussionsApi, type Discussion } from '../api';

export const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: 'economy', label: 'Экономика', icon: '💰' },
    { value: 'legal', label: 'Законодательство', icon: '⚖️' },
    { value: 'transport', label: 'Транспорт', icon: '🚛' },
    { value: 'energy', label: 'Энергетика', icon: '⚡' },
    { value: 'education', label: 'Образование', icon: '🎓' },
    { value: 'agriculture', label: 'Сельское хозяйство', icon: '🌾' },
    { value: 'technology', label: 'Технологии', icon: '💻' },
    { value: 'finance', label: 'Финансы', icon: '🏦' },
  ];

  useEffect(() => {
    loadDiscussions();
  }, [selectedCategory]);

  const loadDiscussions = async () => {
    setIsLoading(true);
    try {
      const data = await discussionsApi.getAll(selectedCategory || undefined);
      setDiscussions(data);
    } catch {
      setError('Ошибка загрузки дискуссий');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || { label: category, icon: '📌' };
  };

  return (
    <div className="discussions-page">
      <header className="page-header">
        <h1>Дискуссии СНГ</h1>
        <p>Обсуждение актуальных вопросов сотрудничества государств-участников</p>
      </header>

      <div className="filters-section">
        <div className="category-tabs">
          <button
            className={`category-tab ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Все темы
          </button>
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`category-tab ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="loading">Загрузка дискуссий...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="discussions-list">
        {discussions.map(disc => {
          const catInfo = getCategoryInfo(disc.category);
          return (
            <div key={disc.id} className={`discussion-card ${disc.is_pinned ? 'pinned' : ''}`}>
              {disc.is_pinned && <div className="pin-badge">📌 Закреплено</div>}
              <div className="discussion-content">
                <div className="discussion-header">
                  <span className="category-badge">
                    {catInfo.icon} {catInfo.label}
                  </span>
                </div>
                <h3>{disc.title}</h3>
                <p className="discussion-text">{disc.content}</p>
                <div className="discussion-meta">
                  <div className="author-info">
                    <span className="author-name">{disc.author_name || 'Администратор'}</span>
                    {disc.author_org && <span className="author-org">• {disc.author_org}</span>}
                  </div>
                  <div className="discussion-stats">
                    <span className="stat">👁 {disc.views_count}</span>
                    <span className="stat">💬 {disc.replies_count}</span>
                    <span className="stat">📅 {formatDate(disc.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="discussion-actions">
                <button className="btn-secondary">Читать далее</button>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && discussions.length === 0 && (
        <div className="no-events">
          <p>Дискуссии не найдены</p>
          <p>Попробуйте выбрать другую категорию</p>
        </div>
      )}
    </div>
  );
};

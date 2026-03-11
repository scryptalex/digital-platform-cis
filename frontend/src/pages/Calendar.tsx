import { useState, useEffect } from 'react';
import { eventsApi } from '../api';
import type { Event, EventFilters } from '../types';
import { useAuth } from '../context/AuthContext';

export const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<EventFilters>({});
  const { isAuthenticated } = useAuth();

  const eventTypes = [
    { value: 'forum', label: 'Форум' },
    { value: 'conference', label: 'Конференция' },
    { value: 'exhibition', label: 'Выставка' },
    { value: 'seminar', label: 'Семинар' },
    { value: 'roundtable', label: 'Круглый стол' }
  ];

  const countries = [
    'Россия', 'Беларусь', 'Казахстан', 'Армения', 'Азербайджан',
    'Кыргызстан', 'Молдова', 'Таджикистан', 'Туркменистан', 'Узбекистан'
  ];

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventsApi.getAll(filters);
      setEvents(data);
    } catch {
      setError('Ошибка загрузки событий');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      await eventsApi.register(eventId);
      loadEvents();
    } catch {
      alert('Ошибка регистрации');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      upcoming: { class: 'badge-upcoming', label: 'Предстоит' },
      ongoing: { class: 'badge-ongoing', label: 'Идёт' },
      completed: { class: 'badge-completed', label: 'Завершено' },
      cancelled: { class: 'badge-cancelled', label: 'Отменено' }
    };
    return badges[status] || { class: '', label: status };
  };

  return (
    <div className="calendar-page">
      <header className="page-header">
        <h1>Календарь событий СНГ</h1>
        <p>Форумы, конференции и выставки государств-участников СНГ</p>
      </header>

      <div className="filters-section">
        <div className="filter-group">
          <label>Тип события</label>
          <select 
            value={filters.event_type || ''} 
            onChange={(e) => setFilters({...filters, event_type: e.target.value || undefined})}
          >
            <option value="">Все типы</option>
            {eventTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Страна</label>
          <select 
            value={filters.country || ''} 
            onChange={(e) => setFilters({...filters, country: e.target.value || undefined})}
          >
            <option value="">Все страны</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Дата от</label>
          <input 
            type="date" 
            value={filters.start_date || ''} 
            onChange={(e) => setFilters({...filters, start_date: e.target.value || undefined})}
          />
        </div>
      </div>

      {isLoading && <div className="loading">Загрузка событий...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="events-grid">
        {events.map(event => {
          const status = getStatusBadge(event.status);
          return (
            <div key={event.id} className="event-card">
              {event.image_url && (
                <img src={event.image_url} alt={event.title} className="event-image" />
              )}
              <div className="event-content">
                <div className="event-header">
                  <span className={`badge ${status.class}`}>{status.label}</span>
                  {event.is_online && <span className="badge badge-online">Онлайн</span>}
                </div>
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <div className="meta-item">
                    <span className="icon">📅</span>
                    {formatDate(event.start_date)}
                  </div>
                  {event.location && (
                    <div className="meta-item">
                      <span className="icon">📍</span>
                      {event.location}, {event.country}
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="meta-item">
                      <span className="icon">👥</span>
                      {event.registered_count || 0} / {event.max_participants}
                    </div>
                  )}
                </div>
                <div className="event-actions">
                  {isAuthenticated && event.status === 'upcoming' && (
                    <button 
                      className="btn-primary"
                      onClick={() => handleRegister(event.id)}
                    >
                      Зарегистрироваться
                    </button>
                  )}
                  <button className="btn-secondary">Подробнее</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && events.length === 0 && (
        <div className="no-events">
          <p>События не найдены</p>
          <p>Попробуйте изменить фильтры поиска</p>
        </div>
      )}
    </div>
  );
};

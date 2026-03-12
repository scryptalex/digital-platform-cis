import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initDatabase, getPool } from './config/database';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/events';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), port: PORT });
});

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const pool = getPool();
    
    // Create test users
    const testUsers = [
      { email: 'admin@cis-forum.org', password: 'admin123', name: 'Администратор СНГ', role: 'admin' },
      { email: 'ivanov@russia.gov', password: 'test123', name: 'Иванов Сергей Петрович', role: 'delegate' },
      { email: 'petrov@belarus.gov', password: 'test123', name: 'Петров Алексей Николаевич', role: 'delegate' },
      { email: 'expert@cis-forum.org', password: 'test123', name: 'Сидорова Мария Владимировна', role: 'expert' },
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        `INSERT INTO users (email, password, name, role) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO UPDATE SET name = $3, role = $4`,
        [user.email, hashedPassword, user.name, user.role]
      );
    }

    // Create test events
    const testEvents = [
      { title: 'Международный экономический форум СНГ 2026', description: 'Ежегодный форум глав государств и правительств стран СНГ.', start_date: '2026-04-15 09:00', end_date: '2026-04-17 18:00', location: 'Москва, Россия', event_type: 'forum', country: 'Россия' },
      { title: 'Банковско-финансовый саммит СНГ', description: 'Встреча руководителей центральных банков и финансовых институтов.', start_date: '2026-04-20 10:00', end_date: '2026-04-21 17:00', location: 'Минск, Беларусь', event_type: 'summit', country: 'Беларусь' },
      { title: 'Выставка промышленных технологий ТехноСНГ', description: 'Демонстрация передовых промышленных технологий стран-участниц.', start_date: '2026-05-10 09:00', end_date: '2026-05-14 18:00', location: 'Астана, Казахстан', event_type: 'exhibition', country: 'Казахстан' },
      { title: 'Конференция по цифровой трансформации', description: 'Обмен опытом в области цифровизации государственных услуг.', start_date: '2026-05-25 10:00', end_date: '2026-05-26 16:00', location: 'Ереван, Армения', event_type: 'conference', country: 'Армения' },
      { title: 'Круглый стол: Энергетическое сотрудничество', description: 'Дискуссия экспертов по вопросам энергетической безопасности.', start_date: '2026-06-05 11:00', end_date: '2026-06-05 17:00', location: 'Баку, Азербайджан', event_type: 'roundtable', country: 'Азербайджан' },
      { title: 'Форум молодых предпринимателей СНГ', description: 'Площадка для молодых бизнесменов: питч-сессии, менторство.', start_date: '2026-06-15 09:00', end_date: '2026-06-17 18:00', location: 'Бишкек, Кыргызстан', event_type: 'forum', country: 'Кыргызстан' },
      { title: 'Агропромышленная выставка СНГ', description: 'Крупнейшая выставка сельскохозяйственной продукции.', start_date: '2026-07-01 09:00', end_date: '2026-07-05 18:00', location: 'Кишинёв, Молдова', event_type: 'exhibition', country: 'Молдова' },
      { title: 'Семинар по таможенному регулированию', description: 'Обучающий семинар для специалистов таможенных служб.', start_date: '2026-07-10 10:00', end_date: '2026-07-11 16:00', location: 'Душанбе, Таджикистан', event_type: 'seminar', country: 'Таджикистан' },
      { title: 'Инвестиционный форум СНГ-Инвест', description: 'Презентация инвестиционных проектов стран СНГ.', start_date: '2026-08-20 09:00', end_date: '2026-08-22 18:00', location: 'Ташкент, Узбекистан', event_type: 'forum', country: 'Узбекистан' },
      { title: 'Конференция по транспортной логистике', description: 'Развитие транспортных коридоров, мультимодальные перевозки.', start_date: '2026-09-05 10:00', end_date: '2026-09-06 17:00', location: 'Москва, Россия', event_type: 'conference', country: 'Россия' },
      { title: 'IT-саммит стран СНГ', description: 'Встреча лидеров IT-индустрии. Искусственный интеллект, блокчейн.', start_date: '2026-09-20 09:00', end_date: '2026-09-21 18:00', location: 'Минск, Беларусь', event_type: 'summit', country: 'Беларусь' },
      { title: 'Культурный форум народов СНГ', description: 'Фестиваль культуры и искусства. Выставки, концерты.', start_date: '2026-10-10 10:00', end_date: '2026-10-12 20:00', location: 'Астана, Казахстан', event_type: 'forum', country: 'Казахстан' },
      { title: 'Экологический саммит СНГ', description: 'Обсуждение экологических проблем региона.', start_date: '2026-10-25 10:00', end_date: '2026-10-26 17:00', location: 'Ереван, Армения', event_type: 'summit', country: 'Армения' },
      { title: 'Заседание Совета глав государств СНГ', description: 'Итоговое заседание года.', start_date: '2026-12-10 10:00', end_date: '2026-12-11 18:00', location: 'Санкт-Петербург, Россия', event_type: 'summit', country: 'Россия' },
    ];

    for (const event of testEvents) {
      await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, event_type, country, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'upcoming')
         ON CONFLICT DO NOTHING`,
        [event.title, event.description, event.start_date, event.end_date, event.location, event.event_type, event.country]
      );
    }

    res.json({ success: true, message: 'Database seeded with test data' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    // Continue without database for now
  }
  
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
  });
};

startServer();

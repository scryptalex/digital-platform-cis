import { getPool } from '../config/database';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  const pool = getPool();
  
  console.log('Seeding database...');

  // Create test users
  const testUsers = [
    { email: 'admin@cis-forum.org', password: 'admin123', name: 'Администратор СНГ', role: 'admin' },
    { email: 'ivanov@russia.gov', password: 'test123', name: 'Иванов Сергей Петрович', role: 'delegate' },
    { email: 'petrov@belarus.gov', password: 'test123', name: 'Петров Алексей Николаевич', role: 'delegate' },
    { email: 'nazarbayev@kazakhstan.gov', password: 'test123', name: 'Назарбаева Айгуль Кайратовна', role: 'expert' },
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
  console.log('Users created');

  // Create test events
  const testEvents = [
    {
      title: 'Международный экономический форум СНГ 2026',
      description: 'Ежегодный форум глав государств и правительств стран СНГ. Обсуждение стратегических направлений экономического сотрудничества, подписание межгосударственных соглашений.',
      start_date: '2026-04-15 09:00:00',
      end_date: '2026-04-17 18:00:00',
      location: 'Москва, Россия',
      event_type: 'forum',
      country: 'Россия'
    },
    {
      title: 'Банковско-финансовый саммит СНГ',
      description: 'Встреча руководителей центральных банков и финансовых институтов. Темы: цифровые валюты, межбанковские расчёты, инвестиционное сотрудничество.',
      start_date: '2026-04-20 10:00:00',
      end_date: '2026-04-21 17:00:00',
      location: 'Минск, Беларусь',
      event_type: 'summit',
      country: 'Беларусь'
    },
    {
      title: 'Выставка промышленных технологий «ТехноСНГ»',
      description: 'Демонстрация передовых промышленных технологий стран-участниц. Более 200 экспонентов, B2B встречи, презентации инновационных проектов.',
      start_date: '2026-05-10 09:00:00',
      end_date: '2026-05-14 18:00:00',
      location: 'Астана, Казахстан',
      event_type: 'exhibition',
      country: 'Казахстан'
    },
    {
      title: 'Конференция по цифровой трансформации',
      description: 'Обмен опытом в области цифровизации государственных услуг, электронного правительства и кибербезопасности.',
      start_date: '2026-05-25 10:00:00',
      end_date: '2026-05-26 16:00:00',
      location: 'Ереван, Армения',
      event_type: 'conference',
      country: 'Армения'
    },
    {
      title: 'Круглый стол: Энергетическое сотрудничество',
      description: 'Дискуссия экспертов по вопросам энергетической безопасности, совместных проектов в нефтегазовой сфере и возобновляемой энергетике.',
      start_date: '2026-06-05 11:00:00',
      end_date: '2026-06-05 17:00:00',
      location: 'Баку, Азербайджан',
      event_type: 'roundtable',
      country: 'Азербайджан'
    },
    {
      title: 'Форум молодых предпринимателей СНГ',
      description: 'Площадка для молодых бизнесменов: питч-сессии, менторство, нетворкинг. Гранты для лучших стартапов.',
      start_date: '2026-06-15 09:00:00',
      end_date: '2026-06-17 18:00:00',
      location: 'Бишкек, Кыргызстан',
      event_type: 'forum',
      country: 'Кыргызстан'
    },
    {
      title: 'Агропромышленная выставка СНГ',
      description: 'Крупнейшая выставка сельскохозяйственной продукции и технологий. Дегустации, заключение контрактов, обмен опытом.',
      start_date: '2026-07-01 09:00:00',
      end_date: '2026-07-05 18:00:00',
      location: 'Кишинёв, Молдова',
      event_type: 'exhibition',
      country: 'Молдова'
    },
    {
      title: 'Семинар по таможенному регулированию',
      description: 'Обучающий семинар для специалистов таможенных служб. Гармонизация процедур, электронное декларирование.',
      start_date: '2026-07-10 10:00:00',
      end_date: '2026-07-11 16:00:00',
      location: 'Душанбе, Таджикистан',
      event_type: 'seminar',
      country: 'Таджикистан'
    },
    {
      title: 'Инвестиционный форум «СНГ-Инвест»',
      description: 'Презентация инвестиционных проектов стран СНГ. Встречи с международными инвесторами, подписание меморандумов.',
      start_date: '2026-08-20 09:00:00',
      end_date: '2026-08-22 18:00:00',
      location: 'Ташкент, Узбекистан',
      event_type: 'forum',
      country: 'Узбекистан'
    },
    {
      title: 'Конференция по транспортной логистике',
      description: 'Развитие транспортных коридоров, мультимодальные перевозки, цифровизация логистики.',
      start_date: '2026-09-05 10:00:00',
      end_date: '2026-09-06 17:00:00',
      location: 'Москва, Россия',
      event_type: 'conference',
      country: 'Россия'
    },
    {
      title: 'IT-саммит стран СНГ',
      description: 'Встреча лидеров IT-индустрии. Искусственный интеллект, блокчейн, кибербезопасность в государственном секторе.',
      start_date: '2026-09-20 09:00:00',
      end_date: '2026-09-21 18:00:00',
      location: 'Минск, Беларусь',
      event_type: 'summit',
      country: 'Беларусь'
    },
    {
      title: 'Культурный форум народов СНГ',
      description: 'Фестиваль культуры и искусства. Выставки, концерты, мастер-классы традиционных ремёсел.',
      start_date: '2026-10-10 10:00:00',
      end_date: '2026-10-12 20:00:00',
      location: 'Астана, Казахстан',
      event_type: 'forum',
      country: 'Казахстан'
    },
    {
      title: 'Экологический саммит СНГ',
      description: 'Обсуждение экологических проблем региона. Совместные программы по охране окружающей среды.',
      start_date: '2026-10-25 10:00:00',
      end_date: '2026-10-26 17:00:00',
      location: 'Ереван, Армения',
      event_type: 'summit',
      country: 'Армения'
    },
    {
      title: 'Ежегодное заседание Совета глав государств СНГ',
      description: 'Итоговое заседание года. Подведение итогов, утверждение планов на следующий год.',
      start_date: '2026-12-10 10:00:00',
      end_date: '2026-12-11 18:00:00',
      location: 'Санкт-Петербург, Россия',
      event_type: 'summit',
      country: 'Россия'
    }
  ];

  for (const event of testEvents) {
    await pool.query(
      `INSERT INTO events (title, description, start_date, end_date, location, event_type, country, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'upcoming')
       ON CONFLICT DO NOTHING`,
      [event.title, event.description, event.start_date, event.end_date, event.location, event.event_type, event.country]
    );
  }
  console.log('Events created');

  console.log('Seed completed!');
  process.exit(0);
};

seedDatabase().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

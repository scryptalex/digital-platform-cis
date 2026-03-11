import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { country, event_type, status, start_date, end_date } = req.query;
    
    let query = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (country) {
      query += ` AND country = $${paramIndex++}`;
      params.push(country);
    }
    if (event_type) {
      query += ` AND event_type = $${paramIndex++}`;
      params.push(event_type);
    }
    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (start_date) {
      query += ` AND start_date >= $${paramIndex++}`;
      params.push(start_date);
    }
    if (end_date) {
      query += ` AND end_date <= $${paramIndex++}`;
      params.push(end_date);
    }

    query += ' ORDER BY start_date ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Ошибка получения событий' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT e.*, u.name as organizer_name, u.organization as organizer_org,
       (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as registered_count
       FROM events e 
       LEFT JOIN users u ON e.organizer_id = u.id 
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Ошибка получения события' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { 
      title, description, event_type, start_date, end_date, 
      location, is_online, online_link, country, max_participants, image_url 
    } = req.body;

    const result = await pool.query(
      `INSERT INTO events 
       (title, description, event_type, start_date, end_date, location, is_online, online_link, organizer_id, country, max_participants, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [title, description, event_type, start_date, end_date, location, is_online, online_link, userId, country, max_participants, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Ошибка создания события' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    const { 
      title, description, event_type, start_date, end_date, 
      location, is_online, online_link, country, max_participants, image_url, status 
    } = req.body;

    // Check ownership or admin
    const eventCheck = await pool.query('SELECT organizer_id FROM events WHERE id = $1', [id]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }
    if (eventCheck.rows[0].organizer_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Нет прав на редактирование' });
    }

    const result = await pool.query(
      `UPDATE events SET 
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       event_type = COALESCE($3, event_type),
       start_date = COALESCE($4, start_date),
       end_date = COALESCE($5, end_date),
       location = COALESCE($6, location),
       is_online = COALESCE($7, is_online),
       online_link = COALESCE($8, online_link),
       country = COALESCE($9, country),
       max_participants = COALESCE($10, max_participants),
       image_url = COALESCE($11, image_url),
       status = COALESCE($12, status),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [title, description, event_type, start_date, end_date, location, is_online, online_link, country, max_participants, image_url, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Ошибка обновления события' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const eventCheck = await pool.query('SELECT organizer_id FROM events WHERE id = $1', [id]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }
    if (eventCheck.rows[0].organizer_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Нет прав на удаление' });
    }

    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Событие удалено' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Ошибка удаления события' });
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    // Check if event exists and has capacity
    const event = await pool.query(
      `SELECT max_participants, 
       (SELECT COUNT(*) FROM event_registrations WHERE event_id = $1) as registered_count
       FROM events WHERE id = $1`,
      [id]
    );

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    if (event.rows[0].max_participants && 
        event.rows[0].registered_count >= event.rows[0].max_participants) {
      return res.status(400).json({ error: 'Все места заняты' });
    }

    const result = await pool.query(
      `INSERT INTO event_registrations (event_id, user_id) 
       VALUES ($1, $2) 
       ON CONFLICT (event_id, user_id) DO NOTHING
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Вы уже зарегистрированы' });
    }

    res.status(201).json({ message: 'Регистрация успешна', registration: result.rows[0] });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ error: 'Ошибка регистрации на событие' });
  }
};

export const unregisterFromEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const result = await pool.query(
      'DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Регистрация не найдена' });
    }

    res.json({ message: 'Регистрация отменена' });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({ error: 'Ошибка отмены регистрации' });
  }
};

export const getMyEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const result = await pool.query(
      `SELECT e.*, er.registered_at, er.status as registration_status
       FROM events e
       JOIN event_registrations er ON e.id = er.event_id
       WHERE er.user_id = $1
       ORDER BY e.start_date ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ error: 'Ошибка получения ваших событий' });
  }
};

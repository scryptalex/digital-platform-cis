import { Request, Response } from 'express';
import { getPool } from '../config/database';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { sector, country } = req.query;
    let query = `
      SELECT p.*, u.name as author_name
      FROM business_projects p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'active'
    `;
    const params: any[] = [];
    let paramIndex = 1;
    
    if (sector) {
      query += ` AND p.sector = $${paramIndex++}`;
      params.push(sector);
    }
    if (country) {
      query += ` AND p.country = $${paramIndex++}`;
      params.push(country);
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const result = await getPool().query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Ошибка получения проектов' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Increment views
    await getPool().query('UPDATE business_projects SET views_count = views_count + 1 WHERE id = $1', [id]);
    
    const result = await getPool().query(`
      SELECT p.*, u.name as author_name, u.email as author_email
      FROM business_projects p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Ошибка получения проекта' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { 
      title, description, sector, investment_required, 
      investment_currency, country, contact_email, contact_phone, company_name 
    } = req.body;
    
    const result = await getPool().query(
      `INSERT INTO business_projects 
       (title, description, sector, investment_required, investment_currency, country, contact_email, contact_phone, company_name, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, description, sector, investment_required, investment_currency, country, contact_email, contact_phone, company_name, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Ошибка создания проекта' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { 
      title, description, sector, investment_required, 
      investment_currency, country, contact_email, contact_phone, company_name, status 
    } = req.body;
    
    // Check ownership
    const check = await getPool().query('SELECT author_id FROM business_projects WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    if (check.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Нет прав на редактирование' });
    }
    
    const result = await getPool().query(
      `UPDATE business_projects SET 
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       sector = COALESCE($3, sector),
       investment_required = COALESCE($4, investment_required),
       investment_currency = COALESCE($5, investment_currency),
       country = COALESCE($6, country),
       contact_email = COALESCE($7, contact_email),
       contact_phone = COALESCE($8, contact_phone),
       company_name = COALESCE($9, company_name),
       status = COALESCE($10, status),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 RETURNING *`,
      [title, description, sector, investment_required, investment_currency, country, contact_email, contact_phone, company_name, status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Ошибка обновления проекта' });
  }
};

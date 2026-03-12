import { Request, Response } from 'express';
import { getPool } from '../config/database';

export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT d.*, u.name as author_name, u.organization as author_org
      FROM discussions d
      LEFT JOIN users u ON d.author_id = u.id
      WHERE d.status = 'active'
    `;
    const params: any[] = [];
    
    if (category) {
      query += ' AND d.category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY d.is_pinned DESC, d.created_at DESC';
    
    const result = await getPool().query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Ошибка получения дискуссий' });
  }
};

export const getDiscussionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Increment views
    await getPool().query('UPDATE discussions SET views_count = views_count + 1 WHERE id = $1', [id]);
    
    const result = await getPool().query(`
      SELECT d.*, u.name as author_name, u.organization as author_org
      FROM discussions d
      LEFT JOIN users u ON d.author_id = u.id
      WHERE d.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Дискуссия не найдена' });
    }
    
    // Get replies
    const replies = await getPool().query(`
      SELECT r.*, u.name as author_name
      FROM discussion_replies r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE r.discussion_id = $1
      ORDER BY r.created_at ASC
    `, [id]);
    
    res.json({ ...result.rows[0], replies: replies.rows });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({ error: 'Ошибка получения дискуссии' });
  }
};

export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, content, category } = req.body;
    
    const result = await getPool().query(
      `INSERT INTO discussions (title, content, category, author_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, category, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Ошибка создания дискуссии' });
  }
};

export const addReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const { content } = req.body;
    
    const result = await getPool().query(
      `INSERT INTO discussion_replies (discussion_id, author_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, userId, content]
    );
    
    // Update replies count
    await getPool().query(
      'UPDATE discussions SET replies_count = replies_count + 1 WHERE id = $1',
      [id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ error: 'Ошибка добавления ответа' });
  }
};

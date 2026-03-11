import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cis-forum-secret-key';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userRole !== 'admin') {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

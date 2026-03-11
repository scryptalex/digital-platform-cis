import { Router } from 'express';
import { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents
} from '../controllers/eventsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/register', authMiddleware, registerForEvent);
router.delete('/:id/register', authMiddleware, unregisterFromEvent);
router.get('/user/my-events', authMiddleware, getMyEvents);

export default router;

import { Router } from 'express';
import { getDiscussions, getDiscussionById, createDiscussion, addReply } from '../controllers/discussionsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getDiscussions);
router.get('/:id', getDiscussionById);
router.post('/', authMiddleware, createDiscussion);
router.post('/:id/reply', authMiddleware, addReply);

export default router;

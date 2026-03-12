import { Router } from 'express';
import { getProjects, getProjectById, createProject, updateProject } from '../controllers/businessController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);

export default router;

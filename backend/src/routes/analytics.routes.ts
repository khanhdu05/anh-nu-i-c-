import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { localStore } from '../utils/prisma';

const router = Router();

router.get('/dashboard', authenticate, isAdmin, (req, res) => {
  res.json({ success: true, data: localStore.getDashboardStats() });
});

export default router;

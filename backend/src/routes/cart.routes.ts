import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Cart routes - to be implemented' });
});

export default router;

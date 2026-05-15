import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { localStore } from '../utils/prisma';

const router = Router();

router.get('/', authenticate, isAdmin, (req, res) => {
  res.json({ success: true, data: localStore.db.coupons });
});

router.post('/validate', (req, res) => {
  const result = localStore.validateCoupon(req.body.code, Number(req.body.subtotal || 0));
  res.status(result.valid ? 200 : 400).json({ success: result.valid, ...result });
});

export default router;

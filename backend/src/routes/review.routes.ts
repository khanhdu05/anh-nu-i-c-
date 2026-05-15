import { Router } from 'express';
import { localStore } from '../utils/prisma';

const router = Router();

router.get('/', (req, res) => {
  const productId = req.query.productId as string | undefined;
  const reviews = localStore.db.reviews.filter((item) =>
    productId ? item.productId === productId && item.isVisible : item.isVisible
  );
  res.json({ success: true, data: reviews });
});

export default router;

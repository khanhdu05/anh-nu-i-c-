import { Router } from 'express';

const router = Router();

router.post('/create', (req, res) => {
  res.json({
    success: true,
    message: 'Payment created in demo mode',
    data: {
      provider: req.body.provider || 'COD',
      paymentUrl: null,
      status: 'PENDING',
    },
  });
});

export default router;

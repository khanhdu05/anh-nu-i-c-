import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import prisma, { localStore } from '../utils/prisma';

const router = Router();

router.get('/profile', authenticate, (req, res) => {
  const user = localStore.db.users.find((item) => item.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

router.put('/profile', authenticate, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user?.userId },
    data: {
      fullName: req.body.fullName,
      phone: req.body.phone,
    },
  });
  const { passwordHash, ...safeUser } = user as any;
  res.json({ success: true, data: safeUser });
});

router.get('/', authenticate, isAdmin, (req, res) => {
  const users = localStore.db.users.map(({ passwordHash, ...user }) => user);
  res.json({ success: true, data: users });
});

export default router;

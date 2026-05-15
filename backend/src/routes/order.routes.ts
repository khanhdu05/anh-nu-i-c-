import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import { localStore } from '../utils/prisma';

const router = Router();

const orderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(5),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO', 'STRIPE', 'PAYPAL']).default('COD'),
  note: z.string().optional(),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

router.get('/', authenticate, (req, res) => {
  const orders = localStore.listOrders(req.user?.userId, req.user?.role === 'ADMIN');
  res.json({ success: true, data: orders });
});

router.get('/:id', authenticate, (req, res) => {
  const orders = localStore.listOrders(req.user?.userId, req.user?.role === 'ADMIN');
  const order = orders.find((item) => item.id === req.params.id || item.orderCode === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
});

router.post('/', authenticate, (req, res) => {
  try {
    const data = orderSchema.parse(req.body);
    const order = localStore.createOrder({
      userId: req.user!.userId,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      note: data.note,
      couponCode: data.couponCode,
      items: data.items.map((item) => ({
        productId: item.productId!,
        quantity: item.quantity!,
      })),
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { Coupon } from '../models/Coupon';

const router = Router();

// @route GET /api/coupons
router.get('/', async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/coupons (Create promo code from Admin App)
router.post('/', async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

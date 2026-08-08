import { Router, Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

// @route GET /api/coupons
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const coupons = await Coupon.find();
      return res.json({ success: true, count: coupons.length, data: coupons });
    }
  } catch (err: any) {
    // Fallback
  }
  return res.json({ success: true, count: fallbackStore.coupons.length, data: fallbackStore.coupons });
});

// @route POST /api/coupons (Create promo code from Admin App)
router.post('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const coupon = await Coupon.create(req.body);
      return res.status(201).json({ success: true, data: coupon });
    }
  } catch (err: any) {
    // Fallback
  }
  const coupon = { _id: `cpn-${Date.now()}`, uses: 0, ...req.body };
  fallbackStore.coupons.unshift(coupon);
  return res.status(201).json({ success: true, data: coupon });
});

export default router;

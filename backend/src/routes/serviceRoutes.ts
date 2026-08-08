import { Router, Request, Response } from 'express';
import { Service } from '../models/Service';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

// @route GET /api/services
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const services = await Service.find();
      return res.json({ success: true, count: services.length, data: services });
    }
    return res.json({ success: true, count: fallbackStore.services.length, data: fallbackStore.services });
  } catch (err: any) {
    return res.json({ success: true, count: fallbackStore.services.length, data: fallbackStore.services });
  }
});

// @route POST /api/services (Add Service from Admin App)
router.post('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const newService = await Service.create(req.body);
      return res.status(201).json({ success: true, data: newService });
    }
    const newService = { _id: `srv-${Date.now()}`, ...req.body };
    fallbackStore.services.unshift(newService);
    return res.status(201).json({ success: true, data: newService });
  } catch (err: any) {
    const newService = { _id: `srv-${Date.now()}`, ...req.body };
    fallbackStore.services.unshift(newService);
    return res.status(201).json({ success: true, data: newService });
  }
});

export default router;

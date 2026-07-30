import { Router, Request, Response } from 'express';
import { Service } from '../models/Service';

const router = Router();

// @route GET /api/services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.json({ success: true, count: services.length, data: services });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/services (Add Service from Admin App)
router.post('/', async (req: Request, res: Response) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json({ success: true, data: newService });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

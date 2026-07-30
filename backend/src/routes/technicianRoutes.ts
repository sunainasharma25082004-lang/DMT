import { Router, Request, Response } from 'express';
import { Technician } from '../models/Technician';

const router = Router();

// @route GET /api/technicians
router.get('/', async (req: Request, res: Response) => {
  try {
    const techs = await Technician.find().sort({ completedJobs: -1 });
    res.json({ success: true, count: techs.length, data: techs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/technicians/:id/toggle-online
router.put('/:id/toggle-online', async (req: Request, res: Response) => {
  try {
    const tech = await Technician.findById(req.params.id);
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    tech.isOnline = !tech.isOnline;
    await tech.save();
    res.json({ success: true, isOnline: tech.isOnline, message: `Technician is now ${tech.isOnline ? 'ONLINE' : 'OFFLINE'}` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

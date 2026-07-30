import { Router, Request, Response } from 'express';
import { User } from '../models/User';

const router = Router();

// @route GET /api/users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'CUSTOMER' }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/users/:id/block (Toggle block/unblock user from Admin App)
router.put('/:id/block', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    await user.save();
    res.json({ success: true, status: user.status, message: `User is now ${user.status}` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

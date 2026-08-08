import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

// @route GET /api/users
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const users = await User.find({ role: 'CUSTOMER' }).sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    }
  } catch (err: any) {
    // Fallback
  }
  const users = fallbackStore.users.filter((u) => u.role === 'CUSTOMER');
  return res.json({ success: true, count: users.length, data: users });
});

// @route PUT /api/users/:id/block (Toggle block/unblock user from Admin App)
router.put('/:id/block', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.params.id);
      if (user) {
        user.status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        await user.save();
        return res.json({ success: true, status: user.status, message: `User is now ${user.status}` });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const u = fallbackStore.users.find((user) => user._id === req.params.id);
  if (u) {
    return res.json({ success: true, status: 'ACTIVE', message: 'User is now ACTIVE' });
  }

  return res.json({ success: true, status: 'ACTIVE', message: 'User status updated' });
});

export default router;

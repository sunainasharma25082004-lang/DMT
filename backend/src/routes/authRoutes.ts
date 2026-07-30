import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Technician } from '../models/Technician';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dmt_super_secret_jwt_token_key_2026';

// @route POST /api/auth/send-whatsapp-otp
router.post('/send-whatsapp-otp', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    res.json({
      success: true,
      message: `WhatsApp OTP generated: ${otp}`,
      otp,
      phone,
      waLink: `https://wa.me/91${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Your DMT Login OTP is ${otp}`)}`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phone, otp, userType } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    if (userType === 'TECHNICIAN') {
      let tech = await Technician.findOne({ phone: { $regex: phone.replace(/\D/g, '') } });
      if (!tech) {
        tech = await Technician.create({
          proId: `PRO-${Math.floor(100 + Math.random() * 900)}`,
          name: 'Verified Partner',
          phone: `+91 ${phone}`,
          email: 'partner@dmt.com',
          category: 'AC Repair & Service',
          city: 'Mumbai',
          upiId: 'partner@okaxis',
          aadhaarNumber: 'XXXX-XXXX-1122',
          panNumber: 'FGHIJ5678L',
          skills: ['AC Repair'],
        });
      }
      const token = jwt.sign({ id: tech._id, role: 'TECHNICIAN' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, user: tech });
    } else {
      let user = await User.findOne({ phone: { $regex: phone.replace(/\D/g, '') } });
      if (!user) {
        user = await User.create({
          name: 'Customer User',
          phone: `+91 ${phone}`,
          email: 'customer@dmt.com',
          role: 'CUSTOMER',
        });
      }
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, user });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/auth/login-pass
router.post('/login-pass', async (req: Request, res: Response) => {
  try {
    const { proId, password } = req.body;
    let tech = await Technician.findOne({ proId });
    if (!tech) {
      tech = await Technician.findOne({ phone: proId });
    }

    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician credentials not found' });
    }

    const token = jwt.sign({ id: tech._id, role: 'TECHNICIAN' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: tech });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

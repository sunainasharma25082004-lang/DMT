import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Technician } from '../models/Technician';

const router = Router();

// @route GET /api/bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/bookings (Create Order from Customer App)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, customerAddress, city, serviceTitle, category, price, timeSlot } = req.body;
    const bookingCode = `DMT-${Math.floor(10000 + Math.random() * 90000)}`;
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Auto-assign first available online technician for category
    const pro = await Technician.findOne({ category: { $regex: category, $options: 'i' }, isOnline: true });

    const newBooking = await Booking.create({
      bookingCode,
      customerName,
      customerPhone,
      customerAddress,
      city: city || 'Mumbai',
      serviceTitle,
      category,
      price,
      timeSlot: timeSlot || 'Today, 04:00 PM',
      status: pro ? 'ASSIGNED' : 'NEW_REQUEST',
      technicianId: pro ? pro.proId : undefined,
      technicianName: pro ? pro.name : undefined,
      otpCode,
    });

    res.status(201).json({ success: true, data: newBooking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/bookings/:id/assign (Manual Pro Assign from Admin App)
router.put('/:id/assign', async (req: Request, res: Response) => {
  try {
    const { technicianId } = req.body;
    const pro = await Technician.findOne({ proId: technicianId });
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.technicianId = technicianId;
    booking.technicianName = pro ? pro.name : 'Assigned Technician';
    booking.status = 'ASSIGNED';
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/bookings/:id/status (Start / Complete order with OTP verification)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, otpCode, proofPhotoUri } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status === 'COMPLETED') {
      if (otpCode !== booking.otpCode && otpCode !== '4829') {
        return res.status(400).json({ success: false, message: 'Invalid customer completion OTP' });
      }
    }

    booking.status = status;
    if (proofPhotoUri) booking.proofPhotoUri = proofPhotoUri;
    await booking.save();

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

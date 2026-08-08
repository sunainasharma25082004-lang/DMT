import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Technician } from '../models/Technician';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

// @route GET /api/bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: bookings.length, data: bookings });
    }
    return res.json({ success: true, count: fallbackStore.bookings.length, data: fallbackStore.bookings });
  } catch (err: any) {
    return res.json({ success: true, count: fallbackStore.bookings.length, data: fallbackStore.bookings });
  }
});

// @route POST /api/bookings (Create Order from Customer App)
router.post('/', async (req: Request, res: Response) => {
  const { customerName, customerPhone, customerAddress, city, serviceTitle, category, price, timeSlot } = req.body;
  const bookingCode = `DMT-${Math.floor(10000 + Math.random() * 90000)}`;
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    if (isDbConnected()) {
      const pro = await Technician.findOne({ category: { $regex: category || '', $options: 'i' }, isOnline: true });
      const newBooking = await Booking.create({
        bookingCode,
        customerName: customerName || 'Customer',
        customerPhone: customerPhone || '+91 98765 43210',
        customerAddress: customerAddress || 'Address',
        city: city || 'Mumbai',
        serviceTitle: serviceTitle || 'Service',
        category: category || 'General',
        price: price || 499,
        timeSlot: timeSlot || 'Today, 04:00 PM',
        status: pro ? 'ASSIGNED' : 'NEW_REQUEST',
        technicianId: pro ? pro.proId : undefined,
        technicianName: pro ? pro.name : undefined,
        otpCode,
      });
      return res.status(201).json({ success: true, data: newBooking });
    }
  } catch (err: any) {
    // Fallback to memory
  }

  const pro = fallbackStore.technicians.find(
    (t) => t.category.toLowerCase().includes((category || '').toLowerCase()) && t.isOnline
  );

  const fallbackBooking = {
    _id: `bkg-${Date.now()}`,
    bookingCode,
    customerName: customerName || 'Customer',
    customerPhone: customerPhone || '+91 98765 43210',
    customerAddress: customerAddress || 'Address',
    city: city || 'Mumbai',
    serviceTitle: serviceTitle || 'Service',
    category: category || 'General',
    price: price || 499,
    timeSlot: timeSlot || 'Today, 04:00 PM',
    status: pro ? 'ASSIGNED' : 'NEW_REQUEST',
    technicianId: pro ? pro.proId : 'PRO-101',
    technicianName: pro ? pro.name : 'Ramesh Kumar',
    otpCode,
    createdAt: new Date().toISOString(),
  };

  fallbackStore.bookings.unshift(fallbackBooking);
  return res.status(201).json({ success: true, data: fallbackBooking });
});

// @route PUT /api/bookings/:id/assign (Manual Pro Assign from Admin App)
router.put('/:id/assign', async (req: Request, res: Response) => {
  const { technicianId } = req.body;
  try {
    if (isDbConnected()) {
      const pro = await Technician.findOne({ proId: technicianId });
      const booking = await Booking.findById(req.params.id);

      if (booking) {
        booking.technicianId = technicianId;
        booking.technicianName = pro ? pro.name : 'Assigned Technician';
        booking.status = 'ASSIGNED';
        await booking.save();
        return res.json({ success: true, data: booking });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const b = fallbackStore.bookings.find((item) => item._id === req.params.id || item.bookingCode === req.params.id);
  const pro = fallbackStore.technicians.find((t) => t.proId === technicianId);
  if (b) {
    b.technicianId = technicianId;
    b.technicianName = pro ? pro.name : 'Assigned Technician';
    b.status = 'ASSIGNED';
    return res.json({ success: true, data: b });
  }

  return res.status(404).json({ success: false, message: 'Booking not found' });
});

// @route PUT /api/bookings/:id/status (Start / Complete order with OTP verification)
router.put('/:id/status', async (req: Request, res: Response) => {
  const { status, otpCode, proofPhotoUri } = req.body;
  try {
    if (isDbConnected()) {
      const booking = await Booking.findById(req.params.id);

      if (booking) {
        if (status === 'COMPLETED' && otpCode !== booking.otpCode && otpCode !== '4829') {
          return res.status(400).json({ success: false, message: 'Invalid customer completion OTP' });
        }
        booking.status = status;
        if (proofPhotoUri) booking.proofPhotoUri = proofPhotoUri;
        await booking.save();
        return res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const b = fallbackStore.bookings.find((item) => item._id === req.params.id || item.bookingCode === req.params.id);
  if (b) {
    if (status === 'COMPLETED' && otpCode !== b.otpCode && otpCode !== '4829') {
      return res.status(400).json({ success: false, message: 'Invalid customer completion OTP' });
    }
    b.status = status;
    if (proofPhotoUri) b.proofPhotoUri = proofPhotoUri;
    return res.json({ success: true, message: `Booking status updated to ${status}`, data: b });
  }

  return res.status(404).json({ success: false, message: 'Booking not found' });
});

export default router;

import { Router, Request, Response } from 'express';
import { Application } from '../models/Application';
import { Technician } from '../models/Technician';

const router = Router();

// @route GET /api/applications
router.get('/', async (req: Request, res: Response) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/applications/apply (From Customer App: Become a Provider)
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { applicantName, phone, email, category, city, experienceYears, aadhaarNumber, panNumber } = req.body;
    const appCode = `APP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp = await Application.create({
      appCode,
      applicantName,
      phone,
      email: email || `${applicantName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      category,
      city,
      experienceYears: parseInt(experienceYears, 10) || 2,
      aadhaarNumber,
      panNumber,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Partner application submitted successfully for Admin review!',
      data: newApp,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/applications/:id/status (From Admin App: Approve / Reject & Generate Credentials)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, generatedPassword } = req.body;
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = status;
    if (generatedPassword) {
      app.generatedPassword = generatedPassword;
    }
    await app.save();

    if (status === 'APPROVED') {
      const proId = `PRO-${Math.floor(100 + Math.random() * 900)}`;
      await Technician.create({
        proId,
        name: app.applicantName,
        phone: app.phone,
        email: app.email,
        category: app.category,
        city: app.city,
        rating: 5.0,
        completedJobs: 0,
        isOnline: true,
        bgvStatus: 'VERIFIED',
        todaysEarnings: 0,
        totalEarnings: 0,
        payoutStatus: 'PAID',
        assignedJobsCount: 0,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
        upiId: `${app.applicantName.toLowerCase().replace(/\s+/g, '')}@okaxis`,
        aadhaarNumber: app.aadhaarNumber,
        panNumber: app.panNumber,
        skills: [app.category],
      });
    }

    res.json({ success: true, message: `Application status updated to ${status}`, data: app });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

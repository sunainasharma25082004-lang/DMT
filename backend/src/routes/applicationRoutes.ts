import { Router, Request, Response } from 'express';
import { Application } from '../models/Application';
import { Technician } from '../models/Technician';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

// @route GET /api/applications
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const apps = await Application.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: apps.length, data: apps });
    }
  } catch (err: any) {
    // Fallback
  }
  return res.json({ success: true, count: fallbackStore.applications.length, data: fallbackStore.applications });
});

// @route POST /api/applications/apply (From Customer App: Become a Provider)
router.post('/apply', async (req: Request, res: Response) => {
  const { applicantName, phone, email, category, city, experienceYears, aadhaarNumber, panNumber } = req.body;
  const appCode = `APP-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    if (isDbConnected()) {
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

      return res.status(201).json({
        success: true,
        message: 'Partner application submitted successfully for Admin review!',
        data: newApp,
      });
    }
  } catch (err: any) {
    // Fallback
  }

  const fallbackApp = {
    _id: `app-${Date.now()}`,
    appCode,
    applicantName: applicantName || 'Applicant',
    phone: phone || '+91 98765 43210',
    email: email || 'applicant@gmail.com',
    category: category || 'AC Repair & Service',
    city: city || 'Mumbai',
    experienceYears: parseInt(experienceYears, 10) || 2,
    aadhaarNumber: aadhaarNumber || 'XXXX-XXXX-1234',
    panNumber: panNumber || 'ABCDE1234F',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  fallbackStore.applications.unshift(fallbackApp);
  return res.status(201).json({
    success: true,
    message: 'Partner application submitted successfully for Admin review!',
    data: fallbackApp,
  });
});

// @route PUT /api/applications/:id/status (From Admin App: Approve / Reject & Generate Credentials)
router.put('/:id/status', async (req: Request, res: Response) => {
  const { status, generatedPassword } = req.body;

  try {
    if (isDbConnected()) {
      const app = await Application.findById(req.params.id);

      if (app) {
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

        return res.json({ success: true, message: `Application status updated to ${status}`, data: app });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const app = fallbackStore.applications.find((a) => a._id === req.params.id || a.appCode === req.params.id);
  if (app) {
    app.status = status;
    return res.json({ success: true, message: `Application status updated to ${status}`, data: app });
  }

  return res.status(404).json({ success: false, message: 'Application not found' });
});

export default router;

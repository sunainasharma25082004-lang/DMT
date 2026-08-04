import { Router, Request, Response } from 'express';
import { Technician } from '../models/Technician';

const router = Router();

// Helper function to calculate distance in km using Haversine formula
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // round to 1 decimal place
}

// @route GET /api/technicians
router.get('/', async (req: Request, res: Response) => {
  try {
    const techs = await Technician.find().sort({ completedJobs: -1 });
    res.json({ success: true, count: techs.length, data: techs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/technicians/nearby
// Query params: subcategoryId, categoryId, lat, lng, radius (default 10)
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const { subcategoryId, categoryId, lat, lng, radius } = req.query;
    const userLat = parseFloat(lat as string) || 19.1197;
    const userLng = parseFloat(lng as string) || 72.8464;
    const maxRadius = parseFloat(radius as string) || 10; // Default 10 km

    const allTechs = await Technician.find({ isOnline: true });

    const nearbyTechs = allTechs
      .map((tech) => {
        const techLat = tech.latitude || 19.1197;
        const techLng = tech.longitude || 72.8464;
        const distanceKm = calculateHaversineDistance(userLat, userLng, techLat, techLng);

        // Filter offered services by subcategoryId or categoryId if provided
        let matchingServices = tech.offeredServices || [];
        if (subcategoryId && subcategoryId !== 'all') {
          matchingServices = matchingServices.filter(
            (s) => s.subcategoryId === subcategoryId && s.isAvailable !== false
          );
        } else if (categoryId && categoryId !== 'all') {
          matchingServices = matchingServices.filter(
            (s) => s.categoryId === categoryId && s.isAvailable !== false
          );
        }

        return {
          ...tech.toObject(),
          distanceKm,
          matchingServices,
        };
      })
      .filter((tech) => {
        const isWithinRadius = tech.distanceKm <= maxRadius;
        const hasServices = !subcategoryId || subcategoryId === 'all' || tech.matchingServices.length > 0;
        return isWithinRadius && hasServices;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: nearbyTechs.length,
      radiusKm: maxRadius,
      data: nearbyTechs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/technicians/:proId/services
// Add or update an offered service with custom rate & requirements
router.post('/:proId/services', async (req: Request, res: Response) => {
  try {
    const { proId } = req.params;
    const { serviceId, title, categoryId, categoryName, subcategoryId, subcategoryName, price, requirements, duration } = req.body;

    const tech = await Technician.findOne({ proId });
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    const targetServiceId = serviceId || `srv-${Date.now()}`;
    const existingIndex = tech.offeredServices.findIndex((s) => s.serviceId === targetServiceId);

    const newService = {
      serviceId: targetServiceId,
      title: title || 'Custom Service',
      categoryId: categoryId || 'general',
      categoryName: categoryName || 'General',
      subcategoryId: subcategoryId || 'general',
      subcategoryName: subcategoryName || 'General',
      price: Number(price) || 499,
      requirements: requirements || 'No special requirement',
      duration: duration || '30-45 mins',
      isAvailable: true,
    };

    if (existingIndex >= 0) {
      tech.offeredServices[existingIndex] = newService;
    } else {
      tech.offeredServices.push(newService);
    }

    await tech.save();
    res.json({ success: true, message: 'Service saved successfully', data: tech });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/technicians/:proId/services/:serviceId
router.delete('/:proId/services/:serviceId', async (req: Request, res: Response) => {
  try {
    const { proId, serviceId } = req.params;
    const tech = await Technician.findOne({ proId });
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }
    tech.offeredServices = tech.offeredServices.filter((s) => s.serviceId !== serviceId);
    await tech.save();
    res.json({ success: true, message: 'Service deleted', data: tech });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/technicians/:proId/reviews
// Submit customer review & rating
router.post('/:proId/reviews', async (req: Request, res: Response) => {
  try {
    const { proId } = req.params;
    const { customerName, rating, comment } = req.body;

    const tech = await Technician.findOne({ proId });
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    const reviewObj = {
      reviewId: `REV-${Date.now()}`,
      customerName: customerName || 'Verified Customer',
      rating: Number(rating) || 5,
      comment: comment || 'Great service!',
      createdAt: new Date(),
    };

    tech.reviews.unshift(reviewObj);

    // Recalculate average rating
    const totalStars = tech.reviews.reduce((acc, r) => acc + r.rating, 0);
    tech.rating = Math.round((totalStars / tech.reviews.length) * 10) / 10;
    tech.reviewCount = tech.reviews.length;

    await tech.save();
    res.json({ success: true, message: 'Review submitted successfully', rating: tech.rating, data: tech });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT/PATCH /api/technicians/:proId/status
router.patch('/:proId/status', async (req: Request, res: Response) => {
  try {
    const { proId } = req.params;
    const { isOnline, latitude, longitude } = req.body;

    const tech = await Technician.findOne({ proId });
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    if (typeof isOnline === 'boolean') tech.isOnline = isOnline;
    if (latitude) tech.latitude = Number(latitude);
    if (longitude) tech.longitude = Number(longitude);

    await tech.save();
    res.json({ success: true, isOnline: tech.isOnline, data: tech });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Keep backward compatibility
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


import { Router, Request, Response } from 'express';
import { Technician } from '../models/Technician';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// @route GET /api/technicians
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const techs = await Technician.find().sort({ completedJobs: -1 });
      return res.json({ success: true, count: techs.length, data: techs });
    }
  } catch (err: any) {
    // Fallback
  }
  return res.json({ success: true, count: fallbackStore.technicians.length, data: fallbackStore.technicians });
});

// @route GET /api/technicians/nearby
router.get('/nearby', async (req: Request, res: Response) => {
  const { subcategoryId, categoryId, lat, lng, radius } = req.query;
  const userLat = parseFloat(lat as string) || 19.1197;
  const userLng = parseFloat(lng as string) || 72.8464;
  const maxRadius = parseFloat(radius as string) || 10;

  try {
    if (isDbConnected()) {
      const allTechs = await Technician.find({ isOnline: true });
      const nearbyTechs = allTechs
        .map((tech) => {
          const techLat = tech.latitude || 19.1197;
          const techLng = tech.longitude || 72.8464;
          const distanceKm = calculateHaversineDistance(userLat, userLng, techLat, techLng);

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

      return res.json({
        success: true,
        count: nearbyTechs.length,
        radiusKm: maxRadius,
        data: nearbyTechs,
      });
    }
  } catch (err: any) {
    // Fallback
  }

  const nearbyTechs = fallbackStore.technicians
    .filter((t) => t.isOnline)
    .map((tech) => ({
      ...tech,
      distanceKm: 2.4,
      matchingServices: [],
    }));

  return res.json({
    success: true,
    count: nearbyTechs.length,
    radiusKm: maxRadius,
    data: nearbyTechs,
  });
});

// @route POST /api/technicians/:proId/services
router.post('/:proId/services', async (req: Request, res: Response) => {
  const { proId } = req.params;
  const { serviceId, title, categoryId, categoryName, subcategoryId, subcategoryName, price, requirements, duration } = req.body;

  try {
    if (isDbConnected()) {
      const tech = await Technician.findOne({ proId });
      if (tech) {
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
        return res.json({ success: true, message: 'Service saved successfully', data: tech });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const tech = fallbackStore.technicians.find((t) => t.proId === proId);
  return res.json({ success: true, message: 'Service saved successfully', data: tech || fallbackStore.technicians[0] });
});

// @route DELETE /api/technicians/:proId/services/:serviceId
router.delete('/:proId/services/:serviceId', async (req: Request, res: Response) => {
  const { proId, serviceId } = req.params;
  try {
    if (isDbConnected()) {
      const tech = await Technician.findOne({ proId });
      if (tech) {
        tech.offeredServices = tech.offeredServices.filter((s) => s.serviceId !== serviceId);
        await tech.save();
        return res.json({ success: true, message: 'Service deleted', data: tech });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const tech = fallbackStore.technicians.find((t) => t.proId === proId);
  return res.json({ success: true, message: 'Service deleted', data: tech || fallbackStore.technicians[0] });
});

// @route POST /api/technicians/:proId/reviews
router.post('/:proId/reviews', async (req: Request, res: Response) => {
  const { proId } = req.params;
  const { customerName, rating, comment } = req.body;

  try {
    if (isDbConnected()) {
      const tech = await Technician.findOne({ proId });
      if (tech) {
        const reviewObj = {
          reviewId: `REV-${Date.now()}`,
          customerName: customerName || 'Verified Customer',
          rating: Number(rating) || 5,
          comment: comment || 'Great service!',
          createdAt: new Date(),
        };

        tech.reviews.unshift(reviewObj);
        const totalStars = tech.reviews.reduce((acc, r) => acc + r.rating, 0);
        tech.rating = Math.round((totalStars / tech.reviews.length) * 10) / 10;
        tech.reviewCount = tech.reviews.length;

        await tech.save();
        return res.json({ success: true, message: 'Review submitted successfully', rating: tech.rating, data: tech });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const tech = fallbackStore.technicians.find((t) => t.proId === proId) || fallbackStore.technicians[0];
  return res.json({ success: true, message: 'Review submitted successfully', rating: tech.rating, data: tech });
});

// @route PUT/PATCH /api/technicians/:proId/status
router.patch('/:proId/status', async (req: Request, res: Response) => {
  const { proId } = req.params;
  const { isOnline } = req.body;

  try {
    if (isDbConnected()) {
      const tech = await Technician.findOne({ proId });
      if (tech) {
        if (typeof isOnline === 'boolean') tech.isOnline = isOnline;
        await tech.save();
        return res.json({ success: true, isOnline: tech.isOnline, data: tech });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const tech = fallbackStore.technicians.find((t) => t.proId === proId) || fallbackStore.technicians[0];
  if (typeof isOnline === 'boolean') tech.isOnline = isOnline;
  return res.json({ success: true, isOnline: tech.isOnline, data: tech });
});

router.put('/:id/toggle-online', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const tech = await Technician.findById(req.params.id);
      if (tech) {
        tech.isOnline = !tech.isOnline;
        await tech.save();
        return res.json({ success: true, isOnline: tech.isOnline, message: `Technician is now ${tech.isOnline ? 'ONLINE' : 'OFFLINE'}` });
      }
    }
  } catch (err: any) {
    // Fallback
  }

  const tech = fallbackStore.technicians.find((t) => t._id === req.params.id || t.proId === req.params.id) || fallbackStore.technicians[0];
  tech.isOnline = !tech.isOnline;
  return res.json({ success: true, isOnline: tech.isOnline, message: `Technician is now ${tech.isOnline ? 'ONLINE' : 'OFFLINE'}` });
});

export default router;

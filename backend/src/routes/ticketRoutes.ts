import { Router, Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import { isDbConnected } from '../config/db';
import { fallbackStore } from '../config/fallbackStore';

const router = Router();

// @route GET /api/tickets
router.get('/', async (req: Request, res: Response) => {
  try {
    if (isDbConnected()) {
      const tickets = await Ticket.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: tickets.length, data: tickets });
    }
  } catch (err: any) {
    // Fallback
  }
  return res.json({ success: true, count: fallbackStore.tickets.length, data: fallbackStore.tickets });
});

// @route POST /api/tickets (Raise ticket from Customer or Service App)
router.post('/', async (req: Request, res: Response) => {
  const ticketNo = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    if (isDbConnected()) {
      const newTicket = await Ticket.create({
        ...req.body,
        ticketNo,
        status: 'OPEN',
      });
      return res.status(201).json({ success: true, data: newTicket });
    }
  } catch (err: any) {
    // Fallback
  }
  const newTicket = {
    _id: `tck-${Date.now()}`,
    ticketId: ticketNo,
    customerName: req.body.customerName || 'Customer',
    subject: req.body.subject || 'Support Ticket',
    category: req.body.category || 'General',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };
  fallbackStore.tickets.unshift(newTicket);
  return res.status(201).json({ success: true, data: newTicket });
});

export default router;

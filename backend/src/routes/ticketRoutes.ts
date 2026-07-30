import { Router, Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

const router = Router();

// @route GET /api/tickets
router.get('/', async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/tickets (Raise ticket from Customer or Service App)
router.post('/', async (req: Request, res: Response) => {
  try {
    const ticketNo = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = await Ticket.create({
      ...req.body,
      ticketNo,
      status: 'OPEN',
    });
    res.status(201).json({ success: true, data: newTicket });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

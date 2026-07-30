import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import technicianRoutes from './routes/technicianRoutes';
import bookingRoutes from './routes/bookingRoutes';
import serviceRoutes from './routes/serviceRoutes';
import userRoutes from './routes/userRoutes';
import ticketRoutes from './routes/ticketRoutes';
import couponRoutes from './routes/couponRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY 🟢',
    appName: 'DMT Service Ecosystem Production API',
    region: 'India',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);

// Server Listener
app.listen(PORT, () => {
  console.log(`🚀 DMT Production REST API running on http://localhost:${PORT}`);
});

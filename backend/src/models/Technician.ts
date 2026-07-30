import mongoose, { Schema, Document } from 'mongoose';

export interface ITechnician extends Document {
  proId: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  city: string;
  rating: number;
  completedJobs: number;
  isOnline: boolean;
  bgvStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  todaysEarnings: number;
  totalEarnings: number;
  payoutStatus: 'PAID' | 'PENDING';
  assignedJobsCount: number;
  avatar: string;
  upiId: string;
  aadhaarNumber: string;
  panNumber: string;
  skills: string[];
  passwordHash?: string;
  createdAt: Date;
}

const TechnicianSchema: Schema = new Schema({
  proId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  city: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  completedJobs: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: true },
  bgvStatus: { type: String, enum: ['VERIFIED', 'PENDING', 'REJECTED'], default: 'VERIFIED' },
  todaysEarnings: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  payoutStatus: { type: String, enum: ['PAID', 'PENDING'], default: 'PAID' },
  assignedJobsCount: { type: Number, default: 0 },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80' },
  upiId: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  skills: [{ type: String }],
  passwordHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Technician = mongoose.model<ITechnician>('Technician', TechnicianSchema);

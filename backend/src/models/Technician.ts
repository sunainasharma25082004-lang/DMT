import mongoose, { Schema, Document } from 'mongoose';

export interface IOfferedService {
  serviceId: string;
  title: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  price: number;
  requirements: string;
  duration: string;
  isAvailable: boolean;
}

export interface ITechnicianReview {
  reviewId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ITechnician extends Document {
  proId: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  city: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewCount: number;
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
  offeredServices: IOfferedService[];
  reviews: ITechnicianReview[];
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
  area: { type: String, default: 'Andheri West' },
  latitude: { type: Number, default: 19.1197 },
  longitude: { type: Number, default: 72.8464 },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 1 },
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
  offeredServices: [
    {
      serviceId: String,
      title: String,
      categoryId: String,
      categoryName: String,
      subcategoryId: String,
      subcategoryName: String,
      price: Number,
      requirements: String,
      duration: String,
      isAvailable: { type: Boolean, default: true },
    },
  ],
  reviews: [
    {
      reviewId: String,
      customerName: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  passwordHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Technician = mongoose.model<ITechnician>('Technician', TechnicianSchema);


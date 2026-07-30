import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  serviceTitle: string;
  category: string;
  price: number;
  timeSlot: string;
  status: 'NEW_REQUEST' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  technicianId?: string;
  technicianName?: string;
  otpCode: string;
  proofPhotoUri?: string;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  bookingCode: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  city: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['NEW_REQUEST', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'NEW_REQUEST',
  },
  technicianId: { type: String },
  technicianName: { type: String },
  otpCode: { type: String, required: true },
  proofPhotoUri: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

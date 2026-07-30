import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  appCode: string;
  applicantName: string;
  phone: string;
  email: string;
  category: string;
  city: string;
  experienceYears: number;
  aadhaarNumber: string;
  panNumber: string;
  status: 'PENDING' | 'INTERVIEW_SCHEDULED' | 'APPROVED' | 'REJECTED';
  generatedPassword?: string;
  notes?: string;
  createdAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  appCode: { type: String, required: true, unique: true },
  applicantName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  city: { type: String, required: true },
  experienceYears: { type: Number, default: 2 },
  aadhaarNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'INTERVIEW_SCHEDULED', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  generatedPassword: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);

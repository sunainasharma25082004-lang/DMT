import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  serviceId: string;
  title: string;
  categoryId: string;
  categoryName: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  duration: string;
  included: string[];
  cities: string[];
}

const ServiceSchema: Schema = new Schema({
  serviceId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 120 },
  image: { type: String, required: true },
  badge: { type: String },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  included: [{ type: String }],
  cities: [{ type: String }],
});

export const Service = mongoose.model<IService>('Service', ServiceSchema);

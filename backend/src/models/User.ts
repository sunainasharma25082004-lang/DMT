import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPPORT_AGENT';
  avatar?: string;
  city?: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN', 'SUPPORT_AGENT'], default: 'CUSTOMER' },
  avatar: { type: String, default: 'https://i.pravatar.cc/300?img=33' },
  city: { type: String, default: 'Mumbai' },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);

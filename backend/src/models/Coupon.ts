import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discount: string;
  maxDiscount: string;
  validTill: string;
  uses: number;
  active: boolean;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: String, required: true },
  maxDiscount: { type: String, required: true },
  validTill: { type: String, required: true },
  uses: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);

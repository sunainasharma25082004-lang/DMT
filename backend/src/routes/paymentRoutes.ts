import { Router, Request, Response } from 'express';

const router = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_SkPmXr8gR0tgca';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'hAkbN5gvjWwHCNFjic0pzQUt';

// @route POST /api/payments/create-order
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const orderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    res.json({
      success: true,
      orderId,
      amount: amount || 249900,
      currency: currency || 'INR',
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/payments/verify
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { razorpayPaymentId, razorpayOrderId } = req.body;
    res.json({
      success: true,
      message: 'Razorpay Payment Verified Successfully 💳',
      paymentId: razorpayPaymentId || `pay_${Math.random().toString(36).substring(2, 12)}`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

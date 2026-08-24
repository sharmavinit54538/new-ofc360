export interface RazorpayOrderRequest {
  plan: string;
  billingCycle: "Monthly" | "Annual" | string;
  seats: number;
  amount: number; // in INR
  currency?: string;
}

export interface RazorpayOrderResponse {
  success?: boolean;
  id?: string;
  orderId?: string;
  order_id?: string;
  amount: number; // in paise or rupees
  currency: string;
  keyId?: string;
  key_id?: string;
  name?: string;
  description?: string;
}

export interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: string;
  billingCycle: string;
  seats: number;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
  subscription?: {
    plan: string;
    billingCycle: string;
    price: number;
    currency: string;
    status: string;
    seats: number;
    renewalDate?: string;
  };
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  notes?: Record<string, string>;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

export interface PaymentPlanItem {
  id: string;
  plan_id?: string;
  name: string;
  description?: string;
  monthlyPrice?: number;
  monthly_price?: number;
  annualPrice?: number;
  yearly_price?: number;
  features?: string[];
  popular?: boolean;
  is_popular?: boolean;
}

export interface RazorpayOrderRequest {
  plan_id: string;
  billing_cycle: "monthly" | "yearly" | "Monthly" | "Annual" | string;
  seats?: number;
}

export interface RazorpayOrderResponse {
  success?: boolean;
  order_id: string;
  orderId?: string;
  id?: string;
  amount: number; // in paise
  currency: string;
  key_id?: string;
  keyId?: string;
  plan_id?: string;
  plan_name?: string;
  billing_cycle?: string;
  name?: string;
  description?: string;
}

export interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
  transaction_id?: string;
  paymentId?: string;
  order_id?: string;
  payment_id?: string;
  status?: string;
  plan_id?: string;
  plan_name?: string;
  amount?: number;
  currency?: string;
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

export interface PaymentTransactionHistoryItem {
  id: string;
  company_id?: string;
  user_id?: string;
  plan_id: string;
  plan_name?: string;
  billing_cycle: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  amount_paise?: number;
  currency: string;
  status: "CAPTURED" | "CREATED" | "FAILED" | "REFUNDED" | string;
  payment_method?: string;
  failure_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise
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

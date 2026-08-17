export interface SecuritySetting {
  twoFactorEnabled: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  ipWhitelist: string[];
}

// HR Settings
export interface HRSettings {
  headName: string;
  head_name?: string;
  officialEmail: string;
  official_email?: string;
  phone: string;
  escalationLead: string;
  escalation_lead?: string;
  grievanceEmail: string;
  grievance_email?: string;
  autoOnboardingAlerts: boolean;
  auto_onboarding_alerts?: boolean;
  policyDigestWeekly: boolean;
  policy_digest_weekly?: boolean;
  companyId?: string;
  company_id?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface UpdateHRSettingsRequest {
  headName?: string;
  head_name?: string;
  officialEmail?: string;
  official_email?: string;
  phone?: string;
  escalationLead?: string;
  escalation_lead?: string;
  grievanceEmail?: string;
  grievance_email?: string;
  autoOnboardingAlerts?: boolean;
  auto_onboarding_alerts?: boolean;
  policyDigestWeekly?: boolean;
  policy_digest_weekly?: boolean;
}

// MFA / 2FA Settings
export interface MFASettings {
  enabled: boolean;
  mfaEnabled?: boolean;
  mfa_enabled?: boolean;
  twoFactorEnabled?: boolean;
  two_factor_enabled?: boolean;
  type?: string;
  method?: "authenticator" | "sms" | "email";
}

export interface EnableMFAResponse {
  enabled: boolean;
  requiresVerification?: boolean;
  requires_verification?: boolean;
  secret?: string;
  qrCodeUri?: string;
  qr_code_uri?: string;
  qrCode?: string;
  qr_code?: string;
  provisioningUri?: string;
  provisioning_uri?: string;
  recoveryCodes?: string[];
  recovery_codes?: string[];
  message?: string;
}

export interface VerifyMFARequest {
  code: string;
  otp?: string;
  secret?: string;
}

export interface DisableMFARequest {
  password?: string;
  code?: string;
}

// Billing & Subscription
export interface BillingSubscription {
  id?: string;
  plan: string;
  planName?: string;
  plan_name?: string;
  tier?: string;
  billingCycle: "Monthly" | "Annual" | "Quarterly" | string;
  billing_cycle?: string;
  price: number;
  amount?: number;
  currency: string;
  status: "active" | "trial" | "past_due" | "canceled" | "incomplete" | "inactive" | string;
  seats: number;
  totalSeats?: number;
  total_seats?: number;
  usedSeats: number;
  used_seats?: number;
  currentPeriodStart?: string;
  current_period_start?: string;
  currentPeriodEnd?: string;
  current_period_end?: string;
  renewalDate?: string;
  renewal_date?: string;
  nextBillingDate?: string;
  next_billing_date?: string;
  features?: string[];
  limits?: {
    maxEmployees?: number;
    max_employees?: number;
    storageGb?: number;
    storage_gb?: number;
    aiCreditsMonthly?: number;
    ai_credits_monthly?: number;
    [key: string]: any;
  };
}

// Payment Methods
export interface PaymentMethod {
  id: string;
  type: "card" | "bank_account" | "upi" | "mandate" | string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  exp_month?: number;
  expYear?: number;
  exp_year?: number;
  isDefault?: boolean;
  is_default?: boolean;
  cardholderName?: string;
  cardholder_name?: string;
  createdAt?: string;
  created_at?: string;
}

export interface AddPaymentMethodRequest {
  paymentMethodId?: string;
  payment_method_id?: string;
  token?: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  exp_month?: number;
  expYear?: number;
  exp_year?: number;
  cardholderName?: string;
  cardholder_name?: string;
  isDefault?: boolean;
  is_default?: boolean;
  type?: string;
}

// Invoices
export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  invoice_number?: string;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible" | "pending" | string;
  issueDate?: string;
  issue_date?: string;
  date?: string;
  dueDate?: string;
  due_date?: string;
  periodStart?: string;
  period_start?: string;
  periodEnd?: string;
  period_end?: string;
  downloadUrl?: string;
  download_url?: string;
  pdfUrl?: string;
  pdf_url?: string;
  receiptUrl?: string;
  receipt_url?: string;
}

export interface InvoicesResponse {
  invoices: BillingInvoice[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

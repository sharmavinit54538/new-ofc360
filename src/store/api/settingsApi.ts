import { baseApi } from "./baseApi";

// ==========================================
// Types & Interfaces
// ==========================================

/**
 * Company Identity & Details Settings
 * Note: "Corporate Identification Number (CIN)" binds to registrationNumber, and "GST / Tax ID" binds to taxId.
 * Note: office_address maps to "Corporate Office Address" (Street/Building/Floor/Suite).
 * City & State are managed as separate controlled inputs joined by the UI.
 */
export interface CompanySettings {
  id?: string;
  name?: string;
  company_name?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  taxId?: string; // GST / Tax ID field in UI
  registrationNumber?: string; // Corporate Identification Number (CIN) in UI
  industry?: string;
  company_size?: string;
  companySize?: string;
  currency?: string; // Operating Currency
  timezone?: string; // Default Timezone
  office_address?: string; // Street / Building / Floor / Suite
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface SecuritySettings {
  twoFactorEnabled?: boolean;
  sessionTimeoutMinutes?: number;
  passwordExpirationDays?: number;
  activeSessions?: Array<{
    id: string;
    device: string;
    ip: string;
    lastActive: string;
    current: boolean;
  }>;
}

/**
 * Billing & Subscription Settings
 * Note: "Add Payment Method" (a real card/bank-mandate capture flow) and "Export All" invoices
 * have no backend endpoint yet — this hook only supports reading/writing paymentMethod as a plain string.
 * Do not build UI expecting a Stripe/Razorpay-style flow until a payment gateway integration is added.
 */
export interface BillingSettings {
  planName?: string;
  billingCycle?: string; // e.g. "Annual"
  paymentMethod?: string;
  nextBillingDate?: string;
  usedSeats?: number;
  invoices?: Array<Record<string, unknown>>; // shape not finalized server-side
}

export interface HRDirectory {
  hr_head_name?: string;
  hr_desk_email?: string;
  hr_emergency_phone?: string;
  escalation_vp_name?: string;
  posh_grievance_email?: string;
  auto_alert_on_candidate_acceptance: boolean;
  weekly_policy_attendance_digest: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

function transformApiResponse<T>(response: APIResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    return (response as APIResponse<T>).data;
  }
  return response as T;
}

// ==========================================
// Settings RTK Query Endpoints
// ==========================================

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // A1: Company Identity & Details
    getCompanySettings: builder.query<CompanySettings, void>({
      query: () => "/api/v1/settings/company",
      keepUnusedDataFor: 300,
      transformResponse: transformApiResponse,
      providesTags: ["CompanySettings"],
    }),

    updateCompanySettings: builder.mutation<CompanySettings, Partial<CompanySettings>>({
      query: (body) => ({
        url: "/api/v1/settings/company",
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: ["CompanySettings"],
    }),

    // A2: Password & Access Security
    changePassword: builder.mutation<APIResponse<unknown> | void, ChangePasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/change-password",
        method: "PATCH",
        body,
      }),
      transformResponse: transformApiResponse,
    }),

    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => "/api/v1/settings/security",
      keepUnusedDataFor: 300,
      transformResponse: transformApiResponse,
      providesTags: ["SecuritySettings"],
    }),

    updateSecuritySettings: builder.mutation<SecuritySettings, Partial<SecuritySettings>>({
      query: (body) => ({
        url: "/api/v1/settings/security",
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: ["SecuritySettings"],
    }),

    // A3: Billing & Subscription
    getBilling: builder.query<BillingSettings, void>({
      query: () => "/api/v1/settings/billing",
      keepUnusedDataFor: 300,
      transformResponse: transformApiResponse,
      providesTags: ["BillingSettings"],
    }),

    updateBilling: builder.mutation<BillingSettings, Partial<BillingSettings>>({
      query: (body) => ({
        url: "/api/v1/settings/billing",
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: ["BillingSettings"],
    }),

    // B3: HR Administration & Grievance Directory
    getHrDirectory: builder.query<HRDirectory, void>({
      query: () => "/api/v1/hr-directory",
      keepUnusedDataFor: 300,
      transformResponse: transformApiResponse,
      providesTags: ["HRDirectory"],
    }),

    updateHrDirectory: builder.mutation<HRDirectory, Partial<HRDirectory>>({
      query: (body) => ({
        url: "/api/v1/hr-directory",
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: ["HRDirectory"],
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useChangePasswordMutation,
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetBillingQuery,
  useUpdateBillingMutation,
  useGetHrDirectoryQuery,
  useUpdateHrDirectoryMutation,
} = settingsApi;

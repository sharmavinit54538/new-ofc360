import { describe, it, expect } from "vitest";
import {
  settingsApi,
  normalizeHRSettings,
  normalizeMFAResponse,
} from "@/features/settings/api/settingsApi";
import {
  billingApi,
  normalizeSubscription,
  normalizePaymentMethod,
  normalizeInvoice,
} from "@/features/settings/api/billingApi";

describe("Settings & Billing API Services & Normalizers", () => {
  // =========================================================================
  // 1. HR Settings Normalization & Endpoints
  // =========================================================================
  describe("HR Settings Normalization", () => {
    it("should correctly normalize raw snake_case backend HR settings response", () => {
      const rawSnake = {
        head_name: "Priya Sharma",
        official_email: "priya.sharma@company.com",
        phone: "+91 98765 43210",
        escalation_lead: "Rajesh Verma",
        grievance_email: "grievance@company.com",
        auto_onboarding_alerts: true,
        policy_digest_weekly: true,
        company_id: "comp_123",
      };

      const normalized = normalizeHRSettings(rawSnake);
      expect(normalized.headName).toBe("Priya Sharma");
      expect(normalized.officialEmail).toBe("priya.sharma@company.com");
      expect(normalized.phone).toBe("+91 98765 43210");
      expect(normalized.escalationLead).toBe("Rajesh Verma");
      expect(normalized.grievanceEmail).toBe("grievance@company.com");
      expect(normalized.autoOnboardingAlerts).toBe(true);
      expect(normalized.policyDigestWeekly).toBe(true);
    });

    it("should correctly normalize camelCase HR settings with default fallbacks", () => {
      const rawCamel = {
        headName: "Amit Patel",
        officialEmail: "amit@company.com",
        phone: "9988776655",
        escalationLead: "Neha Gupta",
        grievanceEmail: "posh@company.com",
        autoOnboardingAlerts: false,
        policyDigestWeekly: false,
      };

      const normalized = normalizeHRSettings(rawCamel);
      expect(normalized.headName).toBe("Amit Patel");
      expect(normalized.officialEmail).toBe("amit@company.com");
      expect(normalized.autoOnboardingAlerts).toBe(false);
      expect(normalized.policyDigestWeekly).toBe(false);
    });

    it("should handle null or empty response gracefully with safe defaults", () => {
      const normalized = normalizeHRSettings(null);
      expect(normalized.headName).toBe("");
      expect(normalized.officialEmail).toBe("");
      expect(normalized.phone).toBe("");
      expect(normalized.autoOnboardingAlerts).toBe(false);
      expect(normalized.policyDigestWeekly).toBe(false);
    });

    it("should expose getHRSettings and updateHRSettings endpoints on settingsApi", () => {
      expect(settingsApi.endpoints).toHaveProperty("getHRSettings");
      expect(settingsApi.endpoints).toHaveProperty("updateHRSettings");
    });
  });

  // =========================================================================
  // 2. MFA Security Normalization & Endpoints
  // =========================================================================
  describe("MFA Security Normalization", () => {
    it("should normalize MFA enable response with QR code URI and secret key", () => {
      const rawMFA = {
        enabled: false,
        requires_verification: true,
        secret: "JBSWY3DPEHPK3PXP",
        qr_code_uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        provisioning_uri: "otpauth://totp/OFC360:admin@company.com?secret=JBSWY3DPEHPK3PXP",
        message: "Scan QR code to complete 2FA setup",
      };

      const normalized = normalizeMFAResponse(rawMFA);
      expect(normalized.enabled).toBe(false);
      expect(normalized.requiresVerification).toBe(true);
      expect(normalized.secret).toBe("JBSWY3DPEHPK3PXP");
      expect(normalized.qrCodeUri).toContain("data:image/png;base64");
      expect(normalized.provisioningUri).toContain("otpauth://");
    });

    it("should normalize direct MFA activation response", () => {
      const rawDirect = {
        enabled: true,
        success: true,
        message: "MFA activated",
      };

      const normalized = normalizeMFAResponse(rawDirect);
      expect(normalized.enabled).toBe(true);
      expect(normalized.requiresVerification).toBe(false);
    });

    it("should expose MFA endpoints on settingsApi", () => {
      expect(settingsApi.endpoints).toHaveProperty("enableMFA");
      expect(settingsApi.endpoints).toHaveProperty("disableMFA");
      expect(settingsApi.endpoints).toHaveProperty("verifyMFA");
      expect(settingsApi.endpoints).toHaveProperty("getMFASettings");
    });
  });

  // =========================================================================
  // 3. Billing Subscription Normalization & Endpoints
  // =========================================================================
  describe("Billing Subscription Normalization", () => {
    it("should normalize real backend subscription data", () => {
      const rawSub = {
        id: "sub_live_999",
        plan: "Growth Tier",
        price: 9999,
        currency: "INR",
        billing_cycle: "Annual",
        status: "active",
        seats: 100,
        used_seats: 42,
        renewal_date: "2027-08-15",
        features: ["ai_copilot", "unlimited_storage", "live_connect"],
      };

      const normalized = normalizeSubscription(rawSub);
      expect(normalized.id).toBe("sub_live_999");
      expect(normalized.plan).toBe("Growth Tier");
      expect(normalized.price).toBe(9999);
      expect(normalized.currency).toBe("INR");
      expect(normalized.billingCycle).toBe("Annual");
      expect(normalized.status).toBe("active");
      expect(normalized.seats).toBe(100);
      expect(normalized.usedSeats).toBe(42);
      expect(normalized.renewalDate).toBe("2027-08-15");
    });

    it("should provide safe default values when subscription is missing or free tier", () => {
      const normalized = normalizeSubscription(null);
      expect(normalized.plan).toBe("Community Tier");
      expect(normalized.price).toBe(0);
      expect(normalized.status).toBe("inactive");
      expect(normalized.seats).toBe(0);
      expect(normalized.usedSeats).toBe(0);
    });

    it("should expose getSubscription endpoint on billingApi", () => {
      expect(billingApi.endpoints).toHaveProperty("getSubscription");
    });
  });

  // =========================================================================
  // 4. Payment Methods Normalization & Endpoints
  // =========================================================================
  describe("Payment Methods Normalization", () => {
    it("should normalize tokenized card payment method safely without sensitive data", () => {
      const rawCard = {
        id: "pm_card_001",
        type: "card",
        brand: "Mastercard",
        last4: "8888",
        exp_month: 6,
        exp_year: 2029,
        is_default: true,
        cardholder_name: "Rahul Sharma",
      };

      const normalized = normalizePaymentMethod(rawCard);
      expect(normalized.id).toBe("pm_card_001");
      expect(normalized.type).toBe("card");
      expect(normalized.brand).toBe("Mastercard");
      expect(normalized.last4).toBe("8888");
      expect(normalized.expMonth).toBe(6);
      expect(normalized.expYear).toBe(2029);
      expect(normalized.isDefault).toBe(true);
      expect(normalized.cardholderName).toBe("Rahul Sharma");
    });

    it("should expose payment method CRUD endpoints on billingApi", () => {
      expect(billingApi.endpoints).toHaveProperty("getPaymentMethods");
      expect(billingApi.endpoints).toHaveProperty("addPaymentMethod");
      expect(billingApi.endpoints).toHaveProperty("deletePaymentMethod");
      expect(billingApi.endpoints).toHaveProperty("setDefaultPaymentMethod");
    });
  });

  // =========================================================================
  // 5. Billing Invoices Normalization & Endpoints
  // =========================================================================
  describe("Billing Invoices Normalization", () => {
    it("should normalize invoice records with date, currency, status, and download URL", () => {
      const rawInvoice = {
        id: "inv_2026_08_01",
        invoice_number: "INV-2026-088",
        amount: 14999,
        currency: "INR",
        status: "paid",
        issue_date: "2026-08-01",
        download_url: "https://api.ofc360.com/invoices/INV-2026-088.pdf",
      };

      const normalized = normalizeInvoice(rawInvoice);
      expect(normalized.id).toBe("inv_2026_08_01");
      expect(normalized.invoiceNumber).toBe("INV-2026-088");
      expect(normalized.amount).toBe(14999);
      expect(normalized.currency).toBe("INR");
      expect(normalized.status).toBe("paid");
      expect(normalized.issueDate).toBe("2026-08-01");
      expect(normalized.downloadUrl).toBe("https://api.ofc360.com/invoices/INV-2026-088.pdf");
    });

    it("should expose getInvoices and downloadInvoice endpoints on billingApi", () => {
      expect(billingApi.endpoints).toHaveProperty("getInvoices");
      expect(billingApi.endpoints).toHaveProperty("downloadInvoice");
    });
  });
});
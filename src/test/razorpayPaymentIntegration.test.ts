import { describe, it, expect, vi, beforeEach } from "vitest";
import { billingRazorpayApi } from "@/features/settings/api/billing/billingRazorpayEndpoints";
import { loadRazorpayScript, triggerRazorpayCheckout } from "@/services/payment/razorpayService";

describe("OFC360 Razorpay Real Payment Gateway Integration Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Razorpay RTK Query Endpoints Contract", () => {
    it("should have createRazorpayOrder mutation defined", () => {
      expect(billingRazorpayApi.endpoints.createRazorpayOrder).toBeDefined();
      expect(typeof billingRazorpayApi.endpoints.createRazorpayOrder.initiate).toBe("function");
    });

    it("should have verifyRazorpayPayment mutation defined", () => {
      expect(billingRazorpayApi.endpoints.verifyRazorpayPayment).toBeDefined();
      expect(typeof billingRazorpayApi.endpoints.verifyRazorpayPayment.initiate).toBe("function");
    });
  });

  describe("2. Razorpay Client SDK Trigger Flow", () => {
    it("should load the script or resolve true if already loaded", async () => {
      window.Razorpay = vi.fn().mockImplementation(() => ({
        open: vi.fn(),
        on: vi.fn(),
      }));

      const loaded = await loadRazorpayScript();
      expect(loaded).toBe(true);
    });

    it("should open Razorpay checkout modal and resolve on successful payment handler", async () => {
      const mockOpen = vi.fn();
      let capturedOptions: any;

      window.Razorpay = vi.fn().mockImplementation((options) => {
        capturedOptions = options;
        return {
          open: mockOpen,
          on: vi.fn(),
        };
      });

      const checkoutPromise = triggerRazorpayCheckout({
        key: "rzp_test_123456",
        amount: 500000,
        currency: "INR",
        name: "OFC360 Enterprise Suite",
        description: "Upgrade to Professional Tier",
        order_id: "order_test_999",
      });

      // Wait a microtick for loadRazorpayScript to resolve
      await new Promise((r) => setTimeout(r, 10));

      expect(mockOpen).toHaveBeenCalled();
      expect(capturedOptions.name).toBe("OFC360 Enterprise Suite");
      expect(capturedOptions.order_id).toBe("order_test_999");

      // Simulate Razorpay payment success callback
      capturedOptions.handler({
        razorpay_payment_id: "pay_xyz123",
        razorpay_order_id: "order_test_999",
        razorpay_signature: "sig_abc789",
      });

      const result = await checkoutPromise;
      expect(result).toEqual({
        razorpay_payment_id: "pay_xyz123",
        razorpay_order_id: "order_test_999",
        razorpay_signature: "sig_abc789",
      });
    });

    it("should reject checkout when user dismisses modal", async () => {
      let capturedOptions: any;
      window.Razorpay = vi.fn().mockImplementation((options) => {
        capturedOptions = options;
        return {
          open: vi.fn(),
          on: vi.fn(),
        };
      });

      const checkoutPromise = triggerRazorpayCheckout({
        key: "rzp_test_123456",
        amount: 500000,
        currency: "INR",
        name: "OFC360 Enterprise Suite",
        description: "Upgrade to Professional Tier",
        order_id: "order_test_999",
      });

      // Wait a microtick for loadRazorpayScript to resolve
      await new Promise((r) => setTimeout(r, 10));

      capturedOptions.modal.ondismiss();

      await expect(checkoutPromise).rejects.toThrow("Payment was cancelled by the user.");
    });
  });
});

import { RazorpayCheckoutOptions } from "@/types/api/settings/razorpayTypes";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Dynamically loads the official Razorpay Checkout SDK script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout SDK");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/**
 * Initializes and triggers the Razorpay modal checkout popup
 */
export async function triggerRazorpayCheckout(
  options: Omit<RazorpayCheckoutOptions, "handler">
): Promise<{
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}> {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    throw new Error("Razorpay SDK could not be loaded. Please check your internet connection.");
  }

  return new Promise((resolve, reject) => {
    try {
      const rzpOptions: RazorpayCheckoutOptions = {
        ...options,
        handler: (response) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment was cancelled by the user."));
          },
          ...options.modal,
        },
      };

      const rzpInstance = new window.Razorpay(rzpOptions);
      rzpInstance.open();
    } catch (err) {
      reject(err);
    }
  });
}

import { describe, it, expect } from "vitest";
import { normalizeError } from "@/services/api/normalizeError";

describe("normalizeError", () => {
  it("should normalize HTTP 400 Bad Request", () => {
    const rawError = { status: 400, data: { detail: "Malformed payload structure" } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(400);
    expect(normalized.message).toBe("Malformed payload structure");
  });

  it("should normalize HTTP 401 status error", () => {
    const rawError = { status: 401, data: { message: "Invalid credentials" } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(401);
    expect(normalized.message).toBe("Invalid credentials");
  });

  it("should normalize HTTP 403 Forbidden with unverified email message", () => {
    const rawError = { status: 403, data: { detail: "Email address not verified. Please verify your email." } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(403);
    expect(normalized.message).toContain("not verified");
  });

  it("should normalize HTTP 404 status when server message is absent", () => {
    const rawError = { status: 404 };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(404);
    expect(normalized.message).toContain("Not Found");
  });

  it("should normalize HTTP 409 Conflict error", () => {
    const rawError = { status: 409, data: { detail: "User with this email already exists" } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(409);
    expect(normalized.message).toBe("User with this email already exists");
  });

  it("should normalize HTTP 410 Expired code error", () => {
    const rawError = { status: 410, data: { message: "OTP code has expired" } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(410);
    expect(normalized.message).toBe("OTP code has expired");
  });

  it("should normalize HTTP 422 FastAPI validation errors", () => {
    const rawError = {
      status: 422,
      data: {
        detail: [
          { loc: ["body", "email"], msg: "value is not a valid email address", type: "value_error" },
          { loc: ["body", "password"], msg: "ensure this value has at least 8 characters", type: "value_error" },
        ],
      },
    };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(422);
    expect(normalized.message).toContain("email: value is not a valid email address");
    expect(normalized.message).toContain("password: ensure this value has at least 8 characters");
  });

  it("should normalize HTTP 422 Laravel/Express errors object", () => {
    const rawError = {
      status: 422,
      data: {
        errors: {
          phone: ["The phone number must be 10 digits."],
        },
      },
    };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(422);
    expect(normalized.message).toContain("phone: The phone number must be 10 digits.");
  });

  it("should normalize HTTP 429 Too Many Requests", () => {
    const rawError = { status: 429, data: { message: "Too many login attempts. Please wait 60 seconds." } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(429);
    expect(normalized.message).toContain("Too many login attempts");
  });

  it("should sanitize raw 500 stack traces and HTML error pages", () => {
    const rawError = {
      status: 500,
      data: {
        detail: "Traceback (most recent call last):\n  File 'app/main.py', line 45, in <module>\nInternal Server Error",
      },
    };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(500);
    expect(normalized.message).toBe("Internal Server Error: An unexpected server error occurred.");
  });

  it("should handle OAuth2 error_description", () => {
    const rawError = {
      status: 400,
      data: {
        error: "invalid_grant",
        error_description: "Refresh token has expired or is revoked",
      },
    };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(400);
    expect(normalized.message).toBe("Refresh token has expired or is revoked");
  });

  it("should handle RTK Query FETCH_ERROR", () => {
    const rawError = { status: "FETCH_ERROR", error: "TypeError: Failed to fetch" };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe("FETCH_ERROR");
    expect(normalized.message).toContain("Network Error");
  });

  it("should handle RTK Query TIMEOUT_ERROR", () => {
    const rawError = { status: "TIMEOUT_ERROR" };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe("TIMEOUT_ERROR");
    expect(normalized.message).toContain("Timeout");
  });

  it("should handle generic JavaScript Error", () => {
    const rawError = new Error("Custom client side exception");
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe("CUSTOM_ERROR");
    expect(normalized.message).toBe("Custom client side exception");
  });
});
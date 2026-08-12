import { describe, it, expect } from "vitest";
import { normalizeError } from "@/services/api/normalizeError";

describe("normalizeError", () => {
  it("should normalize HTTP 401 status error", () => {
    const rawError = { status: 401, data: { message: "Invalid credentials" } };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(401);
    expect(normalized.message).toBe("Invalid credentials");
  });

  it("should return default status text if server message is absent", () => {
    const rawError = { status: 404 };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe(404);
    expect(normalized.message).toContain("Not Found");
  });

  it("should handle RTK Query FETCH_ERROR", () => {
    const rawError = { status: "FETCH_ERROR", error: "TypeError: Failed to fetch" };
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe("FETCH_ERROR");
    expect(normalized.message).toContain("Network Error");
  });

  it("should handle generic JavaScript Error", () => {
    const rawError = new Error("Custom client side exception");
    const normalized = normalizeError(rawError);
    expect(normalized.status).toBe("CUSTOM_ERROR");
    expect(normalized.message).toBe("Custom client side exception");
  });
});

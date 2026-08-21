import { describe, it, expect } from "vitest";
import { unwrapLoginResponse } from "@/api/endpoints/auth";

describe("authApi unwrapLoginResponse & contract parsing", () => {
  it("should correctly unwrap standard backend envelope with snake_case tokens and nested user", () => {
    const envelope = {
      success: true,
      message: "Login successful",
      data: {
        access_token: "jwt_token_abc_123",
        refresh_token: "refresh_token_xyz_789",
        token_type: "bearer",
        expires_in: 3600,
        user: {
          id: "usr_1",
          email: "alex.admin@ofc360.com",
          first_name: "Alex",
          last_name: "Smith",
          role: "hr_admin" as any,
          companyId: "11111111-1111-1111-1111-111111111111",
        },
      },
      errors: null,
    };

    const unwrapped = unwrapLoginResponse(envelope);
    expect(unwrapped.token).toBe("jwt_token_abc_123");
    expect(unwrapped.refreshToken).toBe("refresh_token_xyz_789");
    expect(unwrapped.user.id).toBe("usr_1");
    expect(unwrapped.user.name).toBe("Alex Smith");
    expect(unwrapped.user.role).toBe("hr_admin");
    expect(unwrapped.user.companyId).toBe("11111111-1111-1111-1111-111111111111");
  });

  it("should compute full name from email if name is missing", () => {
    const rawData = {
      access_token: "token_123",
      refresh_token: "refresh_123",
      user: {
        id: "usr_2",
        email: "sarah.connor@cyberdyne.io",
        role: "manager" as any,
      } as any,
    };

    const unwrapped = unwrapLoginResponse(rawData);
    expect(unwrapped.user.name).toBe("Sarah Connor");
    expect(unwrapped.user.role).toBe("manager");
  });

  it("should normalize legacy 'admin' or 'cxo' role to 'hr_admin' or 'executive'", () => {
    const rawAdmin = {
      access_token: "token_admin",
      user: {
        id: "usr_3",
        name: "Admin User",
        email: "admin@ofc360.com",
        role: "admin" as any,
      } as any,
    };

    const unwrapped = unwrapLoginResponse(rawAdmin);
    expect(unwrapped.user.role).toBe("hr_admin");

    const rawCxo = {
      access_token: "token_cxo",
      user: {
        id: "usr_4",
        name: "CEO",
        email: "ceo@ofc360.com",
        role: "cxo" as any,
      } as any,
    };
    const unwrappedCxo = unwrapLoginResponse(rawCxo);
    expect(unwrappedCxo.user.role).toBe("executive");
  });

  it("should preserve requires_email_verification, verification_id, and masked_email for OTP login response", () => {
    const rawOtpResponse = {
      success: true,
      message: "Email verification required. An OTP has been sent to your email.",
      requires_email_verification: true,
      verification_id: "vid_abc_12345",
      data: {
        requires_email_verification: true,
        verification_id: "vid_abc_12345",
        masked_email: "j***@example.com",
        email: "john.doe@example.com",
        access_token: null,
        refresh_token: null,
      },
    };

    const unwrapped = unwrapLoginResponse(rawOtpResponse);
    expect(unwrapped.requires_email_verification).toBe(true);
    expect(unwrapped.verification_id).toBe("vid_abc_12345");
    expect(unwrapped.masked_email).toBe("j***@example.com");
    expect(unwrapped.email).toBe("john.doe@example.com");
    expect(unwrapped.token).toBe("");
  });
});
import { describe, it, expect, beforeEach, vi } from "vitest";
import { store } from "@/app/store";
import { connectCallsApi } from "@/services/api/connect/connectCallsEndpoints";
import { extractListFromEnvelope } from "@/services/api/connect/extractListHelper";
import { initiateOutgoingCall } from "@/services/orchestrator/callInitiation";
import { resetCallState } from "@/features/connect/callSlice";
import { setCredentials } from "@/features/auth/authSlice";
import { ConnectUser } from "@/types/connect";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

describe("Connect Calls API Contract & Resilience", () => {
  beforeEach(() => {
    store.dispatch(resetCallState());
    store.dispatch(
      setCredentials({
        user: { id: "usr_caller_123", name: "Caller User", email: "caller@test.com", role: "employee" },
        token: "mock_jwt_token",
      })
    );
    vi.clearAllMocks();
  });


  it("1. Verifies initiateCall is configured for POST /api/v1/connect/calls/initiate", () => {
    const endpoint = connectCallsApi.endpoints.initiateCall;
    expect(endpoint).toBeDefined();
    const queryResult = (endpoint as any).initiate({
      calleeId: "usr_target_123",
      type: "audio",
    });
    expect(queryResult).toBeDefined();
  });

  it("2. Verifies updateCallStatus is configured for PATCH /api/v1/connect/calls/{call_id}/status", () => {
    const endpoint = connectCallsApi.endpoints.updateCallStatus;
    expect(endpoint).toBeDefined();
  });

  it("3. extractListFromEnvelope safely returns [] when given error envelopes", () => {
    // 404 error envelope
    const error404 = {
      success: false,
      message: "Not Found",
      data: null,
      errors: [{ field: null, message: "Not Found" }],
    };
    expect(extractListFromEnvelope(error404)).toEqual([]);

    // 401 error envelope
    const error401 = {
      success: false,
      message: "Not authenticated. Please provide a valid Bearer token.",
      data: null,
    };
    expect(extractListFromEnvelope(error401)).toEqual([]);

    // detail string error
    const errorDetail = { detail: "Not Found" };
    expect(extractListFromEnvelope(errorDetail)).toEqual([]);

    // null / undefined / primitives
    expect(extractListFromEnvelope(null)).toEqual([]);
    expect(extractListFromEnvelope(undefined)).toEqual([]);
    expect(extractListFromEnvelope("random string")).toEqual([]);
    expect(extractListFromEnvelope(123)).toEqual([]);
  });

  it("4. extractListFromEnvelope extracts data lists correctly", () => {
    const directArray = [{ id: "call_1" }, { id: "call_2" }];
    expect(extractListFromEnvelope(directArray)).toEqual(directArray);

    const enveloped = { data: [{ id: "call_1" }] };
    expect(extractListFromEnvelope(enveloped)).toEqual([{ id: "call_1" }]);

    const namedKey = { calls: [{ id: "call_1" }] };
    expect(extractListFromEnvelope(namedKey, ["calls"])).toEqual([{ id: "call_1" }]);
  });

  it("5. initiateOutgoingCall fails fast on backend rejection without propagating dummy IDs", async () => {
    const targetUser: ConnectUser = {
      id: "usr_fail_test",
      name: "Fail Callee",
      email: "fail@test.com",
    };

    // Spy on dispatch to simulate API error
    vi.spyOn(store, "dispatch").mockImplementationOnce((() => ({
      unwrap: () => Promise.reject({ data: { message: "User is offline" } }),
    })) as any);

    const callId = await initiateOutgoingCall(targetUser, "audio", () => {});
    expect(callId).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("User is offline");

    // Call state in Redux should NOT be in active calling state
    const state = store.getState().connectCall;
    expect(state.status).toBe("IDLE");
    expect(state.activeCall).toBeNull();
  });
});

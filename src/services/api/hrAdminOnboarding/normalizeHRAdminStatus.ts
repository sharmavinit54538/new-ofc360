import { RawEnvelope, unwrapEnvelope } from "../envelope";
import type { OnboardingStatusResponse } from "@/types/hrAdminOnboardingApi.types";

export function normalizeOnboardingStatusResponse(
  raw: RawEnvelope<OnboardingStatusResponse> | any
): OnboardingStatusResponse {
  const data = unwrapEnvelope(raw) || {};
  const completed = Boolean(data.completed ?? data.is_completed ?? data.onboarding_completed ?? false);
  const current_step = typeof data.current_step === "number" ? data.current_step : 0;
  const total_steps = typeof data.total_steps === "number" ? data.total_steps : 4;
  return { completed, current_step, total_steps };
}

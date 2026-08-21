export * from "./settings/normalizeHRSettings";
export * from "./settings/normalizeMFAResponse";
export * from "./settings/hrSettingsEndpoints";
export * from "./settings/mfaSettingsEndpoints";

import { hrSettingsApi } from "./settings/hrSettingsEndpoints";
import { mfaSettingsApi } from "./settings/mfaSettingsEndpoints";

export const settingsApi = {
  ...hrSettingsApi,
  ...mfaSettingsApi,
};
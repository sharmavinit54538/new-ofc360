export * from "./managers/managerApiTypes";
export * from "./managers/managerNormalizers";
export * from "./managers/buildManagerCreatePayload";
export * from "./managers/buildManagerUpdatePayload";
export * from "./managers/normalizeManager";
export * from "./managers/managerCrudEndpoints";
export * from "./managers/managerPermissionsEndpoints";
export * from "./managers/managerOnboardingEndpoints";

import { managerCrudApi } from "./managers/managerCrudEndpoints";
import { managerPermissionsApi } from "./managers/managerPermissionsEndpoints";
import { managerOnboardingApi } from "./managers/managerOnboardingEndpoints";

export const managerApi = {
  ...managerCrudApi,
  ...managerPermissionsApi,
  ...managerOnboardingApi,
};
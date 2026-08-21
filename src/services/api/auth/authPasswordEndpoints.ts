export * from "./authPasswordTypes";
export * from "./authPasswordResetEndpoints";
export * from "./authChangePasswordEndpoints";

import { authPasswordResetApi } from "./authPasswordResetEndpoints";
import { authChangePasswordApi } from "./authChangePasswordEndpoints";

export const authPasswordApi = {
  ...authPasswordResetApi,
  ...authChangePasswordApi,
};

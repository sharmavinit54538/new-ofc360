export * from "./auth/authApiTypes";
export * from "./auth/authPasswordTypes";
export * from "./auth/unwrapLoginResponse";
export * from "./auth/authLoginEndpoints";
export * from "./auth/authSessionEndpoints";
export * from "./auth/authOtpEndpoints";
export * from "./auth/authEmailOtpEndpoints";
export * from "./auth/authPasswordEndpoints";

import { authLoginApi } from "./auth/authLoginEndpoints";
import { authSessionApi } from "./auth/authSessionEndpoints";
import { authOtpApi } from "./auth/authOtpEndpoints";
import { authEmailOtpApi } from "./auth/authEmailOtpEndpoints";
import { authPasswordApi } from "./auth/authPasswordEndpoints";

export const authApi = {
  ...authLoginApi, ...authSessionApi, ...authOtpApi, ...authEmailOtpApi, ...authPasswordApi,
};
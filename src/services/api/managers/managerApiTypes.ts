export interface GetManagersQueryParams {
  department?: string; status?: string; search?: string; page?: number; limit?: number;
}
export type GetManagersQueryArg = GetManagersQueryParams | void;
export interface SendManagerInvitePayload { managerId?: string; email?: string; }
export interface ActivateManagerPayload { id: string; token?: string; password?: string; [key: string]: unknown; }
export interface ActivateManagerOnboardingPayload { token: string; password?: string; full_name?: string; [key: string]: unknown; }
export interface ValidateOnboardingTokenResponse { valid: boolean; email?: string; managerId?: string; [key: string]: unknown; }
export interface ResetPasswordResponse { temporaryPassword?: string; message?: string; }

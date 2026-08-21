import { RootState } from "@/app/store";
import { isValidToken, isValidUUID, isPublicRequest } from "@/services/auth/authStorage";

export const prepareBaseHeaders = (headers: Headers, { getState, endpoint }: { getState: () => unknown; endpoint: string }) => {
  const state = getState() as RootState;
  const token = state?.auth?.token;
  const companyId = state?.auth?.companyId || state?.company?.activeCompany?.id;
  const isPublic = isPublicRequest(undefined, endpoint);
  if (isValidToken(token) && !isPublic) headers.set("Authorization", `Bearer ${token.trim()}`);
  if (companyId && isValidUUID(companyId) && !isPublic) headers.set("X-Company-ID", companyId.trim());
  return headers;
};

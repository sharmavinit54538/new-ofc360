import type { RootState } from "@/app/store";
import { isValidToken, isValidUUID, needsCompanyId } from "../authStorage";
import { waitFor } from "./retryHelpers";

export async function validateCompanyHeader(requestUrl: string, api: any): Promise<boolean> {
  const state = api.getState() as RootState;
  const token = state?.auth?.token;
  if (isValidToken(token) && needsCompanyId(requestUrl, api.endpoint)) {
    let companyId = state?.auth?.companyId || state?.company?.activeCompany?.id;
    if (!isValidUUID(companyId) && state?.auth?.isInitializing) {
      await waitFor(() => !(api.getState() as RootState).auth.isInitializing, 2000, 50);
    }
    const finalState = api.getState() as RootState;
    companyId = finalState?.auth?.companyId || finalState?.company?.activeCompany?.id;
    if (!isValidUUID(companyId)) return false;
  }
  return true;
}

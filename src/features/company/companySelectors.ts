import { RootState } from "@/app/store";

export const selectActiveCompany = (state: RootState) => state.company.activeCompany;
export const selectAvailableCompanies = (state: RootState) => state.company.availableCompanies;

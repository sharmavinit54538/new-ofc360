import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CompanyInfo {
  id: string;
  name: string;
  code: string;
  domain?: string;
  logoUrl?: string;
}

export interface CompanyState {
  activeCompany: CompanyInfo | null;
  availableCompanies: CompanyInfo[];
}

const defaultCompany: CompanyInfo = {
  id: "comp_01",
  name: "EquinoxSphere Corp",
  code: "EQS",
  domain: "equinoxsphere.com",
};

const initialState: CompanyState = {
  activeCompany: defaultCompany,
  availableCompanies: [
    defaultCompany,
    {
      id: "comp_02",
      name: "NexaHR Solutions",
      code: "NEX",
      domain: "nexahr.com",
    },
  ],
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setActiveCompany: (state, action: PayloadAction<CompanyInfo>) => {
      state.activeCompany = action.payload;
    },
    setAvailableCompanies: (state, action: PayloadAction<CompanyInfo[]>) => {
      state.availableCompanies = action.payload;
    },
  },
});

export const { setActiveCompany, setAvailableCompanies } = companySlice.actions;

export default companySlice.reducer;

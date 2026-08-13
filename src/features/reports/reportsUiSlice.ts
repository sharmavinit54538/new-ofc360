import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportCategory, ReportsUiState } from "./types";

const initialState: ReportsUiState = {
  activeCategory: "workforce",
  dateRange: {},
  reportListFilters: {
    page: 1,
    limit: 100,
  },
};

export const reportsUiSlice = createSlice({
  name: "reportsUi",
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<ReportCategory>) => {
      state.activeCategory = action.payload;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ from?: string; to?: string }>
    ) => {
      state.dateRange = action.payload;
    },
    setReportListFilters: (
      state,
      action: PayloadAction<Partial<ReportsUiState["reportListFilters"]>>
    ) => {
      state.reportListFilters = {
        ...state.reportListFilters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.reportListFilters = { page: 1, limit: 100 };
      state.dateRange = {};
    },
  },
});

export const {
  setActiveCategory,
  setDateRange,
  setReportListFilters,
  resetFilters,
} = reportsUiSlice.actions;

export default reportsUiSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PayrollUiState, PayrollModalType, PayslipFilterState, BankTransferFilterState } from "./types";
const initialState: PayrollUiState = { selectedCycleId: null, activeModal: null, payslipFilters: { page: 1, limit: 10 }, bankTransferFilters: { page: 1, limit: 10 } };
export const payrollUiSlice = createSlice({
  name: "payrollUi",
  initialState,
  reducers: {
    setSelectedCycleId: (state, action: PayloadAction<string | null>) => { state.selectedCycleId = action.payload; },
    setActiveModal: (state, action: PayloadAction<PayrollModalType>) => { state.activeModal = action.payload; },
    setPayslipFilters: (state, action: PayloadAction<Partial<PayslipFilterState>>) => { state.payslipFilters = { ...state.payslipFilters, ...action.payload }; },
    resetPayslipFilters: (state) => { state.payslipFilters = initialState.payslipFilters; },
    setBankTransferFilters: (state, action: PayloadAction<Partial<BankTransferFilterState>>) => { state.bankTransferFilters = { ...state.bankTransferFilters, ...action.payload }; },
    resetBankTransferFilters: (state) => { state.bankTransferFilters = initialState.bankTransferFilters; },
    resetPayrollUiState: () => initialState,
  },
});
export const { setSelectedCycleId, setActiveModal, setPayslipFilters, resetPayslipFilters, setBankTransferFilters, resetBankTransferFilters, resetPayrollUiState } = payrollUiSlice.actions;
export default payrollUiSlice.reducer;
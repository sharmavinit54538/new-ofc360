import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import companyReducer from "@/features/company/companySlice";
import attendanceReducer from "@/features/attendance/attendanceSlice";
import payrollUiReducer from "@/features/payroll/payrollUiSlice";
import reportsUiReducer from "@/features/reports/reportsUiSlice";
import recruitmentUiReducer from "@/features/recruitment/recruitmentUiSlice";
import hrDocumentsUiReducer from "@/features/hrDocuments/hrDocumentsUiSlice";
import onboardingUiReducer from "@/features/onboarding/onboardingUiSlice";
import { baseApi } from "@/services/api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    company: companyReducer,
    attendance: attendanceReducer,
    payrollUi: payrollUiReducer,
    reportsUi: reportsUiReducer,
    recruitmentUi: recruitmentUiReducer,
    hrDocumentsUi: hrDocumentsUiReducer,
    onboardingUi: onboardingUiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

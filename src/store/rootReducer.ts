import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import uiReducer from "./slices/uiSlice";
import notificationReducer from "./slices/notificationSlice";
import permissionReducer from "./slices/permissionSlice";
import companyReducer from "@/features/company/companySlice";
import attendanceReducer from "@/features/attendance/attendanceSlice";
import payrollUiReducer from "@/features/payroll/payrollUiSlice";
import reportsUiReducer from "@/features/reports/reportsUiSlice";
import recruitmentUiReducer from "@/features/recruitment/recruitmentUiSlice";
import hrDocumentsUiReducer from "@/features/hrDocuments/hrDocumentsUiSlice";
import onboardingUiReducer from "@/features/onboarding/onboardingUiSlice";
import { baseApi } from "./api/baseApi";

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  notification: notificationReducer,
  permission: permissionReducer,
  company: companyReducer,
  attendance: attendanceReducer,
  payrollUi: payrollUiReducer,
  reportsUi: reportsUiReducer,
  recruitmentUi: recruitmentUiReducer,
  hrDocumentsUi: hrDocumentsUiReducer,
  onboardingUi: onboardingUiReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

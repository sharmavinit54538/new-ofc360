import { RootState } from "@/app/store";

export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentRole = (state: RootState) => state.auth.role;
export const selectCompanyId = (state: RootState) => state.auth.companyId;
export const selectAuthInitializing = (state: RootState) => state.auth.isInitializing;
export const selectSessionStatus = (state: RootState) => state.auth.sessionStatus;

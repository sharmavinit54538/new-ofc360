import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser, SystemRole, SessionStatus, normalizeRole } from "./authTypes";
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  getStoredCompanyId,
  setStoredAuth,
  clearStoredAuth,
  isValidToken,
} from "@/services/auth/authStorage";

export const getInitialAuthState = (): AuthState => {
  const token = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();
  const user = getStoredUser();
  const companyId = getStoredCompanyId() || user?.companyId || null;
  const hasToken = isValidToken(token);
  const hasRefresh = isValidToken(refreshToken);
  const hasUser = Boolean(user && (user.id || user.email));

  const isPotentialAuth = hasToken || hasRefresh || hasUser;
  const initialRole: SystemRole = normalizeRole(user?.role);

  return {
    user: user || null,
    token: hasToken ? token : null,
    refreshToken: hasRefresh ? refreshToken : null,
    isAuthenticated: isPotentialAuth,
    isInitializing: true,
    role: initialRole,
    companyId: companyId,
    sessionStatus: "loading",
  };
};

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token?: string | null;
        refreshToken?: string | null;
        companyId?: string | null;
      }>
    ) => {
      const { user, token, refreshToken, companyId } = action.payload;
      const hasValidToken =
        typeof token === "string" &&
        token.trim().length > 0 &&
        token !== "undefined" &&
        token !== "null" &&
        token !== "[object Object]";

      const computedName =
        user?.name?.trim() ||
        (user as any)?.full_name?.trim() ||
        ((user as any)?.first_name ? `${(user as any).first_name} ${(user as any).last_name || ""}`.trim() : "") ||
        (user?.email ? user.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "User");

      const normalizedRole = normalizeRole(user?.role);
      const activeCompanyId = companyId || user?.companyId || (user as any)?.company_id || state.companyId;

      const normalizedUser: AuthUser = {
        ...user,
        name: computedName,
        role: normalizedRole,
        companyId: activeCompanyId || undefined,
      };

      const isExplicitEmptyToken = token === "" || token === null;
      const isSessionRestored = token === undefined && Boolean(normalizedUser?.id);
      const isAuth = Boolean(normalizedUser) && (hasValidToken || isSessionRestored) && !isExplicitEmptyToken;

      state.user = isExplicitEmptyToken ? null : normalizedUser;
      state.token = hasValidToken ? token.trim() : (isExplicitEmptyToken ? null : state.token);
      if (refreshToken && typeof refreshToken === "string" && refreshToken.trim().length > 0) {
        state.refreshToken = refreshToken.trim();
      } else if (isExplicitEmptyToken) {
        state.refreshToken = null;
      }
      state.isAuthenticated = isAuth;
      state.isInitializing = false;
      state.sessionStatus = isAuth ? "authenticated" : "unauthenticated";
      state.role = normalizedRole;
      state.companyId = activeCompanyId || null;

      if (isAuth && normalizedUser) {
        setStoredAuth({
          token: state.token,
          refreshToken: state.refreshToken,
          user: normalizedUser,
          companyId: activeCompanyId || null,
        });
      } else if (isExplicitEmptyToken) {
        clearStoredAuth();
      }
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        const updatedRole = action.payload.role
          ? normalizeRole(action.payload.role)
          : state.user.role;
        state.user = {
          ...state.user,
          ...action.payload,
          role: updatedRole,
        };
        state.role = updatedRole;
        if (action.payload.companyId) {
          state.companyId = action.payload.companyId;
        } else if ((action.payload as any).company_id) {
          state.companyId = (action.payload as any).company_id;
        }
        setStoredAuth({
          user: state.user,
          companyId: state.companyId,
        });
      }
    },

    setRole: (state, action: PayloadAction<SystemRole | "admin">) => {
      const role: SystemRole = normalizeRole(action.payload);
      state.role = role;
      if (state.user) {
        state.user.role = role;
        setStoredAuth({
          user: state.user,
          companyId: state.companyId,
        });
      }
    },

    setCompanyContext: (state, action: PayloadAction<string | null>) => {
      state.companyId = action.payload;
      if (state.user) {
        state.user.companyId = action.payload || undefined;
      }
      if (action.payload) {
        setStoredAuth({
          companyId: action.payload,
        });
      }
    },

    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
      if (action.payload) {
        state.sessionStatus = "loading";
      } else {
        state.sessionStatus = state.isAuthenticated ? "authenticated" : "unauthenticated";
      }
    },

    setSessionStatus: (state, action: PayloadAction<SessionStatus>) => {
      state.sessionStatus = action.payload;
      if (action.payload === "loading") {
        state.isInitializing = true;
      } else if (action.payload === "authenticated") {
        state.isInitializing = false;
        state.isAuthenticated = true;
      } else if (action.payload === "unauthenticated") {
        state.isInitializing = false;
        state.isAuthenticated = false;
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.sessionStatus = "unauthenticated";
      state.role = "employee";
      state.companyId = null;

      clearStoredAuth();
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setRole,
  setCompanyContext,
  setInitializing,
  setSessionStatus,
  logout,
} = authSlice.actions;

export { normalizeRole } from "./authTypes";
export type { AuthUser, AuthState, SystemRole } from "./authTypes";

export default authSlice.reducer;
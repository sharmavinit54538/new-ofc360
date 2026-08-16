import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser, SystemRole, SessionStatus, normalizeRole } from "./authTypes";

const TOKEN_KEY = "ofc360_access_token";
const REFRESH_TOKEN_KEY = "ofc360_refresh_token";
const USER_KEY = "ofc360_user";
const COMPANY_KEY = "ofc360_company_id";

const getStoredToken = (): string | null => {
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    return t && t.trim().length > 10 && t !== "undefined" && t !== "null" ? t.trim() : null;
  } catch {
    return null;
  }
};

const getStoredRefreshToken = (): string | null => {
  try {
    const t = localStorage.getItem(REFRESH_TOKEN_KEY);
    return t && t.trim().length > 10 && t !== "undefined" && t !== "null" ? t.trim() : null;
  } catch {
    return null;
  }
};

const getStoredUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as AuthUser;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const getStoredCompanyId = (): string | null => {
  try {
    return localStorage.getItem(COMPANY_KEY);
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();
const normalizedInitialUser: AuthUser | null = initialUser
  ? { ...initialUser, role: normalizeRole(initialUser.role) }
  : null;
const initialToken = getStoredToken();
const initialRefreshToken = getStoredRefreshToken();
const initialCompanyId = normalizedInitialUser?.companyId || (normalizedInitialUser as any)?.company_id || getStoredCompanyId() || null;

const hasTokens = Boolean(initialToken || initialRefreshToken);

const initialState: AuthState = {
  user: normalizedInitialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialToken && normalizedInitialUser),
  isInitializing: hasTokens,
  role: normalizedInitialUser?.role || "employee",
  companyId: initialCompanyId,
  sessionStatus: hasTokens ? (normalizedInitialUser ? "authenticated" : "loading") : "unauthenticated",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        refreshToken?: string;
        companyId?: string;
      }>
    ) => {
      const { user, token, refreshToken, companyId } = action.payload;
      const computedName =
        user.name?.trim() ||
        (user as any).full_name?.trim() ||
        ((user as any).first_name ? `${(user as any).first_name} ${(user as any).last_name || ""}`.trim() : "") ||
        (user.email ? user.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "User");

      const normalizedRole = normalizeRole(user.role);
      const activeCompanyId = companyId || user.companyId || (user as any).company_id || state.companyId;

      const normalizedUser: AuthUser = {
        ...user,
        name: computedName,
        role: normalizedRole,
        companyId: activeCompanyId || undefined,
      };

      state.user = normalizedUser;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.sessionStatus = "authenticated";
      state.role = normalizedRole;
      state.companyId = activeCompanyId;

      try {
        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        if (activeCompanyId) {
          localStorage.setItem(COMPANY_KEY, activeCompanyId);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
      } catch {
        // ignore storage write error
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
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(state.user));
        } catch {
          // ignore
        }
      }
    },

    setRole: (state, action: PayloadAction<SystemRole | "admin">) => {
      const role: SystemRole = normalizeRole(action.payload);
      state.role = role;
      if (state.user) {
        state.user.role = role;
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(state.user));
        } catch {
          // ignore
        }
      }
    },

    setCompanyContext: (state, action: PayloadAction<string | null>) => {
      state.companyId = action.payload;
      if (state.user) {
        state.user.companyId = action.payload || undefined;
      }
      try {
        if (action.payload) {
          localStorage.setItem(COMPANY_KEY, action.payload);
        } else {
          localStorage.removeItem(COMPANY_KEY);
        }
      } catch {
        // ignore
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

      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(COMPANY_KEY);
      } catch {
        // ignore storage error
      }
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


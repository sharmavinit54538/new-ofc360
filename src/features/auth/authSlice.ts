import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser, SystemRole } from "./authTypes";

const TOKEN_KEY = "ofc360_access_token";
const REFRESH_TOKEN_KEY = "ofc360_refresh_token";
const USER_KEY = "ofc360_user";

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const getStoredUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? (JSON.parse(data) as AuthUser) : null;
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();
const initialToken = getStoredToken();
const initialRefreshToken = getStoredRefreshToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialToken && initialUser),
  isInitializing: false,
  role: initialUser?.role || "employee",
  companyId: initialUser?.companyId || null,
  sessionStatus: initialToken && initialUser ? "authenticated" : "unauthenticated",
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
      }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      const computedName =
        user.name?.trim() ||
        user.full_name?.trim() ||
        (user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "") ||
        (user.email ? user.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");

      const normalizedUser = {
        ...user,
        name: computedName || user.name || "User",
      };
      state.user = normalizedUser;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;
      state.sessionStatus = "authenticated";
      state.role = user.role;
      state.companyId = user.companyId || state.companyId;

      try {
        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {
        // ignore storage write error
      }
    },

    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.role) {
          state.role = action.payload.role;
        }
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(state.user));
        } catch {
          // ignore
        }
      }
    },

    setRole: (state, action: PayloadAction<SystemRole | "admin">) => {
      const role: SystemRole = action.payload === "admin" ? "hr_admin" : action.payload;
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
    },

    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
      if (action.payload) {
        state.sessionStatus = "loading";
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.sessionStatus = "unauthenticated";
      state.role = "employee";
      state.companyId = null;

      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
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
  logout,
} = authSlice.actions;

export default authSlice.reducer;

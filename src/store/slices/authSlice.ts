import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '@/types/api/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  companyId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('ofc360_user') || 'null'),
  token: localStorage.getItem('ofc360_access_token') || null,
  refreshToken: localStorage.getItem('ofc360_refresh_token') || null,
  companyId: localStorage.getItem('ofc360_company_id') || null,
  isAuthenticated: Boolean(localStorage.getItem('ofc360_access_token')),
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string; refreshToken?: string; companyId?: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken;
      if (action.payload.companyId) state.companyId = action.payload.companyId;
      state.isAuthenticated = true;

      localStorage.setItem('ofc360_access_token', action.payload.token);
      localStorage.setItem('ofc360_user', JSON.stringify(action.payload.user));
      if (action.payload.refreshToken) localStorage.setItem('ofc360_refresh_token', action.payload.refreshToken);
      if (action.payload.companyId) localStorage.setItem('ofc360_company_id', action.payload.companyId);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.companyId = null;
      state.isAuthenticated = false;

      localStorage.removeItem('ofc360_access_token');
      localStorage.removeItem('ofc360_refresh_token');
      localStorage.removeItem('ofc360_user');
      localStorage.removeItem('ofc360_company_id');
    },
    setCompanyId: (state, action: PayloadAction<string>) => {
      state.companyId = action.payload;
      localStorage.setItem('ofc360_company_id', action.payload);
    },
  },
});

export const { setCredentials, logout, setCompanyId } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export default authSlice.reducer;

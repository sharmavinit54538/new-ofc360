import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PermissionState { permissions: string[]; role: string | null; sidebarPermissions: Record<string, boolean>; }
const initialState: PermissionState = { permissions: [], role: null, sidebarPermissions: {} };

export const permissionSlice = createSlice({
  name: 'permission', initialState,
  reducers: {
    setPermissions: (s, a: PayloadAction<{ permissions: string[]; role?: string }>) => { s.permissions = a.payload.permissions; if (a.payload.role) s.role = a.payload.role; },
    setSidebarPermissions: (s, a: PayloadAction<Record<string, boolean>>) => { s.sidebarPermissions = a.payload; },
  },
});

export const { setPermissions, setSidebarPermissions } = permissionSlice.actions;
export const selectPermissions = (state: { permission: PermissionState }) => state.permission.permissions;
export const selectSidebarPermissions = (state: { permission: PermissionState }) => state.permission.sidebarPermissions;
export default permissionSlice.reducer;
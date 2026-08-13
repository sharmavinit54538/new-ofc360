import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PermissionState {
  permissions: string[];
  role: string | null;
  sidebarPermissions: Record<string, boolean>;
}

const initialState: PermissionState = {
  permissions: [],
  role: null,
  sidebarPermissions: {},
};

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<{ permissions: string[]; role?: string }>) => {
      state.permissions = action.payload.permissions;
      if (action.payload.role) state.role = action.payload.role;
    },
    setSidebarPermissions: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.sidebarPermissions = action.payload;
    },
  },
});

export const { setPermissions, setSidebarPermissions } = permissionSlice.actions;

export const selectPermissions = (state: { permission: PermissionState }) => state.permission.permissions;
export const selectSidebarPermissions = (state: { permission: PermissionState }) => state.permission.sidebarPermissions;

export default permissionSlice.reducer;

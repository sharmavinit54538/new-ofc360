import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState { profile: Record<string, any> | null; preferences: { language: string; timezone: string; emailNotifications: boolean; }; }
const initialState: UserState = { profile: null, preferences: { language: 'en', timezone: 'UTC', emailNotifications: true } };

export const userSlice = createSlice({
  name: 'user', initialState,
  reducers: {
    setUserProfile: (s, a: PayloadAction<Record<string, any>>) => { s.profile = a.payload; },
    updatePreferences: (s, a: PayloadAction<Partial<UserState['preferences']>>) => { s.preferences = { ...s.preferences, ...a.payload }; },
  },
});

export const { setUserProfile, updatePreferences } = userSlice.actions;
export default userSlice.reducer;
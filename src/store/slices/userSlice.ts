import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: Record<string, any> | null;
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
  };
}

const initialState: UserState = {
  profile: null,
  preferences: {
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<Record<string, any>>) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { setUserProfile, updatePreferences } = userSlice.actions;
export default userSlice.reducer;
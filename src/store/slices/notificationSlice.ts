import { createSlice } from '@reduxjs/toolkit';
import { initialNotificationState, type NotificationItem } from "./notification/types";
import { notificationReducers } from "./notification/reducers";

export type { NotificationItem };

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialNotificationState,
  reducers: notificationReducers,
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
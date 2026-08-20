import { PayloadAction } from '@reduxjs/toolkit';
import type { NotificationItem, NotificationState } from "./types";

export const notificationReducers = {
  addNotification: (state: NotificationState, action: PayloadAction<Omit<NotificationItem, 'id' | 'read' | 'createdAt'>>) => {
    state.items.unshift({ ...action.payload, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() });
    state.unreadCount += 1;
  },
  markAsRead: (state: NotificationState, action: PayloadAction<string>) => {
    const item = state.items.find((i) => i.id === action.payload);
    if (item && !item.read) { item.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
  },
  markAllAsRead: (state: NotificationState) => {
    state.items.forEach((item) => { item.read = true; });
    state.unreadCount = 0;
  },
  clearNotifications: (state: NotificationState) => {
    state.items = []; state.unreadCount = 0;
  },
};

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
}

export const initialNotificationState: NotificationState = {
  items: [],
  unreadCount: 0,
};

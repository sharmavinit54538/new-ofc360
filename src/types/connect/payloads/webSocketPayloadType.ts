import type { WebSocketEventType } from "./webSocketEventType";

export interface WebSocketEvent<T = any> {
  type?: WebSocketEventType | string;
  event?: WebSocketEventType | string;
  payload?: T;
  data?: T;
  timestamp?: number | string;
  senderId?: string;
  [key: string]: any;
}

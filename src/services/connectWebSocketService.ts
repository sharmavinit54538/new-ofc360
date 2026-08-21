import { ConnectWebSocketService } from "./websocket/wsServiceClass";
import { registerTokenUpdateListener } from "./auth/authInterceptor";

export * from "./websocket/wsConnectionUrl";
export * from "./websocket/wsHeartbeat";
export * from "./websocket/wsEventRouter";
export * from "./websocket/wsServiceClass";

export const connectWebSocketService = new ConnectWebSocketService();

registerTokenUpdateListener((token) => {
  connectWebSocketService.updateToken(token);
});
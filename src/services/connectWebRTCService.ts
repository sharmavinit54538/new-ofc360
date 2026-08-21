import { ConnectWebRTCService } from "./webrtc/webRTCPeerManager";
export * from "./webrtc/webRTCConfig";
export * from "./webrtc/webRTCMediaManager";
export * from "./webrtc/webRTCSignalManager";
export * from "./webrtc/webRTCPeerManager";

export const connectWebRTCService = new ConnectWebRTCService();
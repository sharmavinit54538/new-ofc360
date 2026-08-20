export interface MediaDeviceInfoState {
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  hasCamera: boolean;
  hasMicrophone: boolean;
  permissionStatus: "prompt" | "granted" | "denied" | "unsupported";
  error: string | null;
  isLoading: boolean;
}

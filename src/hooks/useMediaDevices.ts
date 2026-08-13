import { useState, useEffect, useCallback } from "react";

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

export function useMediaDevices() {
  const [deviceState, setDeviceState] = useState<MediaDeviceInfoState>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
    hasCamera: false,
    hasMicrophone: false,
    permissionStatus: "prompt",
    error: null,
    isLoading: true,
  });

  const checkDevices = useCallback(async () => {
    if (!navigator?.mediaDevices?.enumerateDevices) {
      setDeviceState((prev) => ({
        ...prev,
        permissionStatus: "unsupported",
        error: "Media devices API is not supported in this browser.",
        isLoading: false,
      }));
      return;
    }

    try {
      setDeviceState((prev) => ({ ...prev, isLoading: true, error: null }));
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter((d) => d.kind === "audioinput");
      const audioOutputs = devices.filter((d) => d.kind === "audiooutput");
      const videoInputs = devices.filter((d) => d.kind === "videoinput");

      // Check permission if browser supports query
      let permStatus: MediaDeviceInfoState["permissionStatus"] = "prompt";
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const camQuery = await navigator.permissions.query({ name: "camera" as PermissionName });
          const micQuery = await navigator.permissions.query({ name: "microphone" as PermissionName });
          if (camQuery.state === "granted" || micQuery.state === "granted") {
            permStatus = "granted";
          } else if (camQuery.state === "denied" && micQuery.state === "denied") {
            permStatus = "denied";
          }
        } catch {
          // Permissions query API might not be fully supported for camera/mic on all browsers
        }
      }

      setDeviceState({
        audioInputs,
        audioOutputs,
        videoInputs,
        hasCamera: videoInputs.length > 0,
        hasMicrophone: audioInputs.length > 0,
        permissionStatus: permStatus,
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      setDeviceState((prev) => ({
        ...prev,
        error: err?.message || "Failed to enumerate media devices.",
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    checkDevices();

    if (navigator?.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", checkDevices);
      return () => {
        navigator.mediaDevices.removeEventListener("devicechange", checkDevices);
      };
    }
  }, [checkDevices]);

  return {
    ...deviceState,
    refreshDevices: checkDevices,
  };
}

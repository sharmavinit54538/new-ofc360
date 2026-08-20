import { useState, useEffect, useCallback } from "react";
import type { MediaDeviceInfoState } from "./media/mediaDevicesTypes";
import { fetchMediaDevices } from "./media/fetchMediaDevices";

export type { MediaDeviceInfoState };

export function useMediaDevices() {
  const [deviceState, setDeviceState] = useState<MediaDeviceInfoState>({
    audioInputs: [], audioOutputs: [], videoInputs: [], hasCamera: false, hasMicrophone: false, permissionStatus: "prompt", error: null, isLoading: true,
  });
  const checkDevices = useCallback(async () => {
    if (!navigator?.mediaDevices?.enumerateDevices) return setDeviceState((p) => ({ ...p, permissionStatus: "unsupported", error: "Unsupported", isLoading: false }));
    try { setDeviceState(await fetchMediaDevices()); } catch (err: any) { setDeviceState((p) => ({ ...p, error: err?.message, isLoading: false })); }
  }, []);
  useEffect(() => { checkDevices(); navigator?.mediaDevices?.addEventListener?.("devicechange", checkDevices); return () => { navigator?.mediaDevices?.removeEventListener?.("devicechange", checkDevices); }; }, [checkDevices]);
  return { ...deviceState, refreshDevices: checkDevices };
}
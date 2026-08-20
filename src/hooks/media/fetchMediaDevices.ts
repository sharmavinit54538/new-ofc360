import type { MediaDeviceInfoState } from "./mediaDevicesTypes";
import { queryDevicePermissions } from "./queryDevicePermissions";

export async function fetchMediaDevices(): Promise<MediaDeviceInfoState> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputs = devices.filter((d) => d.kind === "audioinput");
  const audioOutputs = devices.filter((d) => d.kind === "audiooutput");
  const videoInputs = devices.filter((d) => d.kind === "videoinput");
  const permStatus = await queryDevicePermissions();
  return {
    audioInputs, audioOutputs, videoInputs,
    hasCamera: videoInputs.length > 0, hasMicrophone: audioInputs.length > 0,
    permissionStatus: permStatus, error: null, isLoading: false,
  };
}

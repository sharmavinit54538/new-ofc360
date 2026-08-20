import type { MediaDeviceInfoState } from "./mediaDevicesTypes";

export async function queryDevicePermissions(): Promise<MediaDeviceInfoState["permissionStatus"]> {
  if (!navigator.permissions?.query) return "prompt";
  try {
    const cam = await navigator.permissions.query({ name: "camera" as PermissionName });
    const mic = await navigator.permissions.query({ name: "microphone" as PermissionName });
    if (cam.state === "granted" || mic.state === "granted") return "granted";
    if (cam.state === "denied" && mic.state === "denied") return "denied";
  } catch {
    // ignore
  }
  return "prompt";
}

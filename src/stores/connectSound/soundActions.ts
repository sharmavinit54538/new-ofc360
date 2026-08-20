import { setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_connect_sound_settings_v1";

export function persistSettings(settings: any) {
  setStoredData(STORAGE_KEY, settings);
}
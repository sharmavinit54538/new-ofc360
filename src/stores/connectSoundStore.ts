import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import type { ConnectSoundSettings } from "./connectSound/soundTypes";
import { DEFAULT_SETTINGS } from "./connectSound/soundDefaults";
import { createSoundStoreMethods } from "./connectSound/soundStoreMethods";

export type { ConnectSoundSettings };

export const useConnectSoundStore = create<ConnectSoundSettings & any>((set, get) => ({
  ...DEFAULT_SETTINGS,
  ...getStoredData("ofc360_connect_sound_settings_v1", DEFAULT_SETTINGS),
  isAudioUnlocked: false,
  isSettingsOpen: false,
  ...createSoundStoreMethods(set, get),
}));
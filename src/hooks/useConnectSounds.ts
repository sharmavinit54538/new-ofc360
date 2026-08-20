import { useConnectSoundStore } from "@/stores/connectSoundStore";
import { useCallSoundActions } from "./sounds/callSoundsActions";
import { useMeetingSoundActions } from "./sounds/meetingSoundActions";

export function useConnectSounds() {
  const soundSettings = useConnectSoundStore();
  const callSounds = useCallSoundActions();
  const meetingSounds = useMeetingSoundActions();
  return { soundSettings, ...callSounds, ...meetingSounds };
}
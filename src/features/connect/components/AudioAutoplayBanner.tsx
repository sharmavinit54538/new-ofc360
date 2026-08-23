import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectIsAudioUnlocked,
  selectSoundSettingsState,
} from "@/features/connect/selectors";
import { setAudioUnlocked } from "@/features/connect/soundSettingsSlice";
import { connectAudioManager } from "@/services/connectAudioManager";
import { Volume2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AudioAutoplayBanner() {
  const dispatch = useAppDispatch();
  const isAudioUnlocked = useAppSelector(selectIsAudioUnlocked);
  const soundSettings = useAppSelector(selectSoundSettingsState);
  const { isMasterEnabled, isMutedAll } = soundSettings;

  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if audio context is locked or already running
    const isUnlocked = typeof connectAudioManager?.isUnlocked === "function" ? connectAudioManager.isUnlocked() : false;
    if (isUnlocked || isAudioUnlocked) {
      setShowPrompt(false);
      return;
    }

    if (!isMasterEnabled || isMutedAll) {
      setShowPrompt(false);
      return;
    }

    // Show prompt if audio needs unlocking
    setShowPrompt(true);

    // Also auto-unlock on any user click anywhere on window
    const handleGlobalClick = async () => {
      const unlocked = await connectAudioManager.unlockAudio();
      if (unlocked) {
        dispatch(setAudioUnlocked(true));
        setShowPrompt(false);
        window.removeEventListener("click", handleGlobalClick);
        window.removeEventListener("keydown", handleGlobalClick);
      }
    };

    window.addEventListener("click", handleGlobalClick, { once: true });
    window.addEventListener("keydown", handleGlobalClick, { once: true });

    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("keydown", handleGlobalClick);
    };
  }, [isAudioUnlocked, isMasterEnabled, isMutedAll, dispatch]);

  const handleEnableSound = async () => {
    const unlocked = await connectAudioManager.unlockAudio();
    if (unlocked) {
      dispatch(setAudioUnlocked(true));
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="px-4 py-2 bg-gradient-to-r from-amber-500/15 via-primary/15 to-purple-500/15 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs select-none z-20"
      >
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Volume2 className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
          <span>
            <strong>Enable Connect Sounds:</strong> Browser requires a click to enable ringtones & notification sounds.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={handleEnableSound}
            className="gradient-bg text-primary-foreground h-7 px-3 rounded-lg text-xs font-bold shadow-xs gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enable Sound</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowPrompt(false)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Dismiss
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
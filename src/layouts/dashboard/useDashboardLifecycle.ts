import { useEffect } from "react";
import { connectAudioManager } from "@/services/connectAudioManager";
import { connectWebSocketService } from "@/services/connectWebSocketService";

export function useDashboardLifecycle() {
  useEffect(() => {
    connectWebSocketService.connect();
    const unlock = async () => {
      await connectAudioManager.unlockAudio();
      ["pointerdown", "keydown", "touchstart"].forEach(ev => window.removeEventListener(ev, unlock));
    };
    ["pointerdown", "keydown", "touchstart"].forEach(ev => window.addEventListener(ev, unlock, { once: true }));
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      try { Notification.requestPermission().catch(() => {}); } catch {}
    }
    const onUnload = () => connectWebSocketService.disconnect(false);
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) connectWebSocketService.connect(); };
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("pagehide", onUnload);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      ["pointerdown", "keydown", "touchstart"].forEach(ev => window.removeEventListener(ev, unlock));
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("pagehide", onUnload);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);
}

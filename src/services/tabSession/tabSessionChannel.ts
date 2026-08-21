export function createSessionBroadcastChannel(onExplicitLogout: () => void) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return null;
  try {
    const ch = new BroadcastChannel("ofc360_presence_tab_channel");
    ch.onmessage = (e) => { if (e?.data?.type === "EXPLICIT_LOGOUT") onExplicitLogout(); };
    return ch;
  } catch { return null; }
}

export function postChannelMessage(channel: BroadcastChannel | null, message: any) {
  try { channel?.postMessage(message); } catch {}
}

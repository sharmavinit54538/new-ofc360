import { create } from "zustand";
import type { FullConnectState } from "./connect/connectDataTypes";
import { getInitialConnectState } from "./connect/connectDefaults";
import { createNavActions } from "./connect/connectNavActions";
import { createMsgActions } from "./connect/connectMsgActions";
import { createCallActions } from "./connect/connectCallActions";

export type { FullConnectState as ConnectState };

export const useConnectStore = create<FullConnectState & any>((set, get) => ({
  ...getInitialConnectState(), ...createNavActions(set), ...createMsgActions(set, get), ...createCallActions(set, get),
  setUserPresence: (presence: any) => set({ currentUserPresence: presence }),
  startDirectConversation: (targetUser: any) => {
    const convId = "CONV-" + targetUser.id;
    set(() => ({ activeConversationId: convId, activeTab: "chat" }));
    return convId;
  },
}));
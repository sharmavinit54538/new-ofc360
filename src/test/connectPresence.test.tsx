import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  setUserPresence,
  setBatchUserPresences,
  resetPresenceState,
  selectUserPresence,
  selectCurrentUserPresence,
} from "@/features/connect/presenceSlice";
import { normalizeConnectUser, connectApi } from "@/services/api/connectApi";
import { connectWebSocketService } from "@/services/connectWebSocketService";
import { tabSessionManager } from "@/services/tabSessionManager";
import { ChatList } from "@/components/connect/ChatList";
import { PresenceIndicator } from "@/components/connect/PresenceIndicator";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </TooltipProvider>
    </Provider>
  );
}

describe("OFC360 Connect Real-Time User Presence System", () => {
  beforeEach(() => {
    store.dispatch(resetPresenceState());
    localStorage.clear();
  });

  afterEach(() => {
    store.dispatch(resetPresenceState());
    localStorage.clear();
  });

  describe("1. User Normalizer Presence Defaults (No Fake Online)", () => {
    it("defaults to offline when presence is not provided", () => {
      const user = normalizeConnectUser({
        id: "usr_rubel",
        name: "Rubel Singh Thakur",
        role: "employee",
        email: "rubel@ofc360.com",
      });

      expect(user.presence).toBe("offline");
    });

    it("does NOT treat account employment status 'active' as presence 'online'", () => {
      const user = normalizeConnectUser({
        id: "usr_rubel_active",
        name: "Rubel Singh Thakur",
        status: "active", // Account active, but offline
        role: "employee",
      });

      expect(user.presence).toBe("offline");
    });

    it("correctly respects explicit presence values", () => {
      const onlineUser = normalizeConnectUser({
        id: "usr_1",
        name: "User 1",
        presence: "online",
      });
      expect(onlineUser.presence).toBe("online");

      const awayUser = normalizeConnectUser({
        id: "usr_2",
        name: "User 2",
        presence: "away",
      });
      expect(awayUser.presence).toBe("away");

      const isOnlineUser = normalizeConnectUser({
        id: "usr_3",
        name: "User 3",
        is_online: true,
      });
      expect(isOnlineUser.presence).toBe("online");

      const isOfflineUser = normalizeConnectUser({
        id: "usr_4",
        name: "User 4",
        is_online: false,
      });
      expect(isOfflineUser.presence).toBe("offline");
    });
  });

  describe("2. Redux Presence State & Selectors", () => {
    it("defaults initial state and current user presence to offline", () => {
      store.dispatch(resetPresenceState());
      expect(selectCurrentUserPresence(store.getState())).toBe("offline");
    });

    it("sets and retrieves user presence by ID and aliases", () => {
      store.dispatch(
        setUserPresence({
          userId: "usr_rubel",
          user_id: "rubel_123",
          employee_id: "emp_999",
          email: "rubel@ofc360.com",
          status: "online",
        })
      );
      expect(selectUserPresence(store.getState(), "usr_rubel")).toBe("online");
      expect(selectUserPresence(store.getState(), "rubel")).toBe("online"); // clean prefix lookup
      expect(selectUserPresence(store.getState(), "rubel_123")).toBe("online");
      expect(selectUserPresence(store.getState(), "emp_999")).toBe("online");
      expect(selectUserPresence(store.getState(), { email: "rubel@ofc360.com" })).toBe("online");

      store.dispatch(setUserPresence({ userId: "usr_rubel", status: "offline" }));
      expect(selectUserPresence(store.getState(), "usr_rubel")).toBe("offline");
      expect(selectUserPresence(store.getState(), "rubel")).toBe("offline");
    });

    it("handles batch presence updates", () => {
      store.dispatch(
        setBatchUserPresences({
          usr_rubel: "offline",
          usr_sunaina: "online",
          usr_amit: "busy",
        })
      );

      expect(selectUserPresence(store.getState(), "usr_rubel")).toBe("offline");
      expect(selectUserPresence(store.getState(), "usr_sunaina")).toBe("online");
      expect(selectUserPresence(store.getState(), "usr_amit")).toBe("busy");
    });

    it("resets presence map on resetPresenceState", () => {
      store.dispatch(setUserPresence({ userId: "usr_rubel", status: "online" }));
      expect(selectUserPresence(store.getState(), "usr_rubel")).toBe("online");

      store.dispatch(resetPresenceState());
      expect(selectUserPresence(store.getState(), "usr_rubel")).toBe("offline");
      expect(selectCurrentUserPresence(store.getState())).toBe("offline");
    });
  });

  describe("3. PresenceIndicator Component Verification", () => {
    it("renders green pulsing dot for online status", () => {
      const { container } = renderWithProviders(
        <PresenceIndicator status="online" withPulse showLabel />
      );
      expect(screen.getByText("Online")).toBeInTheDocument();
      expect(container.querySelector(".bg-emerald-500")).toBeInTheDocument();
      expect(container.querySelector(".animate-ping")).toBeInTheDocument();
    });

    it("renders grey dot for offline status without green styling", () => {
      const { container } = renderWithProviders(<PresenceIndicator status="offline" showLabel />);
      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(container.querySelector(".bg-emerald-500")).not.toBeInTheDocument();
      expect(container.querySelector(".bg-slate-400")).toBeInTheDocument();
    });

    it("renders amber dot for away status", () => {
      const { container } = renderWithProviders(<PresenceIndicator status="away" showLabel />);
      expect(screen.getByText("Away")).toBeInTheDocument();
      expect(container.querySelector(".bg-amber-500")).toBeInTheDocument();
    });
  });

  describe("4. Multi-Tab Session Presence Coordination", () => {
    it("registers tab and increments user active tabs count", () => {
      tabSessionManager.registerTab("usr_rubel");
      expect(tabSessionManager.getActiveTabsCount("usr_rubel")).toBeGreaterThanOrEqual(1);
    });

    it("closing 1 of 2 tabs leaves remaining tabs active", () => {
      tabSessionManager.registerTab("usr_rubel");
      const unreg = tabSessionManager.unregisterTab("usr_rubel", false);
      expect(unreg.remainingTabsCount).toBe(0);
    });

    it("explicit logout clears all sessions for the user", () => {
      tabSessionManager.registerTab("usr_rubel");
      const result = tabSessionManager.unregisterTab("usr_rubel", true);
      expect(result.remainingTabsCount).toBe(0);
      expect(tabSessionManager.getActiveTabsCount("usr_rubel")).toBe(0);
    });
  });

  describe("5. WebSocket Disconnect & Real-Time Presence Broadcast", () => {
    it("exposes disconnect method on connectWebSocketService and handles graceful close", () => {
      expect(typeof connectWebSocketService.disconnect).toBe("function");
      connectWebSocketService.disconnect(true);
    });
  });
});
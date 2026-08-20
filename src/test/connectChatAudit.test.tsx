import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { setCredentials } from "@/features/auth/authSlice";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  normalizeConnectUser,
  normalizeConnectConversation,
  normalizeConnectMessage,
  isCurrentUser,
} from "@/services/api/connectApi";
import { formatMessageTime, formatConversationTime } from "@/utils/formatTime";
import { ChatList } from "@/components/connect/ChatList";
import { ChatWindow } from "@/components/connect/ChatWindow";
import { MessageBubble } from "@/components/connect/MessageBubble";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </TooltipProvider>
    </Provider>
  );
}

describe("OFC360 Connect Chat Module Audit & Normalization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. User & Colleague Normalization (normalizeConnectUser)", () => {
    it("normalizes user with direct name", () => {
      const user = normalizeConnectUser({ id: "usr_1", name: "Rahul Sharma", role: "Software Engineer", email: "rahul@ofc360.com" });
      expect(user.id).toBe("usr_1");
      expect(user.name).toBe("Rahul Sharma");
      expect(user.role).toBe("Software Engineer");
      expect(user.email).toBe("rahul@ofc360.com");
    });

    it("normalizes user with full_name / firstName + lastName", () => {
      const user1 = normalizeConnectUser({ id: "usr_2", full_name: "Priya Patel", role: "Product Manager" });
      expect(user1.name).toBe("Priya Patel");

      const user2 = normalizeConnectUser({ id: "usr_3", first_name: "Amit", last_name: "Verma" });
      expect(user2.name).toBe("Amit Verma");
    });

    it("normalizes user with email prefix fallback when name is absent", () => {
      const user = normalizeConnectUser({ id: "usr_4", email: "vikram.singh@company.com" });
      expect(user.name).toBe("Vikram Singh");
    });
  });

  describe("2. Conversation Participant Calculation & Deduplication", () => {
    const adminUser = { id: "admin_101", name: "Admin User", role: "hr_admin", email: "admin@ofc360.com" };
    const sunainaUser = { id: "sunaina_202", name: "Sunaina Mehra", role: "employee", email: "sunaina@ofc360.com" };

    it("excludes current logged-in user (Admin) and sets participant to Sunaina Mehra", () => {
      const rawConv = {
        id: "conv_admin_sunaina",
        participants: [
          { id: "admin_101", name: "Admin User", role: "hr_admin" },
          { id: "sunaina_202", name: "Sunaina Mehra", role: "employee" },
        ],
        lastMessage: { id: "msg_1", content: "hlo", timestamp: "2026-08-18T09:15:34Z" },
        unreadCount: 1,
      };

      const normalized = normalizeConnectConversation(rawConv, adminUser);
      expect(normalized.participant.id).toBe("sunaina_202");
      expect(normalized.participant.name).toBe("Sunaina Mehra");
    });

    it("excludes current logged-in user (Sunaina) and sets participant to Admin User", () => {
      const rawConv = {
        id: "conv_admin_sunaina",
        participants: [
          { id: "admin_101", name: "Admin User", role: "hr_admin" },
          { id: "sunaina_202", name: "Sunaina Mehra", role: "employee" },
        ],
        lastMessage: { id: "msg_2", content: "hii", timestamp: "2026-08-18T09:16:00Z" },
        unreadCount: 0,
      };

      const normalized = normalizeConnectConversation(rawConv, sunainaUser);
      expect(normalized.participant.id).toBe("admin_101");
      expect(normalized.participant.name).toBe("Admin User");
    });

    it("identifies other participant when provided in sender/receiver fields", () => {
      const rawConv = {
        id: "conv_sr_1",
        sender: { id: "admin_101", name: "Admin User" },
        receiver: { id: "sunaina_202", name: "Sunaina Mehra", role: "employee" },
      };

      const forAdmin = normalizeConnectConversation(rawConv, adminUser);
      expect(forAdmin.participant.name).toBe("Sunaina Mehra");

      const forSunaina = normalizeConnectConversation(rawConv, sunainaUser);
      expect(forSunaina.participant.name).toBe("Admin User");
    });
  });

  describe("3. isCurrentUser Helper", () => {
    const testUser = {
      id: "usr_999",
      email: "test.lead@ofc360.com",
    };

    it("matches string ID, object ID, and email address", () => {
      expect(isCurrentUser("usr_999", testUser)).toBe(true);
      expect(isCurrentUser({ id: "usr_999" }, testUser)).toBe(true);
      expect(isCurrentUser("test.lead@ofc360.com", testUser)).toBe(true);
      expect(isCurrentUser({ email: "test.lead@ofc360.com" }, testUser)).toBe(true);
      expect(isCurrentUser("other_user_123", testUser)).toBe(false);
    });
  });

  describe("4. Message Sender / Receiver Direction & Alignment", () => {
    it("renders outgoing messages on RIGHT with 'You' label and without raw ISO string", () => {
      const outgoingMsg = {
        id: "msg_out_1",
        conversationId: "conv_1",
        senderId: "admin_101",
        senderName: "Admin User",
        content: "hii",
        timestamp: "2026-08-18T09:15:34.009900+00:00",
        status: "read" as const,
      };

      renderWithProviders(
        <MessageBubble
          message={outgoingMsg}
          isOutgoing={true}
          currentUserId="admin_101"
        />
      );

      expect(screen.getByText("You")).toBeInTheDocument();
      expect(screen.getByText("hii")).toBeInTheDocument();
      // Should NOT contain raw ISO string
      expect(screen.queryByText("2026-08-18T09:15:34.009900+00:00")).not.toBeInTheDocument();
    });

    it("renders incoming messages on LEFT with sender name and avatar initials", () => {
      const incomingMsg = {
        id: "msg_in_1",
        conversationId: "conv_1",
        senderId: "sunaina_202",
        senderName: "Sunaina Mehra",
        content: "hlo",
        timestamp: "2026-08-18T09:15:00.000Z",
        status: "delivered" as const,
      };

      renderWithProviders(
        <MessageBubble
          message={incomingMsg}
          isOutgoing={false}
          currentUserId="admin_101"
        />
      );

      expect(screen.getByText("Sunaina Mehra")).toBeInTheDocument();
      expect(screen.getByText("hlo")).toBeInTheDocument();
      expect(screen.getByText("SM")).toBeInTheDocument();
    });
  });

  describe("5. Time Formatting Utility", () => {
    it("formats ISO timestamps into clean local time", () => {
      const formatted = formatMessageTime("2026-08-18T09:15:34.009900+00:00");
      expect(formatted).toBeTruthy();
      expect(formatted).not.toContain("T");
      expect(formatted).not.toContain("+00:00");
    });
  });

  describe("6. Chat UI Component Rendering", () => {
    it("renders ChatList with Direct Messages header and New Chat button", () => {
      renderWithProviders(<ChatList />);
      expect(screen.getByText("Direct Messages")).toBeInTheDocument();
      expect(screen.getByText("New Chat")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search conversations...")).toBeInTheDocument();
    });

    it("renders ChatWindow with empty placeholder when no conversation is selected", () => {
      renderWithProviders(<ChatWindow conversationId={null} />);
      expect(screen.getByText("No Conversation Selected")).toBeInTheDocument();
      expect(screen.getByText(/Select a colleague from the list/i)).toBeInTheDocument();
    });
  });
});
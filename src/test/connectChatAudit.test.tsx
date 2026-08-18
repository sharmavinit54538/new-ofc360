import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  normalizeConnectUser,
  normalizeConnectConversation,
  normalizeConnectMessage,
  connectApi,
} from "@/services/api/connectApi";
import { ChatList } from "@/components/connect/ChatList";
import { ChatWindow } from "@/components/connect/ChatWindow";

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

  describe("2. Conversation Normalization & Sorting (normalizeConnectConversation)", () => {
    it("normalizes conversation with nested participant object", () => {
      const raw = {
        id: "conv_100",
        participant: { id: "usr_5", name: "Sneha Reddy", role: "HR Specialist" },
        lastMessage: { id: "msg_1", content: "Meeting at 3 PM", timestamp: "2026-08-18T10:00:00Z" },
        unreadCount: 2,
        isPinned: true,
      };

      const conv = normalizeConnectConversation(raw);
      expect(conv.id).toBe("conv_100");
      expect(conv.participant.name).toBe("Sneha Reddy");
      expect(conv.lastMessage?.content).toBe("Meeting at 3 PM");
      expect(conv.unreadCount).toBe(2);
      expect(conv.isPinned).toBe(true);
    });

    it("normalizes conversation with alternative keys (user, recipient, last_message, unread_count)", () => {
      const raw = {
        _id: "conv_200",
        user: { _id: "usr_6", first_name: "Karan", last_name: "Mehta", job_title: "Tech Lead" },
        last_message: { message_id: "msg_2", message: "Code reviewed and approved", created_at: "2026-08-18T11:00:00Z" },
        unread_count: 5,
        is_pinned: false,
      };

      const conv = normalizeConnectConversation(raw);
      expect(conv.id).toBe("conv_200");
      expect(conv.participant.name).toBe("Karan Mehta");
      expect(conv.participant.role).toBe("Tech Lead");
      expect(conv.lastMessage?.content).toBe("Code reviewed and approved");
      expect(conv.unreadCount).toBe(5);
      expect(conv.isPinned).toBe(false);
    });

    it("normalizes conversation with flat recipient fields without dropping", () => {
      const raw = {
        conversation_id: "conv_300",
        name: "Ananya Roy",
        email: "ananya@ofc360.com",
        last_message: "Let me check the report",
        unread: 1,
      };

      const conv = normalizeConnectConversation(raw);
      expect(conv.id).toBe("conv_300");
      expect(conv.participant.name).toBe("Ananya Roy");
      expect(conv.lastMessage?.content).toBe("Let me check the report");
      expect(conv.unreadCount).toBe(1);
    });
  });

  describe("3. Message Normalization (normalizeConnectMessage)", () => {
    it("normalizes message with content / message / text aliases", () => {
      const msg1 = normalizeConnectMessage({ id: "m1", conversationId: "c1", content: "Hello World", senderId: "u1" });
      expect(msg1.content).toBe("Hello World");

      const msg2 = normalizeConnectMessage({ message_id: "m2", conversation_id: "c1", message: "Alternative text", user_id: "u2" });
      expect(msg2.id).toBe("m2");
      expect(msg2.content).toBe("Alternative text");
      expect(msg2.senderId).toBe("u2");
    });
  });

  describe("4. Chat UI Component Rendering", () => {
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

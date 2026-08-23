import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatWindow } from "@/features/connect/components/ChatWindow";
import * as connectApiModule from "@/services/api/connectApi";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </TooltipProvider>
    </Provider>
  );
}

describe("ChatWindow Recipient Header Dynamic Resolution", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correct recipient name and avatar initials for Rahul Sharma", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [
        {
          id: "conv_rahul",
          participant: {
            id: "usr_rahul",
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            role: "Software Engineer",
            department: "Engineering",
            presence: "online",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_rahul" />);

    // Header must show "Rahul Sharma"
    expect(screen.getByRole("heading", { level: 3, name: "Rahul Sharma" })).toBeInTheDocument();
    // Avatar initial should be RS
    expect(screen.getByText("RS")).toBeInTheDocument();
    // Subtitle should reflect role and department
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Engineering/i)).toBeInTheDocument();
    // No hardcoded "Colleague" heading
    expect(screen.queryByRole("heading", { level: 3, name: "Colleague" })).not.toBeInTheDocument();
  });

  it("renders correct recipient name and avatar initials for Amit Kumar", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [
        {
          id: "conv_amit",
          participant: {
            id: "usr_amit",
            name: "Amit Kumar",
            email: "amit.kumar@example.com",
            role: "Product Manager",
            department: "Product",
            presence: "busy",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_amit" />);

    expect(screen.getByRole("heading", { level: 3, name: "Amit Kumar" })).toBeInTheDocument();
    expect(screen.getByText("AK")).toBeInTheDocument();
    expect(screen.getByText(/Product Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/Product/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Colleague" })).not.toBeInTheDocument();
  });

  it("renders correct recipient name and avatar initials for Priya Singh", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [
        {
          id: "conv_priya",
          participant: {
            id: "usr_priya",
            name: "Priya Singh",
            email: "priya.singh@example.com",
            role: "UI/UX Designer",
            department: "Design",
            presence: "away",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_priya" />);

    expect(screen.getByRole("heading", { level: 3, name: "Priya Singh" })).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.getByText(/UI\/UX Designer/i)).toBeInTheDocument();
    expect(screen.getByText(/Design/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Colleague" })).not.toBeInTheDocument();
  });

  it("updates header immediately when switching conversations", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [
        {
          id: "conv_1",
          participant: {
            id: "usr_1",
            name: "Rahul Sharma",
            email: "rahul@example.com",
            role: "Lead Developer",
            department: "Tech",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "conv_2",
          participant: {
            id: "usr_2",
            name: "Amit Kumar",
            email: "amit@example.com",
            role: "VP Operations",
            department: "Operations",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
        {
          id: "conv_3",
          participant: {
            id: "usr_3",
            name: "Priya Singh",
            email: "priya@example.com",
            role: "HR Business Partner",
            department: "Human Resources",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    const { rerender } = renderWithProviders(<ChatWindow conversationId="conv_1" />);
    expect(screen.getByRole("heading", { level: 3, name: "Rahul Sharma" })).toBeInTheDocument();
    expect(screen.getByText("RS")).toBeInTheDocument();

    // Switch to Amit Kumar
    rerender(
      <Provider store={store}>
        <TooltipProvider>
          <MemoryRouter>
            <ChatWindow conversationId="conv_2" />
          </MemoryRouter>
        </TooltipProvider>
      </Provider>
    );
    expect(screen.getByRole("heading", { level: 3, name: "Amit Kumar" })).toBeInTheDocument();
    expect(screen.getByText("AK")).toBeInTheDocument();

    // Switch to Priya Singh
    rerender(
      <Provider store={store}>
        <TooltipProvider>
          <MemoryRouter>
            <ChatWindow conversationId="conv_3" />
          </MemoryRouter>
        </TooltipProvider>
      </Provider>
    );
    expect(screen.getByRole("heading", { level: 3, name: "Priya Singh" })).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
  });

  it("extracts recipient name when stored as first_name and last_name", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [
        {
          id: "conv_split_names",
          participant: {
            id: "usr_split",
            first_name: "Rahul",
            last_name: "Sharma",
            email: "rahul@example.com",
            role: "Backend Engineer",
          } as any,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_split_names" />);
    expect(screen.getByRole("heading", { level: 3, name: "Rahul Sharma" })).toBeInTheDocument();
    expect(screen.getByText("RS")).toBeInTheDocument();
  });

  it("extracts recipient name when stored as full_name or user.name", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [
        {
          id: "conv_full_name",
          user: {
            id: "usr_full",
            full_name: "Amit Kumar",
            email: "amit@example.com",
            role: "Senior PM",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        } as any,
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_full_name" />);
    expect(screen.getByRole("heading", { level: 3, name: "Amit Kumar" })).toBeInTheDocument();
    expect(screen.getByText("AK")).toBeInTheDocument();
  });

  it("resolves recipient from colleagues directory when conversation is newly initiated", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(connectApiModule, "useGetColleaguesQuery").mockReturnValue({
      data: [
        {
          id: "usr_priya_new",
          name: "Priya Singh",
          email: "priya.singh@example.com",
          role: "Design Lead",
          department: "Product Design",
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_usr_priya_new" />);
    expect(screen.getByRole("heading", { level: 3, name: "Priya Singh" })).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.getByText(/Design Lead/i)).toBeInTheDocument();
  });

  it("resolves recipient from message history when conversation participant is not yet cached", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(connectApiModule, "useGetColleaguesQuery").mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(connectApiModule, "useGetConversationMessagesQuery").mockReturnValue({
      data: [
        {
          id: "msg_1",
          conversationId: "conv_msg_test",
          senderId: "usr_sender_other",
          senderName: "Priya Singh",
          content: "Hello there!",
          timestamp: new Date().toISOString(),
          status: "sent",
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_msg_test" />);
    expect(screen.getByRole("heading", { level: 3, name: "Priya Singh" })).toBeInTheDocument();
    expect(screen.getAllByText("PS").length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to user identifier cleanly without permanently displaying Colleague", () => {
    vi.spyOn(connectApiModule, "useGetConversationsQuery").mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    vi.spyOn(connectApiModule, "useGetColleaguesQuery").mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<ChatWindow conversationId="conv_custom_identifier" />);
    expect(screen.getByRole("heading", { level: 3, name: "custom_identifier" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Colleague" })).not.toBeInTheDocument();
  });
});
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConnectHeader } from "@/features/connect/components/ConnectHeader";
import { ChatList } from "@/features/connect/components/ChatList";
import { ChannelList } from "@/features/connect/components/ChannelList";
import { PresenceSelector } from "@/features/connect/components/PresenceSelector";
import { ConnectSoundSettingsModal } from "@/features/connect/components/ConnectSoundSettingsModal";
import { NewChatDialog } from "@/features/connect/components/NewChatDialog";
import { NewChannelDialog } from "@/features/connect/components/NewChannelDialog";
import { NewMeetingDialog } from "@/features/connect/components/NewMeetingDialog";
import { ConnectSearchDialog } from "@/features/connect/components/ConnectSearchDialog";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </TooltipProvider>
    </Provider>
  );
}

describe("Connect UI Components & Redux Integration", { timeout: 15000 }, () => {
  it("renders ConnectHeader with tabs and search button", () => {
    renderWithProviders(<ConnectHeader />);

    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Channels")).toBeInTheDocument();
    expect(screen.getByText("Calls")).toBeInTheDocument();
    expect(screen.getByText("Meetings")).toBeInTheDocument();
    expect(screen.getByText("Files")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("New Meeting")).toBeInTheDocument();
  });

  it("renders ChatList correctly with Redux", () => {
    renderWithProviders(<ChatList />);

    expect(screen.getByText("Direct Messages")).toBeInTheDocument();
    expect(screen.getByText("New Chat")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search conversations...")).toBeInTheDocument();
  });

  it("renders ChannelList correctly with Redux", () => {
    renderWithProviders(<ChannelList />);

    expect(screen.getByText("Channels")).toBeInTheDocument();
    expect(screen.getByText("New Channel")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search channels...")).toBeInTheDocument();
  });

  it("renders PresenceSelector properly", () => {
    renderWithProviders(<PresenceSelector />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders ConnectSoundSettingsModal with sliders and switches", () => {
    renderWithProviders(<ConnectSoundSettingsModal open={true} onOpenChange={() => {}} />);

    expect(screen.getByText("Connect Settings")).toBeInTheDocument();
    expect(screen.getByText("Master Sound & Volume")).toBeInTheDocument();
    expect(screen.getByText("Call & Ringtone Sounds")).toBeInTheDocument();
    expect(screen.getByText("Messages & Notifications")).toBeInTheDocument();
  });

  it("renders NewChatDialog modal properly", () => {
    renderWithProviders(<NewChatDialog open={true} onOpenChange={() => {}} />);

    expect(screen.getByText("Start a Direct Conversation")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search by name, department, role...")).toBeInTheDocument();
  });

  it("renders NewChannelDialog modal properly", () => {
    renderWithProviders(<NewChannelDialog open={true} onOpenChange={() => {}} />);

    expect(screen.getByText("Create a New Channel")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. project-apollo, design-system")).toBeInTheDocument();
  });

  it("renders NewMeetingDialog modal properly", () => {
    renderWithProviders(<NewMeetingDialog open={true} onOpenChange={() => {}} />);

    expect(screen.getByText("Schedule a Meeting")).toBeInTheDocument();
  });

  it("renders ConnectSearchDialog modal properly", () => {
    renderWithProviders(<ConnectSearchDialog open={true} onOpenChange={() => {}} />);

    expect(
      screen.getByPlaceholderText("Search across people, channels, messages, and files...")
    ).toBeInTheDocument();
  });
});
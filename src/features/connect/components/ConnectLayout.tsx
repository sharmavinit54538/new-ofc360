import { ReactNode, useEffect } from "react";
import { ConnectHeader } from "./ConnectHeader";
import { ThreadPanel } from "./ThreadPanel";
import { MailArtifactPanel } from "./MailArtifactPanel";
import { NewChatDialog } from "./NewChatDialog";
import { NewChannelDialog } from "./NewChannelDialog";
import { NewMeetingDialog } from "./NewMeetingDialog";
import { ConnectSearchDialog } from "./ConnectSearchDialog";
import { AudioAutoplayBanner } from "./AudioAutoplayBanner";
import { ConnectSoundSettingsModal } from "./ConnectSoundSettingsModal";
import { useConnect } from "@/features/connect/hooks";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsSoundSettingsOpen } from "@/features/connect/selectors";
import { setIsSettingsOpen } from "@/features/connect/soundSettingsSlice";
import { connectWebSocketService } from "@/services/connectWebSocketService";

interface ConnectLayoutProps {
  children: ReactNode;
}

export function ConnectLayout({ children }: ConnectLayoutProps) {
  const dispatch = useAppDispatch();
  const {
    isNewChatOpen,
    setIsNewChatOpen,
    isNewChannelOpen,
    setIsNewChannelOpen,
    isNewMeetingOpen,
    setIsNewMeetingOpen,
    isSearchOpen,
    setIsSearchOpen,
  } = useConnect();

  const isSettingsOpen = useAppSelector(selectIsSoundSettingsOpen);

  // Initialize centralized WebSocket connection
  useEffect(() => {
    connectWebSocketService.connect();
    return () => {
      // Keep connection or gracefully handle unmount
    };
  }, []);

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col bg-background/95 backdrop-blur-md rounded-2xl border border-border/80 shadow-xl overflow-hidden">
      {/* Audio Autoplay Restriction Banner */}
      <AudioAutoplayBanner />

      {/* Top Header */}
      <ConnectHeader />

      {/* Main Multi-Column Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Dynamic Main Workspace Content */}
        <div className="flex-1 flex overflow-hidden min-w-0 bg-background/50">
          {children}
        </div>

        {/* Slack-Style Thread Side Panel */}
        <ThreadPanel />

        {/* ChatGPT / Claude Style Mail Artifact Side Panel */}
        <MailArtifactPanel />
      </div>

      {/* Global Creation & Search Modals */}
      <NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} />
      <NewChannelDialog open={isNewChannelOpen} onOpenChange={setIsNewChannelOpen} />
      <NewMeetingDialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen} />
      <ConnectSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Sound Settings & Preferences Modal */}
      <ConnectSoundSettingsModal
        open={isSettingsOpen}
        onOpenChange={(open) => dispatch(setIsSettingsOpen(open))}
      />
    </div>
  );
}
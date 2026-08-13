import { ReactNode } from "react";
import { ConnectHeader } from "./ConnectHeader";
import { ThreadPanel } from "./ThreadPanel";
import { MailArtifactPanel } from "./MailArtifactPanel";
import { CallScreen } from "./CallScreen";
import { IncomingCallModal } from "./IncomingCallModal";
import { VideoCallModal } from "./VideoCallModal";
import { NewChatDialog } from "./NewChatDialog";
import { NewChannelDialog } from "./NewChannelDialog";
import { NewMeetingDialog } from "./NewMeetingDialog";
import { ConnectSearchDialog } from "./ConnectSearchDialog";
import { AudioAutoplayBanner } from "./AudioAutoplayBanner";
import { ConnectSoundSettingsModal } from "./ConnectSoundSettingsModal";
import { useConnectStore } from "@/stores/connectStore";
import { useConnectSoundStore } from "@/stores/connectSoundStore";

interface ConnectLayoutProps {
  children: ReactNode;
}

export function ConnectLayout({ children }: ConnectLayoutProps) {
  const isNewChatOpen = useConnectStore((s) => s.isNewChatOpen);
  const setIsNewChatOpen = useConnectStore((s) => s.setIsNewChatOpen);
  const isNewChannelOpen = useConnectStore((s) => s.isNewChannelOpen);
  const setIsNewChannelOpen = useConnectStore((s) => s.setIsNewChannelOpen);
  const isNewMeetingOpen = useConnectStore((s) => s.isNewMeetingOpen);
  const setIsNewMeetingOpen = useConnectStore((s) => s.setIsNewMeetingOpen);
  const isSearchOpen = useConnectStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useConnectStore((s) => s.setIsSearchOpen);

  const isSettingsOpen = useConnectSoundStore((s) => s.isSettingsOpen);
  const setIsSettingsOpen = useConnectSoundStore((s) => s.setIsSettingsOpen);

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

      {/* Real-time Call Modals */}
      <CallScreen />
      <IncomingCallModal />
      <VideoCallModal />

      {/* Global Creation & Search Modals */}
      <NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} />
      <NewChannelDialog open={isNewChannelOpen} onOpenChange={setIsNewChannelOpen} />
      <NewMeetingDialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen} />
      <ConnectSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Sound Settings & Preferences Modal */}
      <ConnectSoundSettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}

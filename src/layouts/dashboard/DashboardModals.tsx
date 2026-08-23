import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";
import { IncomingCallModal } from "@/features/connect/components/IncomingCallModal";
import { CallScreen } from "@/features/connect/components/CallScreen";
import { VideoCallModal } from "@/features/connect/components/VideoCallModal";

export function DashboardModals() {
  return (
    <>
      <FloatingAIAssistant />
      <IncomingCallModal />
      <CallScreen />
      <VideoCallModal />
    </>
  );
}

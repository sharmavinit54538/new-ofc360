import { FloatingAIAssistant } from "@/components/FloatingAIAssistant";
import { IncomingCallModal } from "@/components/connect/IncomingCallModal";
import { CallScreen } from "@/components/connect/CallScreen";
import { VideoCallModal } from "@/components/connect/VideoCallModal";

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

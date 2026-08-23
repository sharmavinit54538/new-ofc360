import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ConnectOverviewPage from "@/features/connect/pages/ConnectOverviewPage";
import ConnectChatPage from "@/features/connect/pages/ConnectChatPage";
import ConnectChannelsPage from "@/features/connect/pages/ConnectChannelsPage";

export const renderConnectChatRoutes = () => (
  <>
    <Route path="/connect" element={<RoleGuard module="connect"><ConnectOverviewPage /></RoleGuard>} />
    <Route path="/connect/chat" element={<RoleGuard module="connect"><ConnectChatPage /></RoleGuard>} />
    <Route path="/connect/chat/:conversationId" element={<RoleGuard module="connect"><ConnectChatPage /></RoleGuard>} />
    <Route path="/connect/channels" element={<RoleGuard module="connect"><ConnectChannelsPage /></RoleGuard>} />
    <Route path="/connect/channels/:channelId" element={<RoleGuard module="connect"><ConnectChannelsPage /></RoleGuard>} />
  </>
);
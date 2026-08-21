import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ConnectOverviewPage from "@/pages/connect/ConnectOverviewPage";
import ConnectChatPage from "@/pages/connect/ConnectChatPage";
import ConnectChannelsPage from "@/pages/connect/ConnectChannelsPage";

export const renderConnectChatRoutes = () => (
  <>
    <Route path="/connect" element={<RoleGuard module="connect"><ConnectOverviewPage /></RoleGuard>} />
    <Route path="/connect/chat" element={<RoleGuard module="connect"><ConnectChatPage /></RoleGuard>} />
    <Route path="/connect/chat/:conversationId" element={<RoleGuard module="connect"><ConnectChatPage /></RoleGuard>} />
    <Route path="/connect/channels" element={<RoleGuard module="connect"><ConnectChannelsPage /></RoleGuard>} />
    <Route path="/connect/channels/:channelId" element={<RoleGuard module="connect"><ConnectChannelsPage /></RoleGuard>} />
  </>
);

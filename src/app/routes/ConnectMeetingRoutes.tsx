import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ConnectCallsPage from "@/pages/connect/ConnectCallsPage";
import ConnectMeetingsPage from "@/pages/connect/ConnectMeetingsPage";
import MeetingRoomPage from "@/pages/connect/MeetingRoomPage";
import ConnectFilesPage from "@/pages/connect/ConnectFilesPage";
import ConnectContactsPage from "@/pages/connect/ConnectContactsPage";

export const renderConnectMeetingRoutes = () => (
  <>
    <Route path="/connect/calls" element={<RoleGuard module="connect"><ConnectCallsPage /></RoleGuard>} />
    <Route path="/connect/meetings" element={<RoleGuard module="connect"><ConnectMeetingsPage /></RoleGuard>} />
    <Route path="/connect/meeting/:meetingId" element={<RoleGuard module="connect"><MeetingRoomPage /></RoleGuard>} />
    <Route path="/connect/files" element={<RoleGuard module="connect"><ConnectFilesPage /></RoleGuard>} />
    <Route path="/connect/contacts" element={<RoleGuard module="connect"><ConnectContactsPage /></RoleGuard>} />
  </>
);

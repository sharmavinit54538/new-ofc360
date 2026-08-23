import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ConnectCallsPage from "@/features/connect/pages/ConnectCallsPage";
import ConnectMeetingsPage from "@/features/connect/pages/ConnectMeetingsPage";
import MeetingRoomPage from "@/features/connect/pages/MeetingRoomPage";
import ConnectFilesPage from "@/features/connect/pages/ConnectFilesPage";
import ConnectContactsPage from "@/features/connect/pages/ConnectContactsPage";

export const renderConnectMeetingRoutes = () => (
  <>
    <Route path="/connect/calls" element={<RoleGuard module="connect"><ConnectCallsPage /></RoleGuard>} />
    <Route path="/connect/meetings" element={<RoleGuard module="connect"><ConnectMeetingsPage /></RoleGuard>} />
    <Route path="/connect/meeting/:meetingId" element={<RoleGuard module="connect"><MeetingRoomPage /></RoleGuard>} />
    <Route path="/connect/files" element={<RoleGuard module="connect"><ConnectFilesPage /></RoleGuard>} />
    <Route path="/connect/contacts" element={<RoleGuard module="connect"><ConnectContactsPage /></RoleGuard>} />
  </>
);
import { renderConnectChatRoutes } from "./ConnectChatRoutes";
import { renderConnectMeetingRoutes } from "./ConnectMeetingRoutes";

export const renderConnectRoutes = () => (
  <>
    {renderConnectChatRoutes()}
    {renderConnectMeetingRoutes()}
  </>
);

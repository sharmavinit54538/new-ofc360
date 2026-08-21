import { connectUsersApi } from "./connectUsersEndpoints";
import { connectConversationsApi } from "./connectConversationsEndpoints";
import { connectMessagesApi } from "./connectMessagesEndpoints";
import { connectThreadsApi } from "./connectThreadsEndpoints";
import { connectChannelsApi } from "./connectChannelsEndpoints";
import { connectCallsApi } from "./connectCallsEndpoints";
import { connectMeetingsApi } from "./connectMeetingsEndpoints";
import { connectMeetingCollaborationApi } from "./connectMeetingCollaborationEndpoints";
import { connectFilesApi } from "./connectFilesEndpoints";
import { connectMiscApi } from "./connectMiscEndpoints";

export const connectApi = {
  ...connectUsersApi, ...connectConversationsApi, ...connectMessagesApi, ...connectThreadsApi,
  ...connectChannelsApi, ...connectCallsApi, ...connectMeetingsApi, ...connectMeetingCollaborationApi,
  ...connectFilesApi, ...connectMiscApi,
};

export const isCurrentUser = (val: any, u: any): boolean => {
  if (!val || !u) return false;
  const id = String(typeof val === "object" ? val.id || val.userId || val.user_id || "" : val || "").toLowerCase();
  const email = String(typeof val === "object" ? val.email || "" : val || "").toLowerCase();
  return Boolean((id && id === String(u.id || u._id || "").toLowerCase()) || (email && email === String(u.email || "").toLowerCase()));
};

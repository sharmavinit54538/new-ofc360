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

import { isCurrentUser } from "./connectApiUtils";
export { isCurrentUser };


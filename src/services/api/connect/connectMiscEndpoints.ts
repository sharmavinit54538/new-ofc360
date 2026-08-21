export * from "./connectFilesEndpoints";
export * from "./connectNotificationsEndpoints";
export * from "./connectSettingsAiEndpoints";

import { connectFilesApi } from "./connectFilesEndpoints";
import { connectNotificationsApi } from "./connectNotificationsEndpoints";
import { connectSettingsAiApi } from "./connectSettingsAiEndpoints";

export const connectMiscApi = {
  ...connectFilesApi,
  ...connectNotificationsApi,
  ...connectSettingsAiApi,
};

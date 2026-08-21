import { baseApi } from "../baseApi";
import { ConnectSoundSettings, AITransformRequest, AITransformResponse, MailDispatchRequest, MailDispatchResponse } from "@/types/connect";

export const connectSettingsAiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSoundSettings: builder.query<ConnectSoundSettings, void>({ query: () => "/api/v1/connect/settings/sounds" }),
    updateSoundSettings: builder.mutation<void, Partial<ConnectSoundSettings>>({ query: (b) => ({ url: "/api/v1/connect/settings/sounds", method: "PUT", body: b }) }),
    aiTransform: builder.mutation<AITransformResponse, AITransformRequest>({ query: (b) => ({ url: "/api/v1/connect/ai/transform", method: "POST", body: b }) }),
    mailDispatch: builder.mutation<MailDispatchResponse, MailDispatchRequest>({ query: (b) => ({ url: "/api/v1/connect/mail/dispatch", method: "POST", body: b }) }),
    dispatchMail: builder.mutation<MailDispatchResponse, MailDispatchRequest>({ query: (b) => ({ url: "/api/v1/connect/mail/dispatch", method: "POST", body: b }) }),
  }),
});
export const {
  useGetSoundSettingsQuery, useUpdateSoundSettingsMutation, useAiTransformMutation,
  useMailDispatchMutation, useMailDispatchMutation: useDispatchMailMutation,
} = connectSettingsAiApi;

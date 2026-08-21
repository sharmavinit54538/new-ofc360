import { baseApi } from "../baseApi";
import { ConnectSharedFile } from "@/types/connect";
import { normalizeConnectSharedFile } from "./normalizeConnectSharedFile";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectMeetingCollaborationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetingFiles: builder.query<ConnectSharedFile[], string>({
      query: (meetingId) => `/api/v1/connect/meetings/${meetingId}/files`,
      transformResponse: (raw: any): ConnectSharedFile[] => extractListFromEnvelope(raw, ["files"]).map((f) => normalizeConnectSharedFile(f)),
    }),
    shareMeetingFile: builder.mutation<ConnectSharedFile, { meetingId: string; file: FormData | Record<string, any> }>({
      query: ({ meetingId, file }) => ({ url: `/api/v1/connect/meetings/${meetingId}/files`, method: "POST", body: file }),
      transformResponse: (raw: any) => normalizeConnectSharedFile(raw?.data || raw),
    }),
    startScreenShare: builder.mutation<void, { meetingId: string }>({ query: ({ meetingId }) => ({ url: `/api/v1/connect/meetings/${meetingId}/screen-share/start`, method: "POST" }) }),
    stopScreenShare: builder.mutation<void, { meetingId: string }>({ query: ({ meetingId }) => ({ url: `/api/v1/connect/meetings/${meetingId}/screen-share/stop`, method: "POST" }) }),
    generateAiMeetingSummary: builder.mutation<{ summary: string; actionItems: string[] }, { meetingId: string }>({ query: ({ meetingId }) => ({ url: `/api/v1/connect/meetings/${meetingId}/ai-summary`, method: "POST" }) }),
  }),
});
export const {
  useGetMeetingFilesQuery, useShareMeetingFileMutation,
  useStartScreenShareMutation, useStopScreenShareMutation, useGenerateAiMeetingSummaryMutation,
} = connectMeetingCollaborationApi;

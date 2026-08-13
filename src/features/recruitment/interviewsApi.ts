import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  Interview,
  SendInterviewInput,
  InterviewScheduleInput,
  RoundDecisionInput,
} from "./types";

export const interviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInterview: builder.mutation<
      APIResponse<Interview>,
      { applicationId: string; body: SendInterviewInput }
    >({
      query: ({ applicationId, body }) => ({
        url: `/api/v1/applications/${applicationId}/send-interview`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Interview", id: "LIST" },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    scheduleInterview: builder.mutation<
      APIResponse<Interview>,
      { interviewId: string; body: InterviewScheduleInput }
    >({
      query: ({ interviewId, body }) => ({
        url: `/api/v1/interviews/${interviewId}/schedule`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { interviewId }) => [
        { type: "Interview", id: "LIST" },
        { type: "Interview", id: interviewId },
        { type: "Candidate", id: "LIST" },
      ],
    }),

    getInterviews: builder.query<APIResponse<Interview[]>, void>({
      query: () => "/api/v1/interviews",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Interview" as const,
                id,
              })),
              { type: "Interview", id: "LIST" },
            ]
          : [{ type: "Interview", id: "LIST" }],
    }),

    getInterviewById: builder.query<APIResponse<Interview>, string>({
      query: (id) => `/api/v1/interviews/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Interview", id }],
    }),

    passRound: builder.mutation<
      APIResponse<Interview>,
      { roundId: string; candidateId?: string; body?: RoundDecisionInput }
    >({
      query: ({ roundId, body }) => ({
        url: `/api/v1/interviews/rounds/${roundId}/pass`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { candidateId }) => [
        { type: "Interview", id: "LIST" },
        { type: "Candidate", id: "LIST" },
        ...(candidateId ? [{ type: "Candidate" as const, id: candidateId }] : []),
      ],
    }),

    rejectRound: builder.mutation<
      APIResponse<Interview>,
      { roundId: string; candidateId?: string; body?: RoundDecisionInput }
    >({
      query: ({ roundId, body }) => ({
        url: `/api/v1/interviews/rounds/${roundId}/reject`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { candidateId }) => [
        { type: "Interview", id: "LIST" },
        { type: "Candidate", id: "LIST" },
        ...(candidateId ? [{ type: "Candidate" as const, id: candidateId }] : []),
      ],
    }),

    holdRound: builder.mutation<
      APIResponse<Interview>,
      { roundId: string; candidateId?: string; body?: RoundDecisionInput }
    >({
      query: ({ roundId, body }) => ({
        url: `/api/v1/interviews/rounds/${roundId}/hold`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { candidateId }) => [
        { type: "Interview", id: "LIST" },
        { type: "Candidate", id: "LIST" },
        ...(candidateId ? [{ type: "Candidate" as const, id: candidateId }] : []),
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSendInterviewMutation,
  useScheduleInterviewMutation,
  useGetInterviewsQuery,
  useGetInterviewByIdQuery,
  usePassRoundMutation,
  useRejectRoundMutation,
  useHoldRoundMutation,
} = interviewsApi;

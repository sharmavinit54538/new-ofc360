import { baseApi } from "./baseApi";

export interface TimelineEvent {
  id: string;
  employeeId: string;
  type: "promotion" | "award" | "project" | "skill" | "anniversary" | "role_change" | "certification";
  title: string;
  description: string;
  date: string;
  category: string;
  metadata?: Record<string, unknown>;
}

export interface AddTimelineEventInput {
  employeeId: string;
  type: TimelineEvent["type"];
  title: string;
  description: string;
  date?: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

export const timelineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeTimeline: builder.query<TimelineEvent[], string>({
      query: (employeeId) => `/api/v1/employees/${employeeId}/timeline`,
      providesTags: (_res, _err, employeeId) => [
        { type: "Timeline", id: employeeId },
        "Timeline",
      ],
    }),

    addTimelineEvent: builder.mutation<TimelineEvent, AddTimelineEventInput>({
      query: (body) => ({
        url: `/api/v1/employees/${body.employeeId}/timeline`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { employeeId }) => [
        { type: "Timeline", id: employeeId },
        { type: "Employee", id: employeeId },
        "Timeline",
      ],
    }),

    recordMilestone: builder.mutation<TimelineEvent, { employeeId: string; milestoneTitle: string }>({
      query: ({ employeeId, milestoneTitle }) => ({
        url: `/api/v1/employees/${employeeId}/timeline/milestone`,
        method: "POST",
        body: { milestoneTitle },
      }),
      invalidatesTags: (_res, _err, { employeeId }) => [
        { type: "Timeline", id: employeeId },
        { type: "Employee", id: employeeId },
        "Timeline",
      ],
    }),
  }),
});

export const {
  useGetEmployeeTimelineQuery,
  useAddTimelineEventMutation,
  useRecordMilestoneMutation,
} = timelineApi;
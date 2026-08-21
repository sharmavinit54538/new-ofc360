import { baseApi } from "./baseApi";
import type { TimelineEvent, AddTimelineEventInput } from "./timeline/timelineTypes";
import { timelineProvidesTags, timelineInvalidatesTags } from "./timeline/timelineTags";

export * from "./timeline/timelineTypes";

export const timelineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeTimeline: builder.query<TimelineEvent[], string>({
      query: (id) => `/api/v1/employees/${id}/timeline`,
      providesTags: timelineProvidesTags,
    }),
    addTimelineEvent: builder.mutation<TimelineEvent, AddTimelineEventInput>({
      query: (body) => ({ url: `/api/v1/employees/${body.employeeId}/timeline`, method: "POST", body }),
      invalidatesTags: timelineInvalidatesTags,
    }),
    recordMilestone: builder.mutation<TimelineEvent, { employeeId: string; milestoneTitle: string }>({
      query: ({ employeeId, milestoneTitle }) => ({ url: `/api/v1/employees/${employeeId}/timeline/milestone`, method: "POST", body: { milestoneTitle } }),
      invalidatesTags: timelineInvalidatesTags,
    }),
  }),
});
export const { useGetEmployeeTimelineQuery, useAddTimelineEventMutation, useRecordMilestoneMutation } = timelineApi;
import { baseApi } from "../baseApi";
import { OnboardingTaskItem } from "@/types/hrAdminOnboarding";

export const onboardingTasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingTasks: builder.query<OnboardingTaskItem[], { employeeId?: string }>({
      query: (params) => `/api/v1/onboarding/tasks${params?.employeeId ? `?employeeId=${params.employeeId}` : ""}`,
      providesTags: ["Onboarding"],
    }),
    updateTaskStatus: builder.mutation<OnboardingTaskItem, { taskId: string; isCompleted: boolean }>({
      query: ({ taskId, isCompleted }) => ({ url: `/api/v1/onboarding/tasks/${taskId}`, method: "PATCH", body: { is_completed: isCompleted } }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});
export const { useGetOnboardingTasksQuery, useUpdateTaskStatusMutation } = onboardingTasksApi;

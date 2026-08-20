import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const workflowsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2WorkflowsDefinitions: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/workflows/definitions` : typeof data === 'object' && data?.id ? `/api/v2/workflows/definitions` : '/api/v2/workflows/definitions',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Workflow'],
    }),
    createV2WorkflowsTrigger: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/workflows/trigger` : typeof data === 'object' && data?.id ? `/api/v2/workflows/trigger` : '/api/v2/workflows/trigger',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Workflow'],
    }),
    updateV2WorkflowsStepsStepIdDecision: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/workflows/steps/${data}/decision` : typeof data === 'object' && data?.id ? `/api/v2/workflows/steps/{step_id}/decision` : '/api/v2/workflows/steps/{step_id}/decision',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Workflow'],
    }),
    getV2WorkflowsInstancesMyPending: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v2/workflows/instances/my-pending` : typeof params === 'object' && params?.id ? `/api/v2/workflows/instances/my-pending` : '/api/v2/workflows/instances/my-pending',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Workflow'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2WorkflowsDefinitionsMutation,
  useCreateV2WorkflowsTriggerMutation,
  useUpdateV2WorkflowsStepsStepIdDecisionMutation,
  useGetV2WorkflowsInstancesMyPendingQuery,
} = workflowsApi;

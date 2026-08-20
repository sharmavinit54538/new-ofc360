import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createApplicationsIdOffer: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data.id}/offer` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/offer` : '/api/v1/applications/{id}/offer',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    updateOffersIdAccept: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/offers/${data.id}/accept` : typeof data === 'object' && data?.id ? `/api/v1/offers/${data.id}/accept` : '/api/v1/offers/{id}/accept',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    updateOffersIdReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/offers/${data.id}/reject` : typeof data === 'object' && data?.id ? `/api/v1/offers/${data.id}/reject` : '/api/v1/offers/{id}/reject',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    createApplicationsIdConvert: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data.id}/convert` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/convert` : '/api/v1/applications/{id}/convert',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getOffers: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/offers` : typeof params === 'object' && params?.id ? `/api/v1/offers` : '/api/v1/offers',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    createRequisitions: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/requisitions` : typeof data === 'object' && data?.id ? `/api/v1/requisitions` : '/api/v1/requisitions',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getRequisitions: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/requisitions` : typeof params === 'object' && params?.id ? `/api/v1/requisitions` : '/api/v1/requisitions',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    getRequisitionsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/requisitions/${params.id}` : typeof params === 'object' && params?.id ? `/api/v1/requisitions/${params.id}` : '/api/v1/requisitions/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    createRequisitionsIdApprove: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/requisitions/${data.id}/approve` : typeof data === 'object' && data?.id ? `/api/v1/requisitions/${data.id}/approve` : '/api/v1/requisitions/{id}/approve',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    createVendors: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/vendors` : typeof data === 'object' && data?.id ? `/api/v1/vendors` : '/api/v1/vendors',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getVendors: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/vendors` : typeof params === 'object' && params?.id ? `/api/v1/vendors` : '/api/v1/vendors',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    getVendorsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/vendors/${params.id}` : typeof params === 'object' && params?.id ? `/api/v1/vendors/${params.id}` : '/api/v1/vendors/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    updateVendorsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/vendors/${data.id}` : typeof data === 'object' && data?.id ? `/api/v1/vendors/${data.id}` : '/api/v1/vendors/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    deleteVendorsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/vendors/${data.id}` : typeof data === 'object' && data?.id ? `/api/v1/vendors/${data.id}` : '/api/v1/vendors/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    createCrmNotes: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/crm/notes` : typeof data === 'object' && data?.id ? `/api/v1/crm/notes` : '/api/v1/crm/notes',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getCrmNotesCandidateId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/crm/notes/${params.candidate_id}` : typeof params === 'object' && params?.id ? `/api/v1/crm/notes/{candidate_id}` : '/api/v1/crm/notes/{candidate_id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    createReferrals: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/referrals` : typeof data === 'object' && data?.id ? `/api/v1/referrals` : '/api/v1/referrals',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getReferrals: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/referrals` : typeof params === 'object' && params?.id ? `/api/v1/referrals` : '/api/v1/referrals',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    updateReferralsIdStatus: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/referrals/${data.id}/status` : typeof data === 'object' && data?.id ? `/api/v1/referrals/${data.id}/status` : '/api/v1/referrals/{id}/status',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    createAutomationsRules: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/automations/rules` : typeof data === 'object' && data?.id ? `/api/v1/automations/rules` : '/api/v1/automations/rules',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getAutomationsRules: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/automations/rules` : typeof params === 'object' && params?.id ? `/api/v1/automations/rules` : '/api/v1/automations/rules',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    getRecruitmentAnalytics: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/recruitment/analytics` : typeof params === 'object' && params?.id ? `/api/v1/recruitment/analytics` : '/api/v1/recruitment/analytics',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    getRecruitmentNotifications: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/recruitment/notifications` : typeof params === 'object' && params?.id ? `/api/v1/recruitment/notifications` : '/api/v1/recruitment/notifications',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    updateRecruitmentNotificationsIdRead: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/recruitment/notifications/${data.id}/read` : typeof data === 'object' && data?.id ? `/api/v1/recruitment/notifications/${data.id}/read` : '/api/v1/recruitment/notifications/{id}/read',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateApplicationsIdOfferMutation,
  useUpdateOffersIdAcceptMutation,
  useUpdateOffersIdRejectMutation,
  useCreateApplicationsIdConvertMutation,
  useGetOffersQuery,
  useCreateRequisitionsMutation,
  useGetRequisitionsQuery,
  useGetRequisitionsIdQuery,
  useCreateRequisitionsIdApproveMutation,
  useCreateVendorsMutation,
  useGetVendorsQuery,
  useGetVendorsIdQuery,
  useUpdateVendorsIdMutation,
  useDeleteVendorsIdMutation,
  useCreateCrmNotesMutation,
  useGetCrmNotesCandidateIdQuery,
  useCreateReferralsMutation,
  useGetReferralsQuery,
  useUpdateReferralsIdStatusMutation,
  useCreateAutomationsRulesMutation,
  useGetAutomationsRulesQuery,
  useGetRecruitmentAnalyticsQuery,
  useGetRecruitmentNotificationsQuery,
  useUpdateRecruitmentNotificationsIdReadMutation,
} = recruitmentApi;

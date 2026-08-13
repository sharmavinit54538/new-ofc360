import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const travelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTravelStatus: builder.query<ApiResponse<any>, void>({
      query: () => '/api/v1/travel/status',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTravelStatusQuery,
} = travelApi;

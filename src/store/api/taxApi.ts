import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const taxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaxStatus: builder.query<ApiResponse<any>, void>({
      query: () => '/api/v1/tax/status',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTaxStatusQuery,
} = taxApi;

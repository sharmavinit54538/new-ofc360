import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/health` : typeof params === 'object' && params?.id ? `/health` : '/health',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Settings'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetHealthQuery,
} = settingsApi;

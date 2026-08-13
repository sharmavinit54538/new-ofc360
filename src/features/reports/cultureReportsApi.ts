/**
 * TODO: backend not implemented — replace when /culture or /diversity endpoints ship
 * 
 * Note: This slice currently uses RTK Query `queryFn` to return typed static mock data
 * enclosed within the standard APIResponse<T> structure.
 * When real endpoints are available, swap `queryFn: async () => ({ data: ... })` 
 * to standard `query: () => ({ url: '/v1/culture/...', method: 'GET' })`.
 */

import { baseApi } from "@/services/api/baseApi";
import { APIResponse, CultureDiTelemetry } from "./types";

const MOCK_CULTURE_TELEMETRY: CultureDiTelemetry = {
  genderDistribution: [
    { label: "Female", value: 46 },
    { label: "Male", value: 48 },
    { label: "Non-Binary / Undisclosed", value: 6 },
  ],
  ageDistribution: [
    { label: "18-25", value: 18 },
    { label: "26-35", value: 52 },
    { label: "36-45", value: 20 },
    { label: "46+", value: 10 },
  ],
  inclusionIndex: 84, // 0 - 100
  diHiringRatio: 51.5, // %
};

export const cultureReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCultureTelemetry: builder.query<APIResponse<CultureDiTelemetry>, void>({
      // TODO: backend not implemented — replace when /culture or /diversity endpoints ship
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Culture & D&I Telemetry retrieved (Mocked Data)",
            data: MOCK_CULTURE_TELEMETRY,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "CultureReport", id: "TELEMETRY" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCultureTelemetryQuery } = cultureReportsApi;

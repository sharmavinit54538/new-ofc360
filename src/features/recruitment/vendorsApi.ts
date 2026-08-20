import { baseApi } from "@/services/api/baseApi";
import { APIResponse, VendorAgency, VendorInput } from "./types";

/**
 * Note: no "automatic candidate submission ingestion" endpoint exists distinct from
 * the normal resume-upload/candidate flow — external vendor candidate submissions
 * reuse `/api/v1/recruitment/resume/upload` (from candidatesApi) tagged with a
 * vendor ID field in the submission metadata.
 */

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<APIResponse<VendorAgency[]>, void>({
      query: () => "/api/v1/vendors",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Vendor" as const,
                id,
              })),
              { type: "Vendor", id: "LIST" },
            ]
          : [{ type: "Vendor", id: "LIST" }],
    }),

    getVendorById: builder.query<APIResponse<VendorAgency>, string>({
      query: (id) => `/api/v1/vendors/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Vendor", id }],
    }),

    createVendor: builder.mutation<APIResponse<VendorAgency>, VendorInput>({
      query: (body) => ({
        url: "/api/v1/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),

    updateVendor: builder.mutation<
      APIResponse<VendorAgency>,
      { id: string; body: VendorInput }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/vendors/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Vendor", id: "LIST" },
        { type: "Vendor", id },
      ],
    }),

    deleteVendor: builder.mutation<APIResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `/api/v1/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Vendor", id: "LIST" },
        { type: "Vendor", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
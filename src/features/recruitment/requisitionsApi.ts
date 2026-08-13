import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  Requisition,
  RequisitionCreateInput,
  RequisitionApproveInput,
} from "./types";

export const requisitionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequisitions: builder.query<
      APIResponse<Requisition[]>,
      { status?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append("status", params.status);
        const queryStr = queryParams.toString();
        return `/api/v1/requisitions${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Requisition" as const,
                id,
              })),
              { type: "Requisition", id: "LIST" },
            ]
          : [{ type: "Requisition", id: "LIST" }],
    }),

    getRequisitionById: builder.query<APIResponse<Requisition>, string>({
      query: (id) => `/api/v1/requisitions/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Requisition", id }],
    }),

    createRequisition: builder.mutation<
      APIResponse<Requisition>,
      RequisitionCreateInput
    >({
      query: (body) => ({
        url: "/api/v1/requisitions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Requisition", id: "LIST" }],
    }),

    approveRequisition: builder.mutation<
      APIResponse<Requisition>,
      { id: string; body: RequisitionApproveInput }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/requisitions/${id}/approve`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Requisition", id: "LIST" },
        { type: "Requisition", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRequisitionsQuery,
  useGetRequisitionByIdQuery,
  useCreateRequisitionMutation,
  useApproveRequisitionMutation,
} = requisitionsApi;

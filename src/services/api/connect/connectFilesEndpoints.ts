import { baseApi } from "../baseApi";
import { ConnectSharedFile } from "@/types/connect";
import { normalizeConnectSharedFile } from "./normalizeConnectSharedFile";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectFilesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query<ConnectSharedFile[], any>({ query: (params) => ({ url: "/api/v1/connect/files", params }), transformResponse: (raw: any): ConnectSharedFile[] => extractListFromEnvelope(raw, ["files"]).map(normalizeConnectSharedFile) }),
    getSharedFiles: builder.query<ConnectSharedFile[], any>({ query: (params) => ({ url: "/api/v1/connect/files", params }), transformResponse: (raw: any): ConnectSharedFile[] => extractListFromEnvelope(raw, ["files"]).map(normalizeConnectSharedFile) }),
    getFile: builder.query<ConnectSharedFile, string>({ query: (id) => `/api/v1/connect/files/${id}`, transformResponse: (raw: any) => normalizeConnectSharedFile(raw?.data || raw) }),
    uploadFile: builder.mutation<ConnectSharedFile, FormData>({ query: (body) => ({ url: "/api/v1/connect/files/upload", method: "POST", body }), transformResponse: (raw: any) => normalizeConnectSharedFile(raw?.data || raw) }),
    uploadSharedFile: builder.mutation<ConnectSharedFile, FormData>({ query: (body) => ({ url: "/api/v1/connect/files/upload", method: "POST", body }), transformResponse: (raw: any) => normalizeConnectSharedFile(raw?.data || raw) }),
    deleteSharedFile: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/files/${id}`, method: "DELETE" }) }),
    deleteFile: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/files/${id}`, method: "DELETE" }) }),
  }),
});
export const {
  useGetFilesQuery, useGetSharedFilesQuery, useGetFileQuery,
  useUploadFileMutation, useUploadSharedFileMutation, useDeleteSharedFileMutation, useDeleteFileMutation,
} = connectFilesApi;

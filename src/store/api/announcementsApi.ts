import { baseApi } from "./baseApi";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category?: string;
  status: "draft" | "published" | "archived" | string;
  priority?: "low" | "medium" | "high" | "urgent" | string;
  target_audience?: string[];
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  author_id?: string;
  author_name?: string;
}

export interface AnnouncementQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

export interface AnnouncementListResponse {
  items: Announcement[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  category?: string;
  priority?: string;
  target_audience?: string[];
  status?: string;
}

export interface UpdateAnnouncementRequest {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  priority?: string;
  target_audience?: string[];
  status?: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function transformApiResponse<T>(response: APIResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    return (response as APIResponse<T>).data;
  }
  return response as T;
}

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<Announcement[] | AnnouncementListResponse, AnnouncementQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        if (params?.status) searchParams.append("status", params.status);
        if (params?.category) searchParams.append("category", params.category);
        const q = searchParams.toString();
        return `/api/v1/announcements${q ? `?${q}` : ""}`;
      },
      keepUnusedDataFor: 60,
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : result?.items || [];
        return [
          ...items.map(({ id }) => ({ type: "Announcement" as const, id })),
          { type: "Announcement", id: "LIST" },
        ];
      },
    }),

    getAnnouncementById: builder.query<Announcement, string>({
      query: (id) => `/api/v1/announcements/${id}`,
      transformResponse: transformApiResponse,
      providesTags: (_result, _error, id) => [{ type: "Announcement", id }],
    }),

    createAnnouncement: builder.mutation<Announcement, CreateAnnouncementRequest>({
      query: (body) => ({
        url: "/api/v1/announcements",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),

    updateAnnouncement: builder.mutation<Announcement, UpdateAnnouncementRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/announcements/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    deleteAnnouncement: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/announcements/${id}`,
        method: "DELETE",
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    publishAnnouncement: builder.mutation<Announcement, string>({
      query: (id) => ({
        url: `/api/v1/announcements/${id}/publish`,
        method: "PATCH",
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    archiveAnnouncement: builder.mutation<Announcement, string>({
      query: (id) => ({
        url: `/api/v1/announcements/${id}/archive`,
        method: "PATCH",
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  useArchiveAnnouncementMutation,
} = announcementsApi;

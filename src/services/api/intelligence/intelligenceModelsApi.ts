import { baseApi } from "../baseApi";
import type { AIModelMetadata } from "./intelligenceTypes";
import type { GetAiModelsArg } from "./intelligenceResponseTypes";

export const intelligenceModelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModels: builder.query<AIModelMetadata[], GetAiModelsArg>({
      query: (params) => {
        const p = params as { category?: string } | undefined;
        return `/api/v1/intelligence/models${p?.category ? `?category=${p.category}` : ""}`;
      },
      providesTags: ["AIModel", "Intelligence"],
    }),
    getAiModelById: builder.query<AIModelMetadata, string>({
      query: (id) => `/api/v1/intelligence/models/${id}`,
      providesTags: (_res, _err, id) => [{ type: "AIModel", id }],
    }),
  }),
});
export const { useGetAiModelsQuery, useGetAiModelByIdQuery } = intelligenceModelsApi;

/**
 * TODO: backend not implemented — replace when passive talent pool & CRM endpoints ship.
 * 
 * Note: This slice uses RTK Query `queryFn` to return typed static mock data
 * wrapped inside standard APIResponse<T> envelope.
 */

import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SilverMedalistCandidate, TalentPoolTag } from "./types";

const MOCK_SILVER_MEDALISTS: SilverMedalistCandidate[] = [
  {
    id: "cand-silver-101",
    name: "Alex Rivera",
    role: "Senior Backend Engineer",
    last_interview_date: "2026-06-15",
    rating: 4.5,
    tags: ["Ex-Interviewed", "Strong Cultural Fit", "Go/Python"],
    notes: "Passed final technical round; rejected offer due to location. Open for remote roles in Q4.",
  },
  {
    id: "cand-silver-102",
    name: "Sophia Chen",
    role: "Lead UI/UX Designer",
    last_interview_date: "2026-05-20",
    rating: 4.8,
    tags: ["Ex-Interviewed", "Figma Expert", "Design Systems"],
    notes: "Runner-up for Principal Designer position. High interest in future leadership openings.",
  },
  {
    id: "cand-silver-103",
    name: "Marcus Vance",
    role: "DevOps Architect",
    last_interview_date: "2026-04-10",
    rating: 4.2,
    tags: ["Cold Lead", "Kubernetes", "AWS Certified"],
    notes: "Sourced via LinkedIn. Reached out during passive window.",
  },
];

const MOCK_TALENT_POOL_TAGS: TalentPoolTag[] = [
  { id: "tag-1", name: "Ex-Interviewed", count: 42 },
  { id: "tag-2", name: "Cold Lead", count: 128 },
  { id: "tag-3", name: "Executive Prospect", count: 14 },
  { id: "tag-4", name: "Alumni Candidate", count: 19 },
];

export const passiveTalentPoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSilverMedalists: builder.query<
      APIResponse<SilverMedalistCandidate[]>,
      void
    >({
      // TODO: backend not implemented — mock queryFn
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Passive talent pool candidates retrieved (Mocked Data)",
            data: MOCK_SILVER_MEDALISTS,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "TalentPool", id: "SILVER_MEDALISTS" }],
    }),

    getTalentPoolTags: builder.query<APIResponse<TalentPoolTag[]>, void>({
      // TODO: backend not implemented — mock queryFn
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Talent pool tags retrieved (Mocked Data)",
            data: MOCK_TALENT_POOL_TAGS,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "TalentPool", id: "TAGS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSilverMedalistsQuery, useGetTalentPoolTagsQuery } =
  passiveTalentPoolApi;

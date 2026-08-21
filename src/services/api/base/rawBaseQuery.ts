import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { prepareBaseHeaders } from "./prepareHeaders";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";

export const baseQuery = fetchBaseQuery({
  baseUrl: rawBaseUrl,
  timeout: 15000,
  credentials: "include",
  fetchFn: async (input, init) => {
    if (input instanceof Request) return fetch(input);
    return fetch(input, { ...init, credentials: init?.credentials || "include" });
  },
  prepareHeaders: prepareBaseHeaders,
});

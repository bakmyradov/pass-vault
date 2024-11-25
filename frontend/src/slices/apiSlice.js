import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import fetchCsrfToken from "../services/csrfService";
const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: async (headers) => {
    const token = await fetchCsrfToken();
    if (token) {
      headers.set("X-CSRF-Token", token);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Users", "Passwords"],
  endpoints: (builder) => ({}),
});

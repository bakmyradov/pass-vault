import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";
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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Execute the base query
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    api.dispatch(apiSlice.util.resetApiState());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "Passwords"],
  endpoints: (builder) => ({}),
});

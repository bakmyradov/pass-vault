import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";
import fetchCsrfToken, { resetCsrfToken } from "../services/csrfService";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: async (headers) => {
    try {
      const token = await fetchCsrfToken();
      if (token) {
        headers.set("X-CSRF-Token", token);
      }
    } catch (error) {
      console.error("Failed to prepare headers:", error);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    resetCsrfToken();
    api.dispatch(logout());
    api.dispatch(apiSlice.util.resetApiState());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "Passwords"],
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
});

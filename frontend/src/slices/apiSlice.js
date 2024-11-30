import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";
import fetchCsrfToken, { resetCsrfToken } from "../services/csrfService";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: async (headers) => {
    const token = await fetchCsrfToken(); // Fetch CSRF token once
    if (token) {
      headers.set("X-CSRF-Token", token);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Clear CSRF token on unauthorized error
    resetCsrfToken();

    // Logout and reset API state
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

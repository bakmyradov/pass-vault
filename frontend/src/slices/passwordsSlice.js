import { apiSlice } from "./apiSlice";
const PASSWORDS_URL = "/api/passwords";

export const passwordsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userPasswords: builder.query({
      query: () => ({
        url: PASSWORDS_URL,
        method: "GET",
      }),
      // Provides a list tag for all passwords
      providesTags: (result) =>
        result
          ? [
              { type: "Passwords", id: "LIST" },
              ...result.map(({ _id }) => ({ type: "Passwords", id: _id })),
            ]
          : [{ type: "Passwords", id: "LIST" }],
    }),
    addPassword: builder.mutation({
      query: (data) => ({
        url: PASSWORDS_URL,
        method: "POST",
        body: data,
      }),
      // Invalidates the "LIST" tag to refetch the entire list
      invalidatesTags: [{ type: "Passwords", id: "LIST" }],
    }),
    getPassword: builder.query({
      query: (id) => ({
        url: `${PASSWORDS_URL}/${id}`,
        method: "GET",
      }),
      // Provides a specific tag for the fetched password
      // providesTags: (result, error, id) => [{ type: "Passwords", id }],
    }),
    deletePassword: builder.mutation({
      query: (id) => ({
        url: `${PASSWORDS_URL}/${id}`,
        method: "DELETE",
      }),
      // Invalidates the specific password tag and the list
      invalidatesTags: (result, error, id) => [
        { type: "Passwords", id },
        { type: "Passwords", id: "LIST" },
      ],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${PASSWORDS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      // Invalidates the specific password tag to refetch it
      invalidatesTags: (result, error, { id }) => [{ type: "Passwords", id }],
    }),
  }),
});

export const {
  useUserPasswordsQuery,
  useAddPasswordMutation,
  useGetPasswordQuery,
  useDeletePasswordMutation,
  useUpdatePasswordMutation,
} = passwordsApiSlice;

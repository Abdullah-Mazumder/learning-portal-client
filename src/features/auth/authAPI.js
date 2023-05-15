import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => {
        return {
          url: "/login",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem(
            "LWSLearningPortalAppAuth",
            JSON.stringify({
              user: data.user,
            })
          );

          dispatch(userLoggedIn(data.user));
        } catch (error) {
          // do nothing
        }
      },
    }),

    studentRegistration: builder.mutation({
      query: (data) => {
        return {
          url: "/register",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          localStorage.setItem(
            "LWSLearningPortalAppAuth",
            JSON.stringify({
              user: data.user,
            })
          );

          dispatch(userLoggedIn(data.user));
        } catch (error) {
          // do nothing
        }
      },
    }),
  }),
});

export const { useLoginMutation, useStudentRegistrationMutation } = authApi;

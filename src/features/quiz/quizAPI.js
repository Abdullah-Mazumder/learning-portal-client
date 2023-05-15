/* eslint-disable eqeqeq */
import errorToast from "../../utils/errorToast";
import { apiSlice } from "../api/apiSlice";

export const quizApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query({
      query: () => "/quizzes",
      keepUnusedDataFor: 600,
    }),

    getQuizWithVideoId: builder.query({
      query: (videoId) => `/quizzes?video_id=${videoId}`,
      keepUnusedDataFor: 600,
    }),

    addQuiz: builder.mutation({
      query: (data) => ({
        url: "/quizzes",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_data, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // update getQuizzes cache pessimistically
          dispatch(
            apiSlice.util.updateQueryData("getQuizzes", undefined, (draft) => {
              draft.push(data);
            })
          );
        } catch (error) {}
      },
    }),

    editQuiz: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quizzes/${id}`,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // update getQuizzes cache pessimistically
          dispatch(
            apiSlice.util.updateQueryData("getQuizzes", undefined, (draft) => {
              return draft.map((q) => {
                if (q.id == data.id) {
                  return data;
                }
                return q;
              });
            })
          );
        } catch (error) {}
      },
    }),

    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        // update getQuizzes cache optimistically
        const deleteInstance = dispatch(
          apiSlice.util.updateQueryData("getQuizzes", undefined, (draft) => {
            return draft.filter((q) => q.id != id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          errorToast();
          deleteInstance.undo();
        }
      },
    }),
  }),
});

export const {
  useGetQuizWithVideoIdQuery,
  useGetQuizzesQuery,
  useAddQuizMutation,
  useEditQuizMutation,
  useDeleteQuizMutation,
} = quizApi;

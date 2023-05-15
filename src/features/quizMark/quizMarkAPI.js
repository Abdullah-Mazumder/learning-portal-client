import { apiSlice } from "../api/apiSlice";

export const quizMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuizMarks: builder.query({
      query: () => `/quizMark`,
    }),

    getQuizMarkWithStudentIdAndVideoId: builder.query({
      query: ({ studentId, videoId }) =>
        `/quizMark?student_id=${studentId}&video_id=${videoId}`,
    }),

    getQuizMarksWithVideoId: builder.query({
      query: (videoId) => `/quizMark?video_id=${videoId}`,
    }),

    editQuizMark: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quizMark/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteQuizMarkWithId: builder.mutation({
      query: (quizId) => ({
        url: `/quizMark/${quizId}`,
        method: "DELETE",
      }),
    }),

    submitQuizMark: builder.mutation({
      query: (data) => ({
        url: "/quizMark",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // update getQuizMarkWithStudentIdAndVideoId and getAllQuizMarks cache pessimistically
          dispatch(
            apiSlice.util.updateQueryData(
              "getQuizMarkWithStudentIdAndVideoId",
              {
                studentId: data.student_id,
                videoId: data.video_id.toString(),
              },
              (draft) => {
                draft.push(data);
              }
            )
          );

          dispatch(
            apiSlice.util.updateQueryData(
              "getAllQuizMarks",
              undefined,
              (draft) => {
                draft.push(data);
              }
            )
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useGetQuizMarkWithStudentIdAndVideoIdQuery,
  useSubmitQuizMarkMutation,
  useGetAllQuizMarksQuery,
} = quizMarkApi;

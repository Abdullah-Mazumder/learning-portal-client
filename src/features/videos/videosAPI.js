/* eslint-disable eqeqeq */
import errorToast from "../../utils/errorToast";
import { apiSlice } from "../api/apiSlice";
import { assignmentsApi } from "../assignments/assignmentsAPI";
import { assignmentsMarkApi } from "../assignmentsMark/assignmentsMarkAPI";
import { quizApi } from "../quiz/quizAPI";
import { quizMarkApi } from "../quizMark/quizMarkAPI";

export const videosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => "/videos",
      keepUnusedDataFor: 600,
    }),

    getVideo: builder.query({
      query: (id) => `/videos/${id}`,
      keepUnusedDataFor: 600,
    }),

    addVideo: builder.mutation({
      query: (data) => ({
        url: "/videos",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        // update getVideos cache pessimistically
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
              draft.push(data);
            })
          );
        } catch (error) {
          // do nothing
        }
      },
    }),

    editVideo: builder.mutation({
      query: ({ id, data }) => ({
        url: "/videos/" + id,
        method: "PATCH",
        body: data,
      }),

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          // update getVideos cache pessimistically
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
              return draft.map((video) => {
                if (video.id == data.id) {
                  return {
                    ...video,
                    ...data,
                  };
                }
                return video;
              });
            })
          );

          // silently update the video title of the assignment related to this video if assignment exists
          const { data: assignment } = await dispatch(
            assignmentsApi.endpoints.getAssignmentWithVideoId.initiate(data.id)
          );
          if (assignment?.length > 0) {
            await Promise.all([
              dispatch(
                assignmentsApi.endpoints.editAssignment.initiate({
                  id: assignment[0].id,
                  data: { video_title: data.title },
                })
              ),
            ]);
          }

          // silently update the video title of all quizzes related to this video if quizzes exist
          const { data: quizzes } = await dispatch(
            quizApi.endpoints.getQuizWithVideoId.initiate(data.id)
          );
          if (quizzes?.length > 0) {
            await Promise.all([
              quizzes.map((quiz) =>
                dispatch(
                  quizApi.endpoints.editQuiz.initiate({
                    id: quiz.id,
                    data: { video_title: data.title },
                  })
                )
              ),
            ]);
          }

          // silently update the video title of all quiz marks related to this video
          const { data: quizMarks } = await dispatch(
            quizMarkApi.endpoints.getQuizMarksWithVideoId.initiate(data.id)
          );
          if (quizMarks?.length > 0) {
            await Promise.all([
              quizMarks.map((quizMark) =>
                dispatch(
                  quizMarkApi.endpoints.editQuizMark.initiate({
                    id: quizMark.id,
                    data: { video_title: data.title },
                  })
                )
              ),
            ]);
          }
        } catch (error) {}
      },
    }),

    deleteVideo: builder.mutation({
      query: (videoId) => ({
        url: `/videos/${videoId}`,
        method: "DELETE",
      }),

      async onQueryStarted(videoId, { queryFulfilled, dispatch }) {
        // update getVideos cache optimistically
        const deleteVideoInstance = dispatch(
          apiSlice.util.updateQueryData("getVideos", undefined, (draft) => {
            return draft.filter((video) => video.id != videoId);
          })
        );
        try {
          await queryFulfilled;

          // silently delete the assignment of this video if exists
          const { data: assignment } = await dispatch(
            assignmentsApi.endpoints.getAssignmentWithVideoId.initiate(videoId)
          );
          if (assignment.length > 0) {
            await Promise.all([
              dispatch(
                assignmentsApi.endpoints.deleteAssignment.initiate(
                  assignment[0]?.id
                )
              ),

              // silently delete all assignment marks with this assignment id
              dispatch(
                assignmentsMarkApi.endpoints.getAssignmentMarksWithAssId.initiate(
                  assignment[0]?.id
                )
              ).then(({ data: assignments }) =>
                Promise.all(
                  assignments.map((ass) =>
                    dispatch(
                      assignmentsMarkApi.endpoints.deleteAssignmentMark.initiate(
                        ass.id
                      )
                    )
                  )
                )
              ),
            ]);
          }

          // silently delete all quizzes of this video if exist
          const { data: quizzes } = await dispatch(
            quizApi.endpoints.getQuizWithVideoId.initiate(videoId)
          );
          if (quizzes.length > 0) {
            await Promise.all(
              quizzes.map((quiz) =>
                dispatch(quizApi.endpoints.deleteQuiz.initiate(quiz.id))
              )
            );
          }

          // silently delete all quiz marks related to this video id if exist
          const { data: quizMarks } = await dispatch(
            quizMarkApi.endpoints.getQuizMarksWithVideoId.initiate(videoId)
          );
          if (quizMarks.length > 0) {
            await Promise.all(
              quizMarks.map((quizMark) =>
                dispatch(
                  quizMarkApi.endpoints.deleteQuizMarkWithId.initiate(
                    quizMark.id
                  )
                )
              )
            );
          }
        } catch (error) {
          deleteVideoInstance.undo();
          errorToast();
        }
      },
    }),
  }),
});

export const {
  useGetVideosQuery,
  useAddVideoMutation,
  useDeleteVideoMutation,
  useEditVideoMutation,
  useGetVideoQuery,
} = videosApi;

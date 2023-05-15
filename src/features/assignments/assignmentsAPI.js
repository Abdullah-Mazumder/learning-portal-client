/* eslint-disable eqeqeq */
import errorToast from "../../utils/errorToast";
import { apiSlice } from "../api/apiSlice";

export const assignmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: () => "/assignments",
      keepUnusedDataFor: 600,
    }),

    getAssignmentWithVideoId: builder.query({
      query: (videoId) => `/assignments?video_id=${videoId}`,
      keepUnusedDataFor: 600,
    }),

    addAssignment: builder.mutation({
      query: (data) => ({
        url: "/assignments",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        // update getAssignments cache pessimistically
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getAssignments",
              undefined,
              (draft) => {
                draft.push(data);
              }
            )
          );
        } catch (error) {
          // do nothing
        }
      },
    }),

    editAssignment: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: "/assignments/" + id,
          method: "PATCH",
          body: data,
        };
      },

      async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
        // update getAssignments cache pessimistically
        try {
          const { data } = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              "getAssignments",
              undefined,
              (draft) => {
                return draft.map((assignment) => {
                  if (assignment.id == data.id) {
                    return {
                      ...assignment,
                      ...data,
                    };
                  }
                  return assignment;
                });
              }
            )
          );
        } catch (error) {}
      },
    }),

    deleteAssignment: builder.mutation({
      query: (assignmentId) => ({
        url: `/assignments/${assignmentId}`,
        method: "DELETE",
      }),

      async onQueryStarted(assignmentId, { queryFulfilled, dispatch }) {
        // update getAssignments cache optimistically
        const deleteAssignmentInstance = dispatch(
          apiSlice.util.updateQueryData(
            "getAssignments",
            undefined,
            (draft) => {
              return draft.filter(
                (assignment) => assignment.id != assignmentId
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          deleteAssignmentInstance.undo();
          errorToast();
        }
      },
    }),

    // editVideoTitleOfAssignmentWithId: builder.mutation({
    //   query: ({ assId, video_title }) => ({
    //     url: `/assignments/${assId}`,
    //     method: "PATCH",
    //     body: { video_title },
    //   }),

    //   async onQueryStarted(
    //     { assId, video_title },
    //     { queryFulfilled, dispatch }
    //   ) {
    //     try {
    //       await queryFulfilled;

    //       // update getAssignments cache pessimistically
    //       dispatch(
    //         apiSlice.util.updateQueryData(
    //           "getAssignments",
    //           undefined,
    //           (draft) => {
    //             const assignment = draft.find((ass) => ass.id == assId);
    //             assignment.video_title = video_title;
    //           }
    //         )
    //       );
    //     } catch (error) {}
    //   },
    // }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useAddAssignmentMutation,
  useDeleteAssignmentMutation,
  useEditAssignmentMutation,
  useGetAssignmentWithVideoIdQuery,
} = assignmentsApi;

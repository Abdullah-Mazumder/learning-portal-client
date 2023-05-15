/* eslint-disable eqeqeq */
import errorToast from "../../utils/errorToast";
import { apiSlice } from "../api/apiSlice";

export const assignmentsMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentsMark: builder.query({
      query: () => "/assignmentMark",
      keepUnusedDataFor: 600,
    }),

    getAllAssignmentMarks: builder.query({
      query: () => `/assignmentMark?status=published`,
      keepUnusedDataFor: 600,
    }),

    getSingleAssMarkWithStudentIdAndAssId: builder.query({
      query: ({ studentId, assignmentId }) =>
        `/assignmentMark?student_id=${studentId}&assignment_id=${assignmentId}`,
      keepUnusedDataFor: 600,
    }),

    getAssignmentMarksWithAssId: builder.query({
      query: (assignmentId) => `/assignmentMark?&assignment_id=${assignmentId}`,
      keepUnusedDataFor: 600,
    }),

    giveAssignmentMark: builder.mutation({
      query: ({ id, number }) => ({
        url: `/assignmentMark/${id}`,
        method: "PATCH",
        body: {
          mark: +number,
          status: "published",
        },
      }),

      async onQueryStarted({ id, number }, { queryFulfilled, dispatch }) {
        // update getAssignmentsMark cache optimistically
        const instance = dispatch(
          apiSlice.util.updateQueryData(
            "getAssignmentsMark",
            undefined,
            (draft) => {
              return draft.map((assMark) => {
                if (assMark.id == id) {
                  return {
                    ...assMark,
                    mark: +number,
                    status: "published",
                  };
                }
                return assMark;
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          errorToast();
          instance.undo();
        }
      },
    }),

    submitAssignment: builder.mutation({
      query: (data) => ({
        url: "/assignmentMark",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(
        { student_id, assignment_id },
        { queryFulfilled, dispatch }
      ) {
        try {
          const { data } = await queryFulfilled;

          // update th getSingleAssMarkWithStudentIdAndAssId cache pessimistically
          dispatch(
            apiSlice.util.updateQueryData(
              "getSingleAssMarkWithStudentIdAndAssId",
              { studentId: student_id, assignmentId: assignment_id },
              (draft) => {
                draft.push(data);
              }
            )
          );
        } catch (error) {}
      },
    }),

    deleteAssignmentMark: builder.mutation({
      query: (assId) => ({
        url: `/assignmentMark/${assId}`,
        method: "DELETE",
      }),

      async onQueryStarted(assId, { queryFulfilled, dispatch }) {
        // delete getAssignmentsMark cache pessimistically
        try {
          await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              "getAssignmentsMark",
              undefined,
              (draft) => {
                return draft.filter((assMark) => assMark.id != assId);
              }
            )
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useGetAssignmentsMarkQuery,
  useGiveAssignmentMarkMutation,
  useGetSingleAssMarkWithStudentIdAndAssIdQuery,
  useSubmitAssignmentMutation,
  useGetAllAssignmentMarksQuery,
} = assignmentsMarkApi;

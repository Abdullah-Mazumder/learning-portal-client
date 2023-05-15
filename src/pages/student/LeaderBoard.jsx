/* eslint-disable eqeqeq */
import { useSelector } from "react-redux";
import useAddTitle from "../../hooks/useAddTitle";
import { useGetAllAssignmentMarksQuery } from "../../features/assignmentsMark/assignmentsMarkAPI";
import { useGetAllQuizMarksQuery } from "../../features/quizMark/quizMarkAPI";
import Loader from "../../components/Loader";
import { useEffect, useState, Fragment } from "react";
import shortid from "shortid";
import Error from "../../components/Error";
import NotFound from "../../components/NotFound";
import _ from "lodash";
import useShowError from "../../hooks/useShowError";

const LeaderBoard = () => {
  useAddTitle("Leaderboard");
  const { id: userId, name } = useSelector((state) => state.auth?.user) || {};

  // for fetching all asssignment marks which are published
  const {
    data: assignmentMarks,
    isLoading: isAssMarksLoading,
    isError: isAssMarksError,
  } = useGetAllAssignmentMarksQuery();

  // for fetching all quiz marks
  const {
    data: quizMarks,
    isLoading: isQuizMarksLoading,
    isError: isQuizMarksError,
  } = useGetAllQuizMarksQuery();

  const [myRank, setMyRank] = useState(null);
  const [sortedRanks, setSortedRanks] = useState(null);

  const listFormatWithStudentId = (list) => {
    return list.reduce((acc, curr) => {
      if (acc[curr.student_id]) {
        acc[curr.student_id].push(curr);
      } else {
        acc[curr.student_id] = [curr];
      }
      return acc;
    }, {});
  };

  const sumOperationInArray = (array) => {
    return array.reduce((acc, curr) => {
      acc += curr.mark;
      return acc;
    }, 0);
  };

  // this useEffect for generating sorted student rank
  useEffect(() => {
    if (isQuizMarksLoading || isAssMarksLoading) {
      return;
    }

    if (
      !(
        (assignmentMarks instanceof Array && assignmentMarks?.length > 0) ||
        (quizMarks instanceof Array && quizMarks?.length > 0)
      )
    ) {
      return;
    }

    // this is for formatting assignment marks
    const studentIdWiseAssignmentMarks =
      listFormatWithStudentId(assignmentMarks);

    // this is for formatting quiz marks
    const studentIdWiseQuizMarks = listFormatWithStudentId(quizMarks);

    const commonStudentsOfQuizMarksAndAssignmentMarks = _.intersection(
      Object.keys(studentIdWiseAssignmentMarks),
      Object.keys(studentIdWiseQuizMarks)
    );

    const uniquieStudentsOfAssignmentMarks = _.difference(
      Object.keys(studentIdWiseAssignmentMarks),
      commonStudentsOfQuizMarksAndAssignmentMarks
    );

    const uniquieStudentsOfQuizMarks = _.difference(
      Object.keys(studentIdWiseQuizMarks),
      commonStudentsOfQuizMarksAndAssignmentMarks
    );

    const marksArray = [];

    commonStudentsOfQuizMarksAndAssignmentMarks.forEach((studentId) => {
      const studentName =
        studentIdWiseAssignmentMarks[studentId][0].student_name;

      // total assignment marks of a single student
      const assMark = sumOperationInArray(
        studentIdWiseAssignmentMarks[studentId]
      );

      // total quiz marks of a single student
      const quizMark = sumOperationInArray(studentIdWiseQuizMarks[studentId]);

      const studentObj = {
        studentId,
        studentName,
        assignmentMark: assMark,
        quizMark,
        totalMark: assMark + quizMark,
      };

      marksArray.push(studentObj);
    });

    uniquieStudentsOfAssignmentMarks.forEach((studentId) => {
      const studentName =
        studentIdWiseAssignmentMarks[studentId][0].student_name;

      // total assignment marks of a single student
      const assMark = sumOperationInArray(
        studentIdWiseAssignmentMarks[studentId]
      );

      // this is 0. because there is no quiz mark with this student id in quiz marks table
      const quizMark = 0;

      const studentObj = {
        studentId,
        studentName,
        assignmentMark: assMark,
        quizMark,
        totalMark: assMark + quizMark,
      };

      marksArray.push(studentObj);
    });

    uniquieStudentsOfQuizMarks.forEach((studentId) => {
      const studentName = studentIdWiseQuizMarks[studentId][0].student_name;

      const assMark = 0;
      const quizMark = sumOperationInArray(studentIdWiseQuizMarks[studentId]);

      const studentObj = {
        studentId,
        studentName,
        assignmentMark: assMark,
        quizMark,
        totalMark: assMark + quizMark,
      };

      marksArray.push(studentObj);
    });

    // sorting and filtering the marks array
    const sortedMarksArray = marksArray
      .filter((m) => m.totalMark != 0)
      .sort((a, b) => b.totalMark - a.totalMark);

    let initialRank = 1;

    // sorting marks array with rank
    const sortedMarksInRank = sortedMarksArray.reduce(
      (acc, curr, index) => {
        if (index === 0) {
          acc[initialRank].push(curr);
        } else {
          if (
            acc[initialRank].find((item) => item.totalMark === curr.totalMark)
          ) {
            acc[initialRank].push(curr);
          } else {
            initialRank++;
            acc[initialRank] = [curr];
          }
        }
        return acc;
      },
      {
        [initialRank]: [],
      }
    );

    // for getting current user rank
    let myInfo = null;
    Object.keys(sortedMarksInRank).forEach((rank) => {
      sortedMarksInRank[rank].forEach((item) => {
        if (item.studentId == userId) {
          myInfo = {
            rank,
            ...item,
          };
          return;
        }
      });
    });

    if (!myInfo) {
      myInfo = {
        studentId: userId,
        studentName: name,
        assignmentMark: 0,
        quizMark: 0,
        totalMark: 0,
        rank: Object.keys(sortedMarksInRank).length + 1,
      };
    }

    // for getting top 20 rank
    const top20SortedRanks = Object.keys(sortedMarksInRank)
      .sort((a, b) => +a - +b)
      .splice(0, 20)
      .reduce((acc, key) => {
        acc[key] = sortedMarksInRank[key];
        return acc;
      }, {});

    setMyRank(myInfo);
    setSortedRanks(top20SortedRanks);
  }, [
    assignmentMarks,
    quizMarks,
    isAssMarksLoading,
    isQuizMarksLoading,
    userId,
    name,
  ]);

  useShowError(isAssMarksError);
  useShowError(isQuizMarksError);

  // decide what to render
  let content = null;

  if (isAssMarksLoading || isQuizMarksLoading) {
    content = <Loader />;
  }

  if (
    !isAssMarksLoading &&
    !isQuizMarksLoading &&
    (isAssMarksError || isQuizMarksError)
  ) {
    content = <Error />;
  }

  if (
    (assignmentMarks instanceof Array && assignmentMarks?.length > 0) ||
    (quizMarks instanceof Array && quizMarks?.length > 0)
  ) {
    content = (
      <>
        <div>
          <h3 className="text-lg font-bold">Your Position in Leaderboard</h3>
          {myRank && (
            <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
              <thead>
                <tr>
                  <th className="table-th !text-center">Rank</th>
                  <th className="table-th !text-center">Name</th>
                  <th className="table-th !text-center">Quiz Mark</th>
                  <th className="table-th !text-center">Assignment Mark</th>
                  <th className="table-th !text-center">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-2 border-cyan">
                  <td className="table-td text-center font-bold">
                    {myRank.rank}
                  </td>
                  <td className="table-td text-center font-bold">
                    {myRank.studentName}
                  </td>
                  <td className="table-td text-center font-bold">
                    {myRank.quizMark}
                  </td>
                  <td className="table-td text-center font-bold">
                    {myRank.assignmentMark}
                  </td>
                  <td className="table-td text-center font-bold">
                    {myRank.totalMark}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="my-8">
          <h3 className="text-lg font-bold">Top 20 Result</h3>
          <table className="text-base w-full border border-slate-600/50 rounded-md my-4">
            <thead>
              <tr className="border-b border-slate-600/50">
                <th className="table-th !text-center">Rank</th>
                <th className="table-th !text-center">Name</th>
                <th className="table-th !text-center">Quiz Mark</th>
                <th className="table-th !text-center">Assignment Mark</th>
                <th className="table-th !text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {sortedRanks && Object.keys(sortedRanks).length > 0 ? (
                <Fragment>
                  {Object.keys(sortedRanks).map((rank) => (
                    <Fragment key={shortid.generate()}>
                      {sortedRanks[rank].map((stdInfo) => (
                        <tr
                          key={shortid.generate()}
                          className={`${
                            stdInfo.studentId == userId
                              ? "border-2 border-cyan"
                              : "border-b border-slate-600/50"
                          }`}
                        >
                          <td className="table-td text-center">{rank}</td>
                          <td className="table-td text-center">
                            {stdInfo.studentName}
                          </td>
                          <td className="table-td text-center">
                            {stdInfo.quizMark}
                          </td>
                          <td className="table-td text-center">
                            {stdInfo.assignmentMark}
                          </td>
                          <td className="table-td text-center">
                            {stdInfo.totalMark}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  if (
    assignmentMarks instanceof Array &&
    assignmentMarks?.length === 0 &&
    quizMarks instanceof Array &&
    quizMarks?.length === 0
  ) {
    content = <NotFound text="Leader Board Is Empty!" />;
  }

  return (
    <section className="py-6 bg-primary">
      <div className="mx-auto max-w-7xl px-5 lg:px-0">{content}</div>
    </section>
  );
};

export default LeaderBoard;

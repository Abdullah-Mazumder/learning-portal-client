import { useEffect, useState } from "react";
import { useGiveAssignmentMarkMutation } from "../../features/assignmentsMark/assignmentsMarkAPI";
import errorToast from "../../utils/errorToast";
import successToast from "../../utils/successToast";

const SingleAssignmentMark = ({ assignmentMark }) => {
  const {
    id,
    student_name,
    title,
    createdAt,
    totalMark,
    mark,
    repo_link,
    status,
  } = assignmentMark || {};
  const [giveAssMark, { isSuccess }] = useGiveAssignmentMarkMutation();
  const [assMark, setAssMark] = useState("0");

  useEffect(() => {
    if (isSuccess) {
      successToast(`Assignment number given to ${student_name}`);
    }
  }, [isSuccess, student_name]);
  return (
    <tr>
      <td className="table-td">{title}</td>
      <td className="table-td">{new Date(createdAt).toUTCString()}</td>
      <td className="table-td">{student_name}</td>
      <td className="table-td">{repo_link}</td>
      <td className="table-td">{totalMark}</td>

      {status === "pending" ? (
        <>
          <td className="table-td input-mark">
            <input
              type="number"
              value={assMark}
              onChange={(e) => setAssMark(+e.target.value)}
            />
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-green-500 cursor-pointer hover:text-green-400"
              onClick={() => {
                if (assMark < 0 || assMark > totalMark) {
                  errorToast("Mark is not valid!");
                  return;
                }
                giveAssMark({ id, number: assMark });
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </td>
        </>
      ) : (
        <td className="table-td">{mark}</td>
      )}
    </tr>
  );
};

export default SingleAssignmentMark;

import SingleAssignmentMark from "../../components/admin/SingleAssignmentMark";
import { useGetAssignmentsMarkQuery } from "../../features/assignmentsMark/assignmentsMarkAPI";
import Loader from "../../components/Loader";
import useAddTitle from "../../hooks/useAddTitle";
import { useEffect, useState } from "react";
import Error from "../../components/Error";
import NotFound from "../../components/NotFound";
import errorToast from "../../utils/errorToast";

const AssignmentMark = () => {
  useAddTitle("Assignment Mark");
  const {
    data: assignmentsMark,
    isLoading,
    isError,
  } = useGetAssignmentsMarkQuery();
  const [filterStatus, setFilterStatus] = useState("all");

  const filterWithStatus = () => {
    return assignmentsMark?.filter((item) => {
      if (filterStatus === "pending") {
        return item.status === "pending";
      }

      if (filterStatus === "sent") {
        return item.status === "published";
      }

      return true;
    });
  };

  useEffect(() => {
    if (isError) {
      errorToast();
    }
  }, [isError]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <Loader />;
  }

  if (!isLoading && isError) {
    content = <Error />;
  }

  if (!isLoading && !isError && filterWithStatus().length === 0) {
    content = <NotFound text="No Assignment Mark Found!" />;
  }

  if (!isLoading && !isError && filterWithStatus().length > 0) {
    content = (
      <>
        <div className="overflow-x-auto mt-4">
          <table className="divide-y-1 text-base divide-gray-600 w-full">
            <thead>
              <tr>
                <th className="table-th">Assignment</th>
                <th className="table-th">Date</th>
                <th className="table-th">Student Name</th>
                <th className="table-th">Repo Link</th>
                <th className="table-th">Total Mark</th>
                <th className="table-th">Mark</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-600/50">
              {filterWithStatus().map((assMark) => {
                return (
                  <SingleAssignmentMark
                    key={assMark.id}
                    assignmentMark={assMark}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <section className="py-6 bg-primary">
      <div className="mx-auto max-w-full px-5 lg:px-20">
        <div className="px-3 py-20 bg-opacity-10">
          {assignmentsMark && assignmentsMark?.length > 0 && (
            <ul className="assignment-status">
              <li
                className={`${
                  filterStatus === "all" && "bg-[#454178]"
                } cursor-pointer`}
                onClick={() => setFilterStatus("all")}
              >
                Total <span>{assignmentsMark.length}</span>
              </li>
              <li
                className={`${
                  filterStatus === "pending" && "bg-[#307c4c]"
                } cursor-pointer`}
                onClick={() => setFilterStatus("pending")}
              >
                Pending{" "}
                <span>
                  {
                    assignmentsMark.filter((ass) => ass.status === "pending")
                      .length
                  }
                </span>
              </li>
              <li
                className={`${
                  filterStatus === "sent" && "bg-[#775c20]"
                } cursor-pointer`}
                onClick={() => setFilterStatus("sent")}
              >
                Mark Sent{" "}
                <span>
                  {
                    assignmentsMark.filter((ass) => ass.status !== "pending")
                      .length
                  }
                </span>
              </li>
            </ul>
          )}
          {content}
        </div>
      </div>
    </section>
  );
};

export default AssignmentMark;

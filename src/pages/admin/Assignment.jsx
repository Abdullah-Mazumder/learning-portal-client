import { useEffect, useState } from "react";
import SingleAssignment from "../../components/admin/SingleAssignment";
import {
  useAddAssignmentMutation,
  useEditAssignmentMutation,
  useGetAssignmentsQuery,
} from "../../features/assignments/assignmentsAPI";
import { useGetVideosQuery } from "../../features/videos/videosAPI";
import useAddTitle from "../../hooks/useAddTitle";
import ModalWrapper from "../../components/ModalWrapper";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import SelectBox from "../../components/SelectBox";
import successToast from "../../utils/successToast";
import Spinner from "../../components/Spinner";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import NotFound from "../../components/NotFound";
import useShowError from "../../hooks/useShowError";

const Assignment = () => {
  useAddTitle("Assignments");
  const { data: assignments, isError, isLoading } = useGetAssignmentsQuery();
  const { data: videos, isError: isGetVideosError } = useGetVideosQuery();
  const [modal, setModal] = useState(false);
  const [videosForAddAssignments, setVideosForAddAssignments] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentMark, setAssignmentMark] = useState("");
  const [selectedVideoIdAndTitle, setSelectedVideoIdAndTitle] = useState("");
  const [
    addAssignment,
    {
      isLoading: isAddAssLoading,
      isError: isAddAssError,
      isSuccess: isAddAssSuccess,
    },
  ] = useAddAssignmentMutation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [
    editAssignment,
    {
      isLoading: isEditAssLoading,
      isError: isEditAssError,
      isSuccess: isEditAssSuccess,
    },
  ] = useEditAssignmentMutation();

  const resetFormState = () => {
    setAssignmentMark("");
    setAssignmentTitle("");
    setSelectedVideoIdAndTitle("");
  };

  const addNewAssignment = (e) => {
    e.preventDefault();

    const video_id = JSON.parse(selectedVideoIdAndTitle).id;
    const video_title = JSON.parse(selectedVideoIdAndTitle).title;

    addAssignment({
      title: assignmentTitle,
      video_id,
      video_title,
      totalMark: assignmentMark,
    });
  };

  const editTheAssignment = (e) => {
    e.preventDefault();

    const video_id = JSON.parse(selectedVideoIdAndTitle).id;
    const video_title = JSON.parse(selectedVideoIdAndTitle).title;

    editAssignment({
      id: editAssignmentId,
      data: {
        title: assignmentTitle,
        totalMark: assignmentMark,
        video_id,
        video_title,
      },
    });
  };

  useEffect(() => {
    if (isAddAssSuccess) {
      successToast("Assignment added successfully!");
      resetFormState();
      setModal(false);
    }
  }, [isAddAssSuccess]);

  useEffect(() => {
    if (isEditAssSuccess) {
      successToast("Assignment edited successfully!");
      resetFormState();
      setModal(false);
    }
  }, [isEditAssSuccess]);

  // this useEffect for filtering videos for adding assignments. because those videos already have assignments then it should not show in dropdown select box when adding assignments
  useEffect(() => {
    if (videos?.length > 0 && assignments instanceof Array) {
      const filteredVideos = videos.filter((video) => {
        if (
          assignments.find((assignment) => assignment.video_id === video.id)
        ) {
          return false;
        }
        return true;
      });

      if (!isEditMode) {
        setVideosForAddAssignments(filteredVideos);
      } else {
        // when we are editing assignments then the video of the assignment will be showed in select box
        const assignmentToEdit = assignments.find(
          (assignment) => assignment.id === editAssignmentId
        );
        const videoIdOfAssignmentToEdit = assignmentToEdit.video_id;
        const video = videos.find(
          (video) => video.id === videoIdOfAssignmentToEdit
        );
        setVideosForAddAssignments([...filteredVideos, video]);
      }
    }
  }, [videos, assignments, isEditMode, editAssignmentId]);

  useShowError(isGetVideosError);
  useShowError(isAddAssError);
  useShowError(isEditAssError);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <Loader />;
  }

  if (!isLoading && isError) {
    content = <Error />;
  }

  if (!isLoading && !isError && assignments.length === 0) {
    content = <NotFound text="No Assignment Found!" />;
  }

  if (!isLoading && !isError && assignments.length > 0) {
    content = (
      <div className="overflow-x-auto mt-4">
        <table className="divide-y-1 text-base divide-gray-600 w-full">
          <thead>
            <tr>
              <th className="table-th">Title</th>
              <th className="table-th">Video Title</th>
              <th className="table-th">Mark</th>
              <th className="table-th">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-600/50">
            {assignments.map((assignment) => (
              <SingleAssignment
                key={assignment.id}
                assignment={assignment}
                setModal={setModal}
                setAssignmentMark={setAssignmentMark}
                setAssignmentTitle={setAssignmentTitle}
                setSelectedVideoIdAndTitle={setSelectedVideoIdAndTitle}
                setIsEditMode={setIsEditMode}
                setEditAssignmentId={setEditAssignmentId}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <section className="py-6 bg-primary">
      <div className="mx-auto max-w-full px-5 lg:px-20">
        <div className="px-3 py-20 bg-opacity-10">
          <div className="w-full flex">
            <button
              className="btn ml-auto"
              onClick={() => {
                setIsEditMode(false);
                setModal(true);
                resetFormState();
              }}
            >
              Add Assignment
            </button>
          </div>
          {content}
        </div>
      </div>
      <ModalWrapper modal={modal} setModal={setModal}>
        <form onSubmit={isEditMode ? editTheAssignment : addNewAssignment}>
          <InputField
            label="Title"
            labelFor="title"
            type="text"
            placeholder="Enter Assignment Title"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          <InputField
            label="Mark"
            labelFor="mark"
            type="number"
            placeholder="Enter Assignment Mark"
            min={1}
            value={assignmentMark}
            onChange={(e) => setAssignmentMark(+e.target.value)}
          />
          <SelectBox
            label="Video Title"
            labelFor="video_title"
            value={selectedVideoIdAndTitle}
            onChange={(e) => setSelectedVideoIdAndTitle(e.target.value)}
          >
            <option className="w-[500px]" value="">
              {videosForAddAssignments.length === 0
                ? "Every video have assignment!"
                : "Select option"}
            </option>
            {videosForAddAssignments.map((option) => (
              <option
                key={option.id}
                value={JSON.stringify({ id: option.id, title: option.title })}
              >
                {option.title}
              </option>
            ))}
          </SelectBox>
          <Button
            disabled={
              isAddAssLoading ||
              videosForAddAssignments.length === 0 ||
              isEditAssLoading
            }
          >
            {isAddAssLoading || isEditAssLoading ? (
              <Spinner />
            ) : (
              <>{isEditMode ? "Edit Assignment" : "Add Assignment"}</>
            )}
          </Button>
        </form>
      </ModalWrapper>
    </section>
  );
};

export default Assignment;

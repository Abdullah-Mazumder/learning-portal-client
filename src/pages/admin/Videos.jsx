import Video from "../../components/admin/Video";
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";
import {
  useAddVideoMutation,
  useEditVideoMutation,
  useGetVideosQuery,
} from "../../features/videos/videosAPI";
import Button from "../../components/Button";
import ModalWrapper from "../../components/ModalWrapper";
import { useEffect, useState } from "react";
import successToast from "../../utils/successToast";
import Loader from "../../components/Loader";
import Spinner from "../../components/Spinner";
import useAddTitle from "../../hooks/useAddTitle";
import NotFound from "../../components/NotFound";
import Error from "../../components/Error";
import { warningToast } from "../../utils/warningToast";
import validateURL from "../../utils/urlValidator";
import validateViews from "../../utils/viewsValidator";
import validateDuration from "../../utils/durationValidator";
import validateDate from "../../utils/dateValidator";
import useShowError from "../../hooks/useShowError";

const Videos = () => {
  useAddTitle("Videos");
  const { data: videos, isLoading, isError } = useGetVideosQuery();
  const [modal, setModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [state, setState] = useState({
    title: "",
    description: "",
    url: "",
    views: "",
    duration: "",
    createdAt: "",
  });
  const { title, description, url, views, duration, createdAt } = state;

  const [
    addVideo,
    {
      isError: isAddVideoError,
      isLoading: isAddVideoLoading,
      isSuccess: isAddVideoSuccess,
    },
  ] = useAddVideoMutation();

  const [
    editVideo,
    {
      isLoading: isEditVideoLoading,
      isError: isEditVideoError,
      isSuccess: isEditVideoSuccess,
    },
  ] = useEditVideoMutation();

  const inputHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const videosDataValidator = () => {
    if (!validateURL(url)) {
      warningToast("Invalid URL!!");
      return;
    }

    if (!validateViews(views)) {
      warningToast("Invalid Views!!");
      return;
    }

    if (!validateDuration(duration)) {
      warningToast("Invalid Duration!!");
      return;
    }

    if (!validateDate(createdAt)) {
      warningToast("Invalid Date!!");
      return;
    }

    return true;
  };

  const addNewVideo = (e) => {
    e.preventDefault();
    if (!videosDataValidator()) return;

    addVideo(state);
  };

  const editAVideo = (e) => {
    e.preventDefault();
    if (!videosDataValidator()) return;

    const id = state.id;
    editVideo({
      id,
      data: { title, description, url, views, duration, createdAt },
    });
  };

  const resetState = () => {
    setState({
      title: "",
      description: "",
      url: "",
      views: "",
      duration: "",
      createdAt: "",
    });
  };

  useEffect(() => {
    if (isAddVideoSuccess) {
      successToast("Video added successfully!");
      setModal(false);
      resetState();
    }
  }, [isAddVideoSuccess]);

  useEffect(() => {
    if (isEditVideoSuccess) {
      successToast("Video edited successfully!");
      setModal(false);
      resetState();
    }
  }, [isEditVideoSuccess]);

  useShowError(isEditVideoError);
  useShowError(isError);
  useShowError(isAddVideoError);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <Loader />;
  }
  if (!isLoading && isError) {
    content = <Error />;
  }

  if (!isLoading && !isError && videos.length === 0) {
    content = <NotFound text="No Video Found!" />;
  }

  if (!isLoading && !isError && videos.length > 0) {
    content = (
      <>
        <div className="overflow-x-auto mt-4">
          <table className="divide-y-1 text-base divide-gray-600 w-full">
            <thead>
              <tr>
                <th className="table-th">Video Title</th>
                <th className="table-th">Description</th>
                <th className="table-th">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-600/50">
              {videos.map((video) => (
                <Video
                  setState={setState}
                  setModal={setModal}
                  video={video}
                  key={video.id}
                  setIsEditMode={setIsEditMode}
                />
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  return (
    <section className="py-6 bg-primary z-0">
      <div className="mx-auto max-w-full px-5 lg:px-20">
        <div className="px-3 py-20 bg-opacity-10 z-0">
          <div className="w-full flex">
            <button
              className="btn ml-auto"
              onClick={() => {
                setIsEditMode(false);
                resetState();
                setModal(true);
              }}
            >
              Add Video
            </button>
          </div>
          {content}
        </div>
      </div>
      <ModalWrapper modal={modal} setModal={setModal}>
        <form onSubmit={isEditMode ? editAVideo : addNewVideo}>
          <InputField
            label="Title"
            labelFor="title"
            type="text"
            placeholder="Enter Video Title"
            value={title}
            onChange={inputHandler}
          />
          <TextAreaField
            label="Description"
            labelFor="description"
            placeholder="Enter Video Description"
            value={description}
            onChange={inputHandler}
          />
          <InputField
            label="URL"
            labelFor="url"
            type="text"
            placeholder="Enter Video Url"
            value={url}
            onChange={inputHandler}
          />
          <InputField
            label="Views"
            labelFor="views"
            type="text"
            placeholder="Enter Video Views"
            value={views}
            onChange={inputHandler}
          />
          <InputField
            label="Duration"
            labelFor="duration"
            type="text"
            placeholder="Enter Video Duration (hh:mm:ss or mm:ss)"
            value={duration}
            onChange={inputHandler}
          />
          <InputField
            label="Created Date"
            labelFor="createdAt"
            type="text"
            placeholder="Enter Created Date (mm-dd-yyyy or mm/dd/yyyy)"
            value={createdAt}
            onChange={inputHandler}
          />
          <Button disabled={isAddVideoLoading || isEditVideoLoading}>
            {isAddVideoLoading || isEditVideoLoading ? (
              <Spinner />
            ) : (
              <>{isEditMode ? "Edit Video" : "Add Video"}</>
            )}
          </Button>
        </form>
      </ModalWrapper>
    </section>
  );
};

export default Videos;

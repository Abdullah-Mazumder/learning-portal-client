import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetVideosQuery } from "../../features/videos/videosAPI";
import VideoItem from "../../components/student/VideoItem";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { setCurrentVideo } from "../../features/customization/customizationSlice";
import errorToast from "../../utils/errorToast";
import useAddTitle from "../../hooks/useAddTitle";
import NotFound from "../../components/NotFound";
import Error from "../../components/Error";

const CoursePlayer = () => {
  useAddTitle("LWS - Learning Portal");
  const navigate = useNavigate();
  const { currentVideo } = useSelector((state) => state.customization);
  const { data: videos, isLoading, isError } = useGetVideosQuery();

  useEffect(() => {
    if (videos?.length > 0) {
      navigate(`videos/${currentVideo || videos[0].id}`);
    }
  }, [videos, currentVideo, navigate]);

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

  if (!isLoading && !isError && videos.length === 0) {
    content = <NotFound text="No video found!" />;
  }

  if (!isLoading && !isError && videos.length > 0) {
    content = (
      <div className="grid grid-cols-3 gap-2 lg:gap-8">
        <div className="col-span-full w-full space-y-8 lg:col-span-2">
          <Outlet />
        </div>
        <div className="col-span-full lg:col-auto max-h-[570px] overflow-y-auto bg-secondary p-4 rounded-md border border-slate-50/10 divide-y divide-slate-600/30">
          {videos.map((video) => (
            <VideoItem
              key={video.id}
              video={video}
              setCurrentVideo={setCurrentVideo}
              currentVideo={currentVideo}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <>
      <section className="py-6 bg-primary">
        <div className="mx-auto max-w-7xl px-5 lg:px-0">{content}</div>
      </section>
    </>
  );
};

export default CoursePlayer;

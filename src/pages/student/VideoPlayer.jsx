/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setCurrentVideo } from "../../features/customization/customizationSlice";
import { useGetVideoQuery } from "../../features/videos/videosAPI";
import Loader from "../../components/Loader";
import { useGetAssignmentWithVideoIdQuery } from "../../features/assignments/assignmentsAPI";
import { useGetQuizWithVideoIdQuery } from "../../features/quiz/quizAPI";
import {
  useGetSingleAssMarkWithStudentIdAndAssIdQuery,
  useSubmitAssignmentMutation,
} from "../../features/assignmentsMark/assignmentsMarkAPI";
import { useSelector } from "react-redux";
import ModalWrapper from "../../components/ModalWrapper";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import successToast from "../../utils/successToast";
import { useGetQuizMarkWithStudentIdAndVideoIdQuery } from "../../features/quizMark/quizMarkAPI";
import useShowError from "../../hooks/useShowError";
import Error from "../../components/Error";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [isAssSubmitted, setIsAssSubmitted] = useState(null);
  const [repo_link, setRepo_link] = useState("");
  const [assMarkModal, setAssMarkModal] = useState(false);
  const [quizMarkModal, setQuizMarkModal] = useState(false);

  const { id: userId, name } = useSelector((state) => state.auth?.user) || {};

  // for getting a video with video id
  const { data: video, isLoading, isError } = useGetVideoQuery(videoId);
  const { title, description, url, createdAt } = video || {};

  // for tracking if video related assignment is fetched or not
  const [isGotAssignment, setIsGotAssignment] = useState(false);

  // for getting the assignment, related to the video with video id
  const { data: assignment } = useGetAssignmentWithVideoIdQuery(videoId);

  // for getting all quizzes, related to the video with video id
  const { data: quiz } = useGetQuizWithVideoIdQuery(videoId);

  // for getting the user submitted assignment and fetching if the assignment of this video is fetched
  const { data: singleAssMark } = useGetSingleAssMarkWithStudentIdAndAssIdQuery(
    {
      studentId: userId,
      assignmentId: assignment && assignment[0]?.id,
    },
    { skip: !isGotAssignment }
  );

  // for fetching the user submitted quizzes with student id and video id
  const { data: quizMarkOfThisVideo } =
    useGetQuizMarkWithStudentIdAndVideoIdQuery({ studentId: userId, videoId });

  const [
    submitAssignment,
    {
      isLoading: isSubAssLoading,
      isError: isSubAssError,
      isSuccess: isSubAssSuccess,
    },
  ] = useSubmitAssignmentMutation();

  const submitYourAssignment = (e) => {
    e.preventDefault();
    const data = {
      student_id: userId,
      student_name: name,
      assignment_id: assignment[0].id,
      title: assignment[0].title,
      createdAt: Date.now(),
      totalMark: assignment[0].totalMark,
      mark: 0,
      repo_link,
      status: "pending",
    };

    submitAssignment(data);
  };

  useEffect(() => {
    if (isSubAssSuccess) {
      setAssignmentModal(false);
      setRepo_link("");
      successToast("Assignment submitted successfully!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubAssSuccess]);

  // when the assignment is fetched then ready to fetch assignment mark with this assignment id
  useEffect(() => {
    if (assignment?.length > 0) {
      setIsGotAssignment(true);
    }
  }, [assignment]);

  // for tracking if the user already submitted assignment or not
  useEffect(() => {
    if (singleAssMark?.length > 0) {
      setIsAssSubmitted(singleAssMark[0]);
    } else {
      setIsAssSubmitted(null);
    }
  }, [singleAssMark]);

  // for tracking current video
  useEffect(() => {
    if (videoId) {
      dispatch(setCurrentVideo(videoId));
    }
  }, [dispatch, videoId]);

  // showing error toast
  useShowError(isError);
  useShowError(isSubAssError);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <Loader />;
  }

  if (!isLoading && isError) {
    content = <Error text="Something Went Wrong or Video Not Found!" />;
  }

  if (!isLoading && !isError && video?.id) {
    content = (
      <>
        <iframe
          width="100%"
          className="aspect-video"
          src={url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-100">
            {title}
          </h1>
          <h2 className=" pb-4 text-sm leading-[1.7142857] text-slate-400">
            Uploaded on {new Date(createdAt).toDateString()}
          </h2>

          <div className="flex gap-4">
            {singleAssMark?.length > 0 && (
              <div
                className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm  text-primary text-primary cursor-pointer hover:bg-cyan hover:text-primary"
                onClick={() => setAssignmentModal(true)}
              >
                এসাইনমেন্ট যা জমা দিয়েছেন
              </div>
            )}

            {singleAssMark?.length > 0 &&
              singleAssMark[0].status === "published" && (
                <div
                  className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm  text-primary text-primary cursor-pointer hover:bg-cyan hover:text-primary"
                  onClick={() => setAssMarkModal(true)}
                >
                  এসাইনমেন্ট মার্ক
                </div>
              )}

            {assignment?.length > 0 && singleAssMark?.length === 0 && (
              <div
                className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary cursor-pointer"
                onClick={() => setAssignmentModal(true)}
              >
                এসাইনমেন্ট
              </div>
            )}

            {assignment?.length === 0 && (
              <div className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm  text-primary text-primary cursor-not-allowed">
                এসাইনমেন্ট নেই
              </div>
            )}

            {/* if quizMarkOfThisVideo is empty that means user did not participate of this video related quizzes */}
            {quiz?.length > 0 && quizMarkOfThisVideo?.length === 0 && (
              <Link
                to={`/quizes/${videoId}`}
                className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary"
              >
                কুইজে অংশগ্রহণ করুন
              </Link>
            )}

            {/* if quizMarkOfThisVideo is not empty that means user already have participated of this video related quizzes */}
            {quiz?.length > 0 && quizMarkOfThisVideo?.length > 0 && (
              <div
                className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm hover:bg-cyan hover:text-primary cursor-pointer"
                onClick={() => setQuizMarkModal(true)}
              >
                কুইজ মার্ক
              </div>
            )}

            {quiz?.length === 0 && (
              <div className="px-3 font-bold py-1 border border-cyan text-cyan rounded-full text-sm  text-primary text-primary cursor-not-allowed">
                কুইজ নেই
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-slate-400 leading-6">
            {description || "This video have no description!!"}
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      {content}
      <ModalWrapper modal={assignmentModal} setModal={setAssignmentModal}>
        <h1 className="font-semibold text-lg mb-3">এসাইনমেন্ট</h1>
        <form onSubmit={submitYourAssignment}>
          <InputField
            label="Repository Link"
            labelFor="repo_link"
            placeholder="Give Assignment Repository Link"
            type="text"
            readOnly={isAssSubmitted}
            value={isAssSubmitted ? isAssSubmitted?.repo_link : repo_link}
            onChange={(e) => setRepo_link(e.target.value)}
          />
          {!isAssSubmitted && (
            <Button disabled={isSubAssLoading}>
              {isSubAssLoading ? <Spinner /> : "Submit"}
            </Button>
          )}
        </form>
      </ModalWrapper>

      {/* for showing assignment mark */}
      <ModalWrapper modal={assMarkModal} setModal={setAssMarkModal}>
        <h1 className="font-semibold text-lg mb-3 mr-12">এসাইনমেন্ট মার্ক</h1>
        <h1 className="font-semibold text-md mb-3">
          টোটাল মার্ক - {isAssSubmitted?.totalMark}
        </h1>
        <h1 className="font-semibold text-md mb-3">
          আপনি পেয়েছেন - {isAssSubmitted?.mark} (
          {Math.round((isAssSubmitted?.mark / isAssSubmitted?.totalMark) * 100)}
          %)
        </h1>
      </ModalWrapper>

      {/* for showing quiz mark */}
      {quizMarkOfThisVideo && (
        <ModalWrapper modal={quizMarkModal} setModal={setQuizMarkModal}>
          <h1 className="font-semibold text-lg mb-3 mr-12">কুইজ মার্ক</h1>
          <h1 className="font-semibold text-md mb-3">
            টোটাল মার্ক - {quizMarkOfThisVideo[0]?.totalMark}
          </h1>
          <h1 className="font-semibold text-md mb-3">
            আপনি পেয়েছেন - {quizMarkOfThisVideo[0]?.mark}
          </h1>
        </ModalWrapper>
      )}
    </>
  );
};

export default VideoPlayer;

/* eslint-disable react-hooks/exhaustive-deps */
import {
  useAddQuizMutation,
  useEditQuizMutation,
  useGetQuizzesQuery,
} from "../../features/quiz/quizAPI";
import Loader from "../../components/Loader";
import SingleQuiz from "../../components/admin/SingleQuiz";
import { useEffect, useState } from "react";
import ModalWrapper from "../../components/ModalWrapper";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import SelectBox from "../../components/SelectBox";
import Spinner from "../../components/Spinner";
import { useGetVideosQuery } from "../../features/videos/videosAPI";
import successToast from "../../utils/successToast";
import useAddTitle from "../../hooks/useAddTitle";
import Error from "../../components/Error";
import NotFound from "../../components/NotFound";
import { warningToast } from "../../utils/warningToast";
import useShowError from "../../hooks/useShowError";

const Quizes = () => {
  useAddTitle("Quizes");
  const { data: quizzes, isLoading, isError } = useGetQuizzesQuery();
  const [addOrEditQuizModal, setAddOrEditQuizModal] = useState(false);
  const [quizOptions, setQuizOptions] = useState([
    { id: 1, option: "", isCorrect: false },
  ]);
  const [question, setQuestion] = useState("");
  const [videoIdAndTitle, setVideoIdAndTitle] = useState("");
  const [isQuizEditMode, setIsQuizEditMode] = useState(false);
  const [editQuizId, setEditQuizId] = useState(null);

  const { data: videos, isError: isGetVideosError } = useGetVideosQuery(
    undefined,
    { skip: !addOrEditQuizModal }
  );

  const [
    editQuiz,
    {
      isLoading: isEditQuizLoading,
      isError: isEditQuizError,
      isSuccess: isEditQuizSuccess,
    },
  ] = useEditQuizMutation();

  const [
    addQuiz,
    {
      isLoading: isAddQuizLoading,
      isError: isAddQuizError,
      isSuccess: isAddQuizSuccess,
    },
  ] = useAddQuizMutation();

  // for adding quiz options
  const addOption = () => {
    setQuizOptions((prevState) => [
      ...prevState,
      { id: quizOptions.length + 1, option: "", isCorrect: false },
    ]);
  };

  const inputHandler = (index, e) => {
    const state = JSON.parse(JSON.stringify(quizOptions));
    if (e.target.type === "checkbox") {
      state[index].isCorrect = e.target.checked;
    } else state[index].option = e.target.value;
    setQuizOptions(state);
  };

  const resetFormState = () => {
    setQuestion("");
    setVideoIdAndTitle("");
    const state = JSON.parse(JSON.stringify(quizOptions));
    state.forEach((item) => {
      item.option = "";
      item.isCorrect = false;
    });
    setQuizOptions(state);
  };

  // validate quiz data when adding or editing quiz
  const validateQuizData = () => {
    if (quizOptions.length !== 4) {
      warningToast("You have to provide 4 options!!");
      return;
    }
    let isValidOptions = false;
    quizOptions.forEach((quizValue) => {
      if (quizValue.isCorrect) {
        isValidOptions = true;
      }
    });
    if (!isValidOptions) {
      warningToast("Provide an option which is correct!!");
      return;
    }

    return true;
  };

  const addNewQuiz = (e) => {
    e.preventDefault();
    if (!validateQuizData()) return;

    const video_id = JSON.parse(videoIdAndTitle).id;
    const video_title = JSON.parse(videoIdAndTitle).title;

    addQuiz({
      question,
      video_id,
      video_title,
      options: quizOptions,
    });
  };

  const editTheQuiz = (e) => {
    e.preventDefault();
    if (!validateQuizData()) return;

    const video_id = JSON.parse(videoIdAndTitle).id;
    const video_title = JSON.parse(videoIdAndTitle).title;

    editQuiz({
      id: editQuizId,
      data: {
        question,
        video_id,
        video_title,
        options: quizOptions,
      },
    });
  };

  useEffect(() => {
    if (isAddQuizSuccess) {
      successToast("Quiz added successfully!!");
      resetFormState();
      setAddOrEditQuizModal(false);
    }
  }, [isAddQuizSuccess]);

  useEffect(() => {
    if (isEditQuizSuccess) {
      successToast("Quiz edited successfully!!");
      resetFormState();
      setAddOrEditQuizModal(false);
    }
  }, [isEditQuizSuccess]);

  // this is for all error case
  useShowError(isGetVideosError);
  useShowError(isError);
  useShowError(isAddQuizError);
  useShowError(isEditQuizError);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <Loader />;
  }

  if (!isLoading && isError) {
    content = <Error />;
  }

  if (!isLoading && !isError && quizzes.length === 0) {
    content = <NotFound text="No Quiz Found!" />;
  }

  if (!isLoading && !isError && quizzes.length > 0) {
    content = (
      <div className="overflow-x-auto mt-4">
        <table className="divide-y-1 text-base divide-gray-600 w-full">
          <thead>
            <tr>
              <th className="table-th">Question</th>
              <th className="table-th">Video</th>
              <th className="table-th justify-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-600/50">
            {quizzes.map((quiz) => (
              <SingleQuiz
                key={quiz.id}
                quiz={quiz}
                setIsQuizEditMode={setIsQuizEditMode}
                setAddOrEditQuizModal={setAddOrEditQuizModal}
                setEditQuizId={setEditQuizId}
                setQuestion={setQuestion}
                setVideoIdAndTitle={setVideoIdAndTitle}
                setQuizOptions={setQuizOptions}
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
                setIsQuizEditMode(false);
                resetFormState();
                setAddOrEditQuizModal(true);
              }}
            >
              Add Quiz
            </button>
          </div>
          {content}
        </div>
      </div>
      <ModalWrapper modal={addOrEditQuizModal} setModal={setAddOrEditQuizModal}>
        <h1 className="font-semibold text-2xl mb-3 mr-12">Add Quiz</h1>
        <form onSubmit={isQuizEditMode ? editTheQuiz : addNewQuiz}>
          <InputField
            label="Question"
            labelFor="question"
            placeholder="Enter Question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <SelectBox
            label="Video"
            labelFor="video"
            value={videoIdAndTitle}
            onChange={(e) => {
              setVideoIdAndTitle(e.target.value);
            }}
          >
            <option value="">Choose a video</option>
            {videos?.map((video) => (
              <option
                key={video.id}
                value={JSON.stringify({ id: video.id, title: video.title })}
              >
                {video.title.length > 40
                  ? video.title.substring(0, 40) + "..."
                  : video.title}
              </option>
            ))}
          </SelectBox>

          {quizOptions?.map((quizValue, index) => (
            <div key={quizValue.id} className="flex gap-2">
              <InputField
                label={`Option ${quizValue.id}`}
                labelFor={`option-${quizValue.id}`}
                placeholder={`Option ${quizValue.id}`}
                type="text"
                value={quizValue.option}
                onChange={(e) => inputHandler(index, e)}
              />
              <div className="flex flex-col">
                <label
                  className="leading-7 text-gray-200 mb-1"
                  htmlFor={`option-${quizValue.id}-co`}
                >
                  Correct or Not!
                </label>
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  checked={quizValue.isCorrect}
                  id={`option-${quizValue.id}-co`}
                  onChange={(e) => inputHandler(index, e)}
                />
              </div>
            </div>
          ))}
          {quizOptions?.length < 4 && (
            <Button onClick={addOption} type="button">
              Add Option
            </Button>
          )}
          <div className="my-3"></div>
          <Button disabled={isAddQuizLoading || isEditQuizLoading}>
            {isAddQuizLoading || isEditQuizLoading ? (
              <Spinner />
            ) : isQuizEditMode ? (
              "Edit Quiz"
            ) : (
              "Add Quiz"
            )}
          </Button>
        </form>
      </ModalWrapper>
    </section>
  );
};

export default Quizes;

/* eslint-disable eqeqeq */
import { useNavigate, useParams } from "react-router-dom";
import { useGetQuizWithVideoIdQuery } from "../../features/quiz/quizAPI";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
import { warningToast } from "../../utils/warningToast";
import { useSelector } from "react-redux";
import {
  useGetQuizMarkWithStudentIdAndVideoIdQuery,
  useSubmitQuizMarkMutation,
} from "../../features/quizMark/quizMarkAPI";
import errorToast from "../../utils/errorToast";
import shortid from "shortid";
import Spinner from "../../components/Spinner";
import successToast from "../../utils/successToast";

const Quiz = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { id: userId, name } = useSelector((state) => state.auth?.user) || {};
  const {
    data: quizzes,
    isLoading,
    isError,
  } = useGetQuizWithVideoIdQuery(videoId);

  const { data: quizMarkOfThisVideo, isError: isGetQuizMarkError } =
    useGetQuizMarkWithStudentIdAndVideoIdQuery({ studentId: userId, videoId });

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [
    submitQuiz,
    {
      isLoading: isSubmitQuizLoading,
      isError: isSubmitQuizError,
      isSuccess: isSubmitQuizSuccess,
    },
  ] = useSubmitQuizMarkMutation();

  const handleOptionSelect = (quizId, optionId, isSelected) => {
    setSelectedAnswers((prevAnswers) => {
      const selectedOptions = prevAnswers[quizId] || [];
      if (isSelected) {
        return { ...prevAnswers, [quizId]: [...selectedOptions, optionId] };
      }
      return {
        ...prevAnswers,
        [quizId]: selectedOptions.filter((id) => id !== optionId),
      };
    });
  };

  const submitQuizHandler = () => {
    let totalCorrect = 0;

    // quiz answer validation
    Object.keys(selectedAnswers).forEach((quizId) => {
      const quiz = quizzes.find((q) => q.id == quizId);
      const rightAnswerOptions = quiz.options;
      const selectedAnswerOptions = selectedAnswers[quizId];

      // this means how many oftions are right of this quiz
      const totalRightAnswerOptions = rightAnswerOptions.filter(
        (option) => option.isCorrect
      ).length;

      // this means how many oftions are selected by the user of this quiz
      const totalSelectedAnswerOptions = selectedAnswerOptions.length;

      let isRightAnswer = false;

      rightAnswerOptions.forEach((option) => {
        if (option.isCorrect) {
          if (selectedAnswerOptions) {
            isRightAnswer = selectedAnswerOptions.includes(option.id);
          } else {
            isRightAnswer = false;
            return;
          }
        }
      });

      if (
        totalRightAnswerOptions == totalSelectedAnswerOptions &&
        isRightAnswer
      ) {
        isRightAnswer = true;
      } else {
        isRightAnswer = false;
      }

      if (isRightAnswer) totalCorrect++;
    });

    const totalWrong = quizzes.length - totalCorrect;

    submitQuiz({
      student_id: userId,
      student_name: name,
      video_id: quizzes[0].video_id,
      video_title: quizzes[0].video_title,
      totalQuiz: quizzes.length,
      totalCorrect,
      totalWrong,
      totalMark: quizzes.length * 5,
      mark: totalCorrect * 5,
    });
  };

  useEffect(() => {
    if (quizzes?.length === 0) {
      warningToast("No Quizzes Found!");
      navigate("/leaderboard");
    }
  }, [quizzes, navigate]);

  useEffect(() => {
    if (quizMarkOfThisVideo?.length > 0) {
      if (isSubmitQuizSuccess) {
        successToast("Quiz submitted successfully!!");
      } else {
        warningToast("You have already submitted these quizzes!");
      }
      navigate("/leaderboard");
    }
  }, [quizMarkOfThisVideo, isSubmitQuizSuccess, navigate]);

  useEffect(() => {
    if (isGetQuizMarkError || isSubmitQuizError) {
      errorToast();
    }
  }, [isGetQuizMarkError, isSubmitQuizError]);

  // decide what to render
  let content = null;
  if (isLoading) {
    content = <Loader />;
  }

  if (!isLoading && isError) {
    content = "Something went wrong!!";
  }

  if (!isError && !isLoading && quizzes?.length > 0) {
    content = (
      <div className="mx-auto max-w-7xl px-5 lg:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{quizzes[0].video_title}</h1>
          <p className="text-sm text-slate-200">
            Each question contains 5 Mark
          </p>
        </div>
        <div className="space-y-8">
          {quizzes.map((quiz) => (
            <div key={shortid.generate()} className="quiz">
              <h4 className="question">{quiz.question}</h4>
              <form className="quizOptions">
                {quiz.options.map((option) => {
                  const uniqueID = shortid.generate();
                  const isSelected =
                    selectedAnswers[quiz.id]?.includes(option.id) || false;
                  return (
                    <label
                      key={shortid.generate()}
                      htmlFor={`option${option.id}_${uniqueID}`}
                    >
                      <input
                        type="checkbox"
                        id={`option${option.id}_${uniqueID}`}
                        checked={isSelected}
                        onChange={(e) =>
                          handleOptionSelect(
                            quiz.id,
                            option.id,
                            e.target.checked
                          )
                        }
                      />
                      {option.option}
                    </label>
                  );
                })}
              </form>
            </div>
          ))}
        </div>

        <button
          disabled={isGetQuizMarkError || isSubmitQuizLoading}
          className="px-4 py-2 rounded-full bg-cyan block ml-auto mt-8 hover:opacity-90 active:opacity-100 active:scale-95"
          onClick={submitQuizHandler}
        >
          {isSubmitQuizLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    );
  }
  return <section className="py-6 bg-primary">{content}</section>;
};

export default Quiz;

"use client";
import React, { use, useState } from "react";
import QuizCard from "./quizCard";
import { div } from "framer-motion/client";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};

const handleCheck = () => {};

export default function QuizPageSection({ Quizes }: any) {
  const len = Quizes.length;
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [ansCorrect, setAnsCorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [retried, setRetried] = useState(false);

  var quizer: quizeType = Quizes[questionNumber];

  const setDefault = () => {
    setSelectedAnswer(-1);
    setAnswerChecked(false);
    setAnsCorrect(false);
    setUsedHint(false);
    setRetried(false);
  };
  const handleScore = () => {
    setAnswerChecked(true);
    if (ansCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionNumber < len) {
      setQuestionNumber(questionNumber + 1);
      setDefault();
    }
  };

  return (
    <div className="py-16">
      <div className="container flex justify-between ">
        <h2 className=" px-4 py-1 bg-blue-400 text-4xl w-fit  rounded font-bold text-gray-900 mb-16 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Level 1: The first Step
        </h2>
        <p>
          Question : {questionNumber + 1}/{len}
        </p>
        {score}
      </div>
      {
        <QuizCard
          Question={quizer.question}
          CorrectAns={quizer.test_answer}
          Answers={quizer.answers}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          checked={answerChecked}
          setAnsCorrect={setAnsCorrect}
        />
      }

      <div className="container ">
        <div className="mt-10">
          {answerChecked ? (
            <div>
              <button
                onClick={() => {
                  setSelectedAnswer(-1);
                  setAnswerChecked(false);
                  setRetried(true);
                }}
                disabled={usedHint}
              >
                Retry
              </button>
              <button
                onClick={() => {
                  setSelectedAnswer(quizer.test_answer);
                  setUsedHint(true);
                }}
              >
                Display Answer
              </button>
              <button onClick={() => handleNextQuestion()}>
                Next Question
              </button>
            </div>
          ) : (
            <button onClick={() => handleScore()}>Check Answer</button>
          )}
        </div>
      </div>
    </div>
  );
}

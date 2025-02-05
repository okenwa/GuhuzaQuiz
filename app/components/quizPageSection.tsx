"use client";
import React, { useState } from "react";
import QuizCard from "./quizCard";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};

const handleCheck = () => {};

export default function QuizPageSection({ Quizes }: any) {
  const [questionNumber, setQuestionNumber] = useState(0);
  var quizer: quizeType = Quizes[questionNumber];
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [ansCorrect, setAnsCorrect] = useState(false);

  return (
    <div className="py-16">
      <div className="container flex justify-between ">
        <h2 className=" px-4 py-1 bg-blue-400 text-4xl w-fit  rounded font-bold text-gray-900 mb-16 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Level 1: The first Step
        </h2>
        <p>Question : {questionNumber + 1}/10</p>
      </div>
      {
        <QuizCard
          Question={quizer.question}
          CorrectAns={quizer.test_answer}
          Answers={quizer.answers}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          checked={answerChecked}
          setCorrect={setAnsCorrect}
        />
      }

      <div className="container ">
        <div className="mt-10">
          <button onClick={() => setAnswerChecked(!answerChecked)}>
            Check Answer
          </button>
        </div>
      </div>
    </div>
  );
}

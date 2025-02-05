"use client";
import { animateSequence } from "framer-motion/dom/mini";
import { useState } from "react";

type quizCardType = {
  Question: string;
  CorrectAns: number;
  Answers: string[];
  selectedAnswer: number;
  setSelectedAnswer: any;
  checked: boolean;
  setAnsCorrect: any;
};

export default function QuizCard({
  Question,
  Answers,
  CorrectAns,
  selectedAnswer,
  setSelectedAnswer,
  checked,
  setAnsCorrect,
}: quizCardType) {
  const handleOptionSelected = (key: number) => {
    setSelectedAnswer(key);
    console.log(key);
  };

  const setButtonStyle = (key: number): string => {
    if (key == selectedAnswer) {
      if (checked) {
        if (selectedAnswer == CorrectAns) {
          setAnsCorrect(true);
          return "bg-green-500"; //correct answer
        }
        return "bg-red-500"; //incorrect selection
      }

      return "bg-blue-500"; //just the selection
    }
    return "";
  };
  return (
    <div className="container mx-auto bg-white  rounded-2xl   transition-transform transform ">
      <h3 className="text-3xl font-semibold text-gray-800  ">{Question}</h3>
      <div className="grid gap-8 pt-9">
        {Answers.map((answer: string, key: number) => (
          <div className="w-full group relative">
            <button
              className={setButtonStyle(key)}
              onClick={() => handleOptionSelected(key)}
              disabled={checked}
            >
              {answer}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

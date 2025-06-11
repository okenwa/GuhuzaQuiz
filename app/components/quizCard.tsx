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
  level: {
    Level_Title: string;
    Level_number: number;
  };
};

export default function QuizCard({
  Question,
  Answers,
  CorrectAns,
  selectedAnswer,
  setSelectedAnswer,
  checked,
  setAnsCorrect,
  level,
}: quizCardType) {
  const handleOptionSelected = (key: number) => {
    setSelectedAnswer(key);
  };

  const setButtonStyle = (key: number): string => {
    if (key == selectedAnswer) {
      if (checked) {
        if (selectedAnswer == CorrectAns) {
          setAnsCorrect(true);
          return "cQuizButton after:content-['✅'] after:absolute md:after:right-10"; //correct answer
        }
        return "FquizButton after:content-['❌'] after:absolute md:after:right-10"; //incorrect selection
      }
      return "selectedQBtn "; //just the selection
    }
    return "";
  };

  return (
    <div className="m-0 p-0" role="region" aria-label="Quiz Question">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 motion-preset-slide-up motion-delay-100">
          {Question}
        </h2>
      </div>
      <div 
        className="grid gap-8 pt-9 w-full"
        role="radiogroup"
        aria-label="Answer Options"
      >
        {Answers.map((answer: string, key: number) => (
          <div key={key} className="w-full group relative">
            <button
              className={
                setButtonStyle(key) +
                `quizButton px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-gray-900 text-lg w-full text-left motion-preset-slide-up motion-delay-${(key + 1) * 100}`
              }
              onClick={() => handleOptionSelected(key)}
              disabled={checked}
              role="radio"
              aria-checked={selectedAnswer === key}
              aria-label={`Option ${key + 1}: ${answer}`}
              tabIndex={0}
            >
              {answer}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

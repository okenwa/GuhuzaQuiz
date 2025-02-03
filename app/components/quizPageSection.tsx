import React from "react";
import QuizCard from "./quizCard";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;

  answers: string[];
};

export default function QuizPageSection({ Quizes }: any) {
  var quizer: quizeType = Quizes[0];

  return (
    <div>
      {
        <QuizCard
          Question={quizer.question}
          CorrectAns={quizer.test_answer}
          Answers={quizer.answers}
        />
      }
    </div>
  );
}

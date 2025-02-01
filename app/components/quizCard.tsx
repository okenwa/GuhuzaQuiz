import Qbtn from "./buttons/quizbtn";

type quizCardType = {
  Question: string;
  CorrectAns: number;
  Answers: string[];
};

export default function QuizCard({
  Question,
  Answers,
  CorrectAns,
}: quizCardType) {
  return (
    <div className="container mx-auto bg-white shadow-xl rounded-2xl p-6 py-20 border border-gray-200 transition-transform transform ">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {Question}
      </h3>
      <div className="grid gap-8">
        {Answers.map((answer: string, key: number) => (
          <Qbtn
            key={key}
            option={answer}
            correctAnswer={CorrectAns}
            index={key}
          />
        ))}
      </div>
    </div>
  );
}

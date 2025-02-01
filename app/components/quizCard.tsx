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
    <div>
      <h3>{Question}</h3>
      <div>
        {Answers.map((answer: string, key: number) => (
          <Qbtn option={answer} correctAnswer={CorrectAns} index={key} />
        ))}
      </div>
    </div>
  );
}

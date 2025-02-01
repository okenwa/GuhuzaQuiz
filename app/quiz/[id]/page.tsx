import Qbtn from "@/app/components/buttons/quizbtn";
import { fetchQuiz } from "@/lib/api";
import QuizCard from "@/app/components/quizCard";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;

  answers: string[];
};
type quizesType = {
  question: quizeType[];
};

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const data = await fetchQuiz(params.id);
    const Quizes = data.test.question;
    return (
      <div>
        {Quizes.map((quiz: quizeType, index: number) => (
          <QuizCard
            key={index}
            Question={quiz.question}
            CorrectAns={quiz.test_answer}
            Answers={quiz.answers}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.log(error);
    return <p>Error Loading Quiz</p>;
  }
}

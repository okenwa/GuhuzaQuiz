import Qbtn from "@/app/components/buttons/quizbtn";
import { fetchQuiz } from "@/lib/api";
import QuizCard from "@/app/components/quizCard";

type QuizType = {};

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const data = await fetchQuiz(params.id);
    const Quizes = data.test.question;
    return (
      <h1>
        {Quizes.map((quiz: any) => (
          <QuizCard
            Question={quiz.question}
            CorrectAns={quiz.test_answer}
            Answers={quiz.answers}
          />
        ))}
      </h1>
    );
  } catch (error) {
    console.log(error);
  }
}

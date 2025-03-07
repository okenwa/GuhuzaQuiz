import Qbtn from "@/app/components/buttons/quizbtn";

import { fetchQuiz } from "@/utils/fQuiz";
import QuizCard from "@/app/components/quizCard";
import QuizPageSection from "@/app/components/quizPageSection";
import fetchLevels from "@/utils/fLevels";
import fetchPlayers from "@/utils/fPlayers";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";


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

    const levels = (await fetchLevels()|| [])
    const levelNumber = params.id

    const levelTitle = levels?.[Number(levelNumber)-1].Level_Title
    const players = (await fetchPlayers() || {})

    const session = await auth()

    const user = session?.user;
    const name = user?.firstName == null ? "Anonymous" :user?.name 

    const player = await fetchUser(
      Number(user?.memberId),
      name,
      user?.email
    );

    return (
      <div>
        
        <QuizPageSection Quizes={Quizes} levelNumber = {levelNumber}  levelTitle = {levelTitle}  player={player} />
      </div>
    );
  } catch (error) {
    console.log(error);
    return <p>Error Loading Quiz</p>;
  }
}

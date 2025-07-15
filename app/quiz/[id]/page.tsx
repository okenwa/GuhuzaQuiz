import Qbtn from "@/app/components/buttons/quizbtn";

import { fetchQuiz } from "@/utils/fQuiz";
import QuizCard from "@/app/components/quizCard";
import QuizPageSection from "@/app/components/quizPageSection";
import fetchLevels from "@/utils/fLevels";
import fetchPlayers from "@/utils/fPlayers";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import { getCookie, setCookie } from "cookies-next";
import { getOrCreateQuizSession } from "@/utils/quizSessionUtils";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;

  answers: string[];
};
type quizesType = {
  question: quizeType[];
};

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: { id: string };
  searchParams: { sessionId?: string };
}) {
    const data = await fetchQuiz(params.id);
    const Quizes = data.test.question;

    const levels = (await fetchLevels()|| [])
    const levelNumber = params.id
    const levelTitle = levels?.[Number(levelNumber)-1].Level_Title

    const session = await auth()

    const user = session && session?.user;
    const name = session
      ? user?.nickname
        ? user.nickname
        : user?.firstName
          ? user.firstName
          : "Anonymous"
      : "";
    
    const memberId = session?.user?.memberId;
    const player = session && memberId ? await fetchUser(
      Number(memberId),
      name,
      user?.email || ""
    ) : {}

    // Get or create quiz session for authenticated users
    let quizSession = null;
    if (session?.user?.memberId) {
      try {
        const memberId = session.user.memberId;
        quizSession = await getOrCreateQuizSession(
          Number(memberId),
          Number(levelNumber),
          Quizes.length
        );
      } catch (error) {
        console.error('Error getting quiz session:', error);
      }
    }

    return (
      <div>
        <QuizPageSection 
          Quizes={Quizes} 
          levelNumber={levelNumber}  
          levelTitle={levelTitle}  
          player={player}
          quizSession={quizSession}
          sessionId={searchParams.sessionId}
        />
      </div>
    );
}

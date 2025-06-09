"use client";
import React, { use, useState, useEffect, useRef } from "react";
import QuizCard from "./quizCard";
import { div } from "framer-motion/client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import LeaderBoard from "./leaderBoard";
import { useContext } from "react";
import { playerContext } from "../context/playerContext";
import { setCookie } from "cookies-next";
import ShareButton from "./buttons/sharebtn";
import { useBadges } from "../context/badgeContext";
import BadgeSystem from "./badges/BadgeSystem";

type quizeType = {
  question: string;
  comment: string;
  test_answer: number;
  answers: string[];
};

export default function QuizPageSection({ Quizes, levelNumber, levelTitle, player }: any) {


  const len = Quizes.length;
  const router = useRouter()
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [ansCorrect, setAnsCorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [retried, setRetried] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const timeUpSoundRef = useRef<HTMLAudioElement | null>(null);
  var quizer: quizeType = Quizes[questionNumber];
  const [currentStreak, setCurrentStreak] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const { userBadges, checkAndAwardBadges, activePowerUps, activatePowerUp, usePowerUp } = useBadges();
  const [showBadgeNotification, setShowBadgeNotification] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [allQuestionsUnder5Seconds, setAllQuestionsUnder5Seconds] = useState(true);

  // Initialize audio elements
  useEffect(() => {
    tickSoundRef.current = new Audio('/sounds/tick.mp3');
    timeUpSoundRef.current = new Audio('/sounds/timeup.mp3');
  }, []);

  // Timer effect
  useEffect(() => {
    if (!answerChecked && timeLeft > 0 && timerStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          setAnswerTime(15 - prev); // Track time taken to answer
          if (prev > 1) {
            tickSoundRef.current?.play().catch(err => console.log('Error playing tick sound:', err));
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !answerChecked && timerStarted) {
      timeUpSoundRef.current?.play().catch(err => console.log('Error playing time up sound:', err));
      setAnswerChecked(true);
      setAnsCorrect(false);
    }
  }, [timeLeft, answerChecked, timerStarted]);

  // Check for power-ups
  useEffect(() => {
    const timeFreeze = activePowerUps.find(p => p.name === 'Time Freeze' && p.active);
    if (timeFreeze) {
      // Implement time freeze logic here
      usePowerUp('Time Freeze');
    }
  }, [activePowerUps]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(15);
  }, [questionNumber]);

  const setDefault = () => {
    setSelectedAnswer(-1);
    setAnswerChecked(false);
    setAnsCorrect(false);
    setUsedHint(false);
    setRetried(false);
    setRetryCount(0);
  };

  const handleNextLevel = async () => {
    if( !player.Playerpoint ) { 
      setCookie("tempScore", score)
      router.push("/")
    } else { 
      const nextLevel = Number(levelNumber) + 1
      const finalScore = score + player?.Playerpoint
      const playerId = player?.Player_ID
      const newlevel = Math.max(player.Level_Id, nextLevel)
     
      try {
        const response = await fetch("/api/updateScore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerId, finalScore, newlevel }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("User updated in successfully!", data);
        
         
          router.push(`/quiz/${newlevel}`)
          console.log(data.newlevel)
  
  
  
        } else {
          const errorData = await response.json();
          console.error("Login failed:", errorData.message);
  
  
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
  
  
      }
    }
    
  }

 

  const handleScore = () => {
    setAnswerChecked(true);
    const isCorrect = selectedAnswer == quizer.test_answer;

    if (isCorrect) {
      setCurrentStreak(prev => prev + 1);
      if (retried) {
        if (retryCount === 1) {
          setScore(score + 10);
        } else if (retryCount === 2) {
          setScore(score + 5);
        }
      } else {
        // Check for double points power-up
        const doublePoints = activePowerUps.find(p => p.name === 'Double Points' && p.active);
        setScore(score + (doublePoints ? 60 : 30));
        if (doublePoints) {
          usePowerUp('Double Points');
        }
      }
    } else {
      setCurrentStreak(0);
    }

    // Update allQuestionsUnder5Seconds
    if (answerTime > 5) {
      setAllQuestionsUnder5Seconds(false);
    }

    // Check for badges
    checkAndAwardBadges({
      answerTime,
      isCorrect,
      score,
      streak: currentStreak,
      levelCompleted: questionNumber === len - 1,
      allQuestionsUnder5Seconds
    });
  };
  const handleShareScore = () => {
    const shareText = `🎮 I just completed Level ${levelNumber}: ${levelTitle} on Guhuza Quiz App! 🎯\n\n🏆 My score: ${score} points\n⭐ Total Score: ${player?.Playerpoint ? player?.Playerpoint + score : score} points\n\nCan you beat my score? Try it now! #GuhuzaQuiz #LearningIsFun`;
    return shareText;
  };

  const handleNextQuestion = () => {
    if (questionNumber < len) {
      setQuestionNumber(questionNumber + 1);
      setDefault();
    }
  };

  const handleRetry =() => { 
    setScore(0)
    setQuestionNumber(0)
    router.push("/quiz/"+ levelNumber)
    console.log("retried")

  }

  return questionNumber < len ? (
    <div className="md:py-16 pt-8 pb-28">
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl mx-4">
            <h2 className="text-2xl font-bold mb-4">Quiz Rules</h2>
            <div className="space-y-4">
              <p>1. You have 15 seconds to answer each question</p>
              <p>2. Correct answers earn you 30 points</p>
              <p>3. If you need to retry:</p>
              <ul className="list-disc pl-6">
                <li>First retry: 10 points</li>
                <li>Second retry: 5 points</li>
              </ul>
              <p>4. You can use "Display Answer" to see the correct answer, but you won't earn any points</p>
              <p>5. Complete all questions to finish the level</p>
              <p>6. Earn power-ups by completing achievements!</p>
            </div>
            <button 
              className="quizPbtn mt-6"
              onClick={() => {
                setShowRules(false);
                setTimerStarted(true);
              }}
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
      {/* Power-ups display */}
      {activePowerUps.length > 0 && (
        <div className="container mb-4">
          <div className="flex gap-4">
            {activePowerUps.map(powerUp => (
              <button
                key={powerUp.name}
                className={`px-4 py-2 rounded-lg ${
                  powerUp.active ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => activatePowerUp(powerUp.name)}
                disabled={powerUp.active || powerUp.remainingUses === 0}
              >
                {powerUp.name} ({powerUp.remainingUses} uses left)
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="container flex justify-between flex-wrap">
        <h2 className="md:mb-16 mb-4 title intersect: motion-preset-slide-up motion-delay-200 intersect-once">
          Level {levelNumber} : {levelTitle}
        </h2>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 rounded-lg px-4 py-2 border border-blue-200">
            <p className="text-sm text-blue-600">Current Points</p>
            <p className="text-2xl font-bold text-blue-700">{score}</p>
          </div>
          <p className="mb-6">
            Question : {questionNumber + 1}/{len}
          </p>
          <div className="relative flex items-center justify-center">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (timeLeft / 30) * 125.6}
                  className={`transition-all duration-1000 ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-500'}`}
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                {timeLeft}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className=" flex  justify-start md:gap-20  ">
          {
            <div className="flex-1">
              <QuizCard
                Question={quizer.question}
                CorrectAns={quizer.test_answer}
                Answers={quizer.answers}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
                checked={answerChecked}
                setAnsCorrect={setAnsCorrect}
              />

              

              {/* buton section */}
              <div className=" ">
                <div className="mt-10 ">
                  {answerChecked ? (
                    <div className="w-full ">
                      {!ansCorrect ? (
                        <div>
                          <div className="flex gap-10">
                            <button
                              className="quizPbtn"
                              onClick={() => {
                                setSelectedAnswer(-1);
                                setAnswerChecked(false);
                                setRetried(true);
                                setRetryCount(prev => prev + 1);
                              }}
                              disabled={usedHint}
                            >
                              Retry
                            </button>
                            <button
                              className="quizSbtn"
                              onClick={() => {
                                setSelectedAnswer(quizer.test_answer);
                                setUsedHint(true);
                              }}
                            >
                              Display Answer
                            </button>
                          </div>
                          <p className="mt-6 text-sm absolute">
                            You can use Display Answer to force move to next
                            question without any point
                          </p>
                        </div>
                      ) : (
                        <div className="flex">
                          <button
                            className="quizPbtn ml-auto "
                            onClick={() => handleNextQuestion()}
                          >
                            {questionNumber < len - 1
                              ? "Next Question"
                              : "Finish Quiz"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="quizPbtn"
                      onClick={() => handleScore()}
                      disabled={selectedAnswer == -1 ? true : false}
                    >
                      Check Answer
                    </button>
                  )}
                </div>
              </div>
            </div>
          }
          <div className=" hidden md:block flex-1/2 w-100">
            {answerChecked ? (
              <div className="w-full ">
                {!ansCorrect ? (
                  <Image
                    src="/mascot/sadMascot.svg"
                    className="motion-preset-slide-left-md motion-preset-fade"
                    alt="Guhuza Mascot"
                    height={100}
                    width={200}
                  />
                ) : (
                  <Image
                    src="/mascot/greetingMascot.svg"
                    className="motion-preset-slide-left-md motion-preset-fade"
                    alt="Guhuza Mascot"
                    height={100}
                    width={200}
                  />
                )}
              </div>
            ) : (
              <Image
                className="motion-preset-slide-up-md motion-preset-fade"
                src="/mascot/proudMascot.svg"
                alt="Guhuza Mascot"
                height={100}
                width={200}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
 
    <div className="md:py-16 py-8">
      <div className="container">
        <div className="flex  flex-col items-center">
          <h1 className="title text-center">Lesson Complete !</h1>
          <div className="flex flex-wrap-reverse justify-center gap-8 items-center">
          <div className="flex  flex-col gap-8 mt-6 justify-center">
            <div className="bg-yellow-50 rounded border-2 border-yellow-300 gap-4 flex flex-col items-center px-6 py-4">
             
              <p className="mt-4 text-xl"> ⭐PTS GAINED</p>
              <h1 className="text-6xl font-bold">{score}</h1>
            </div>
            <div className="bg-blue-50 rounded border-2 border-blue-100   flex flex-col gap-4 items-center px-6 py-4">
            
              <p className="mt-4 text-xl"> 🏆TOTAL SCORE</p>
              <h1 className="text-6xl font-bold">{player?.Playerpoint ? player?.Playerpoint +  score: score}</h1>
            </div>
          </div>
          <Image src={"/mascot/proudMascot.svg"} className="mt-8" width={250} alt="Guhuza Bird" height={30} />

          </div>
          



         
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
            <BadgeSystem userBadges={userBadges} />
          </div>

          <button className="quizPbtn mt-20" onClick={handleNextLevel}>Save Score</button>

          <div className="flex  flex-wrap justify-center gap-6 mt-8">
            <button className="flex  gap-4" onClick={handleRetry}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Retry Same Lesson</button>
            <ShareButton 
              shareText={handleShareScore()}
              shareUrl={window.location.href}
              buttonClassName="flex gap-4 items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
            />
          </div>

        </div>
       
      </div>
    </div>
  );
}

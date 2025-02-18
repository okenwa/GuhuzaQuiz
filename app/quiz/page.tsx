
import React from "react";
import Pbtn from "../components/buttons/primarybtn";
import Image from "next/image";
import WhyplaySection from "./whyplaySection";
import QuizLevelSections from "../components/quizLevelSections";
import LeaderBoard from "../components/leaderBoard";
import ProfileHerosection from "../components/profileHerosection";
import ShareButton from "../components/buttons/sharebtn";
import QuizHero from "../components/quizHero";
import fetchPlayers from "@/utils/fPlayers";

async function  QuizHomePage() {
  const players = await fetchPlayers()
  console.log(players)
  return (
    <div className="mt-10">
      {/* Hero Section */}

      <QuizHero />

      {/* Why Play Section */}
      <div className="whyplay">
        <WhyplaySection />
      </div>

      {/* Quiz Level Section */}
      <div className="QuizSection mt-16">
        <QuizLevelSections currentLevel={1} />
      </div>

      {/* Leaderboard Section */}
      <div className="leaderboard section container">
        <LeaderBoard player={1} friends={[2, 4, 9]}  />
      </div>
    </div>
  );
}

export default QuizHomePage;


import React from "react";
import Pbtn from "../../components/buttons/primarybtn";
import Image from "next/image";
import WhyplaySection from "./whyplaySection";
import QuizLevelSections from "../../components/quizLevelSections";
import LeaderBoard from "../../components/leaderBoard";
import ProfileHerosection from "../../components/profileHerosection";
import ShareButton from "../../components/buttons/sharebtn";
import QuizHero from "../../components/quizHero";
import fetchPlayers from "@/utils/fPlayers";
async function  QuizHomePage() {
  const players = (await fetchPlayers() || [])

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
        <QuizLevelSections />
      </div>

      {/* Leaderboard Section */}
      <div className="leaderboard section container">
        <LeaderBoard Players={players}  />
      </div>
    </div>
  );
}

export default QuizHomePage;

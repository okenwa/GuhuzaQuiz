
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
import { auth } from "@/auth";
import LogoutButton from "../components/buttons/logoutBtn";
import LoginButton from "../components/buttons/loginBtn";




async function  QuizHomePage() {
  const players = (await fetchPlayers() || [])
  const session = await auth()
if ( session ){
  const user = session.user
  return (
    <div className="mt-10">
      
      
      
      {/* Hero Section */}
   
      <QuizHero />
     
      {/* Why Play Section */}
      <div className="whyplay">
        <WhyplaySection />
      </div>
      <p>Welcome, {user?.memberId} {user?.firstName} {user?.lastName} {'->'} {user?.email}</p>
      <LogoutButton/>

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
return ( 
  <div className="container"> 
    You are logged out 
    <LoginButton/>
  </div>
)
  
}

export default QuizHomePage;

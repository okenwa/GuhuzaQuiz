import React from "react";
import QuizLevelSections from "../components/quizLevelSections";
import LeaderBoard from "../components/leaderBoard";
import ProfileHerosection from "../components/profileHerosection";
import LeaderBoardSection from "../components/leaderBoardSection";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import LoginButton from "../components/buttons/loginBtn";
import fetchRank from "@/utils/fRanking";
import QuizList from "../components/quizList";
import fetchLevels from "@/utils/fLevels";

async function  Profile() {
  const session = await auth();
  if(session) { 
    const user = session?.user;
    const name = user?.firstName == null ? "Anonymous" :user?.firstName 

    const player = await fetchUser(
      Number(user?.memberId),
      name,
      user?.email || ""
    );
    const playerPoint:number = player ? player.Playerpoint : 0
    const playerRank = player ? await fetchRank(Number(playerPoint)) : 100
    // Ensure safePlayer is always a valid playerType object
    const defaultPlayer = {
      Player_ID: 0,
      Player_name: "Anonymous",
      Playerpoint: 0,
      Level_Id: 1,
      streak: 0,
      lastLogin: new Date(),
      milestone: {
        Milestone_Id: 0,
        Milestone_Title: "",
        Milestone_description: "",
        UnlockingLevel: 1,
        Milestone_reward_message: "",
        Milestone_Link: "",
        Milestone_Button_CTA: ""
      },
      Milestone_Id: 0,
    };
    const safePlayer = player && typeof player.Level_Id === 'number' ? { ...player, Level_Id: player.Level_Id ?? 1, milestone: player.milestone ?? defaultPlayer.milestone, Milestone_Id: player.Milestone_Id ?? 0, streak: player.streak ?? 0, lastLogin: player.lastLogin ?? new Date() } : defaultPlayer;
    const playerLevel = typeof safePlayer.Level_Id === 'number' ? safePlayer.Level_Id : 1;
    const levels = (await fetchLevels()) || [];
    return (
      <div className="p-6 min-h-screen">
    
        <ProfileHerosection player={safePlayer} playerRank={playerRank}/>
         <div className="mt-12">
          <QuizLevelSections playerLevel={playerLevel}/>
        </div>
        {/* All Levels Section */}
        <div className="mt-16 container">
          <h2 className="text-2xl font-bold mb-6">All Levels</h2>
          <QuizList allLevels={levels} cutEnding={false} playerLevel={playerLevel}/>
        </div>
        {/* Leaderboard Section */}
  
        <div className=" mt-12 container">
          {/* <LeaderBoard  /> */}
          <LeaderBoardSection/>
        </div>
      </div>
    );
  } 
  // Use defaultPlayer for unauthenticated state if needed
  return (
      <div className="flex h-full">
        <div className="px-8 my-32 rounded py-8 border-2 mx-auto w-fit bg-white">
          <div className="">
            <h1 className="title mb-5 w-32">Log in Required</h1>
            <p>
             You  have to login in order to acess this page
            </p>
  
            <div>
              <div className="mt-5 w-full">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  
 
}

export default Profile;

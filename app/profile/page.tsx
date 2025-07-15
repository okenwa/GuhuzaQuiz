import React from "react";
import QuizLevelSections from "../components/quizLevelSections";
import LeaderBoard from "../components/leaderBoard";
import EnhancedProfileSection from "../components/EnhancedProfileSection";
import LeaderBoardSection from "../components/leaderBoardSection";
import ActiveSessionsWidget from "../components/ActiveSessionsWidget";
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
import LoginButton from "../components/buttons/loginBtn";
import fetchRank from "@/utils/fRanking";
import QuizList from "../components/quizList";
import fetchLevels from "@/utils/fLevels";
import { generateRandomNickname } from "@/utils/profileUtils";
import db from "@/lib/db";

async function Profile() {
  try {
    const session = await auth();
    if(session) { 
      const user = session?.user;
      const name = user?.firstName == null ? "Anonymous" :user?.firstName 

      let player = null;
      try {
        player = await fetchUser(
          Number(user?.memberId),
          name,
          user?.email || ""
        );
      } catch (error) {
        console.error('Error fetching user:', error);
        // Continue with null player
      }

      // Assign random nickname if missing
      if (player && !player.nickname) {
        try {
          const randomNickname = generateRandomNickname();
          await db.player.update({
            where: { Player_ID: Number(user?.memberId) },
            data: { nickname: randomNickname }
          });
          player.nickname = randomNickname;
        } catch (error) {
          console.error('Error updating nickname:', error);
        }
      }

      const playerPoint:number = player ? player.Playerpoint : 0
      let playerRank = 100;
      try {
        playerRank = player ? await fetchRank(Number(playerPoint)) : 100;
      } catch (error) {
        console.error('Error fetching rank:', error);
      }

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

      const safePlayer = player && typeof player.Level_Id === 'number' ? { 
        ...player, 
        Level_Id: player.Level_Id ?? 1, 
        milestone: player.milestone ?? defaultPlayer.milestone, 
        Milestone_Id: player.Milestone_Id ?? 0, 
        streak: player.streak ?? 0, 
        lastLogin: player.lastLogin ?? new Date() 
      } : defaultPlayer;

      const playerLevel = typeof safePlayer.Level_Id === 'number' ? safePlayer.Level_Id : 1;
      
      let levels = [];
      try {
        levels = (await fetchLevels()) || [];
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Enhanced Profile Section */}
          <EnhancedProfileSection 
            player={safePlayer} 
            playerRank={playerRank}
            session={session}
          />
          
          {/* Quiz Levels Section */}
          <div className="container mx-auto px-4 py-8">
            {/* Active Sessions Section */}
            <div className="mb-12">
              <ActiveSessionsWidget />
            </div>
            
            {/* All Levels Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">All Levels</h2>
              <QuizList allLevels={levels} cutEnding={false} playerLevel={playerLevel}/>
            </div>
          </div>
        </div>
      );
    } 
  } catch (error) {
    console.error('Profile page error:', error);
  }
  
  // Use defaultPlayer for unauthenticated state if needed
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="px-8 py-8 border-2 rounded-xl mx-auto w-fit bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-5 text-gray-800">Log in Required</h1>
          <p className="text-gray-600 mb-6">
            You have to login in order to access this page
          </p>
          <div className="mt-5">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

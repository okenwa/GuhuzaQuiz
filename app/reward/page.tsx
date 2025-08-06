import RewardCopy from "../components/rewardcopy";
import React from 'react'
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";


type milestoneType = {
  Milestone_Id: number;
  Milestone_Title: string;
  Milestone_description: string;
  UnlockingLevel: number;
  Milestone_reward_message: string;
  Milestone_Link:string; 
  Milestone_Button_CTA : string 
};

type playerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  streak: number;
  lastLogin: Date;
  Level_Id: number | null;
  Milestone_Id?: number | null;
  milestone?: milestoneType | null;
};


async function Reward() {
  const session = await auth()
  if(session) { 
    const user = session?.user
    const player: playerType | null  = await fetchUser(Number(user?.memberId), user?.firstName || "Anonymous", user?.email||"noemailavailable") ?? null
    return (
      <div>
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">🎁 Rewards Center</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Claim your achievements, track your social rewards, and unlock exclusive bonuses!
            </p>
          </div>
        </div>
        
        <RewardCopy player={ player}/>
      </div>
     )
  }
  
  // If not authenticated, show login prompt
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">🎁 Rewards Center</h1>
        <p className="text-gray-600 mb-6">Please log in to view and claim your rewards.</p>
        <a 
          href="/api/auth/signin" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}

export default Reward
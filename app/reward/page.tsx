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
  Level_Id: number;
  Milestone_Id?: number;
  milestone: milestoneType;
};


async function Reward() {
  const session = await auth()
  if(session) { 
    const user = session?.user
    const playerData = await fetchUser(Number(user?.memberId), user?.firstName || "Anonymous", user?.email||"noemailavailable") ?? null
    // Ensure Level_Id is always a number
    const player: playerType | null = playerData ? {
      ...playerData,
      Level_Id: playerData.Level_Id ?? 1,
      Milestone_Id: playerData.Milestone_Id === null ? undefined : playerData.Milestone_Id,
      milestone: playerData.milestone || {
        Milestone_Id: 0,
        Milestone_Title: "Default",
        Milestone_description: "Default milestone",
        UnlockingLevel: 1,
        Milestone_reward_message: "Default reward",
        Milestone_Link: "",
        Milestone_Button_CTA: "Continue"
      }
    } : null
    return (
      <div>
       <RewardCopy player={ player}/>
      </div>
     )
  }
  
}

export default Reward
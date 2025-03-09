import RewardCopy from "../components/rewardcopy";
import React from 'react'
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";


type typeMilestone = { 
  Milestone_Id : number;
  Milestone_Title : string;
  Milestone_description : string; 
  Milestone_link : string;
}


type typePlayer = {
  Level_Id: number;
  Milestone_Id: number;
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  Temp_Score: number;
  lastLogin: Date;
  streak: number;
  user_Id: number;
  milestone : typeMilestone
};




async function Reward() {
  const session = await auth()
  if(session) { 
    const user = session?.user
    const player: typePlayer | null  = await fetchUser(Number(user?.memberId), user?.firstName || "Anonymous", user?.email||"noemailavailable") ?? null
    return (
      <div>
       <RewardCopy player={ player}/>
      </div>
     )
  }
  
}

export default Reward
import RewardCopy from "../components/rewardcopy";
import React from 'react'
import { auth } from "@/auth";
import fetchUser from "@/utils/fUser";
async function Reward() {
  const session = await auth()
  if(session) { 
    const user = session?.user
    const player = await fetchUser(Number(user?.memberId), user?.firstName || "Anonymous", user?.email||"noemailavailable") ?? null
    return (
      <div>
       <RewardCopy player={ player}/>
      </div>
     )
  }
  
}

export default Reward
"use client"
import { createContext, useState } from "react";

type typePlayer = {
  Level_Id: number;
  Milestone_Id: number;
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  Temp_Score: number;
  lastLogin: Date; // Can be Date if parsed
  streak: number;
  user_Id: number;
}

export const playerContext = createContext<any>(null);

function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<typePlayer | null>(null);
  const [tempScore, setTempScore] = useState(-1);
  const[playerLevel, setPlayerLevel] = useState(1)

  const AssignPlayerData = (playerData:any) => { 
    setPlayer(playerData);
    setPlayerLevel(playerData?.Level_Id   )
    console.log(playerData?.Level_Id   )
  };

  return (
    <playerContext.Provider value={{player, AssignPlayerData, playerLevel}}>
      {children}
    </playerContext.Provider>
  );
}

export default PlayerContextProvider;

"use client"
import { createContext, useContext, useState } from "react";

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

const playerInitialState = async() => { 
  const player = localStorage.getItem("player")
  return player ? JSON.parse(player) : null
}

export const playerContext = createContext<any>(null);

function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<any>(null);
  const [tempScore, setTempScore] = useState(-1);
  const[playerLevel, setPlayerLevel] = useState(player?.Level_Id)

  
  
  const AssignPlayerData = (playerData:any) => { 
    setPlayer(playerData);
    localStorage.setItem("player", JSON.stringify(playerData))
    setPlayerLevel(playerData?.Level_Id   )
    console.log(playerData?.Level_Id   )
  };

  return (
    <playerContext.Provider value={{player, AssignPlayerData, playerLevel, setPlayerLevel}}>
      {children}
    </playerContext.Provider>
  );
}

export default PlayerContextProvider;


export function usePlayer() { 
  const {playerLevel} = useContext(playerContext)
  if (!playerLevel) {
    throw new Error('cannot find context')
  }
  return playerLevel
}
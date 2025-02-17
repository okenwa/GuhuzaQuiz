"use client"
import { createContext, useState } from "react";

type PlayerType = { 
  PlayerId: number, 
  PlayerName: string, 
  PlayerPoint: number, 
  Streak: number, 
  LastLoginIn: Date, 
  LevelId: number, 
  MileStoneID: number, 
}

export const playerContext = createContext<any>(null);

function PlayerContextProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [tempScore, setTempScore] = useState(-1);

  const AssignPlayerData = (playerData: PlayerType) => { 
    setPlayer(playerData);
  };

  return (
    <playerContext.Provider value={{player, AssignPlayerData}}>
      {children}
    </playerContext.Provider>
  );
}

export default PlayerContextProvider;

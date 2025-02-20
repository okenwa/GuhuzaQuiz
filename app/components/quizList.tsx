"use client"
import React, { useContext, useState } from 'react'
import QuizLevelCard from './quizLevelCard'
import { playerContext } from '../context/playerContext';
type levelType = {
    Level_Id: number;
    Level_Title: string;
    Level_number: number;
  };
  type levelsType = levelType[];

  function QuizList({ allLevels, cutEnding=true }: { allLevels: levelsType, cutEnding : boolean }) {
    
    const{playerLevel} = useContext(playerContext)
    const filteredLevels = allLevels.filter((level:levelType)=> level.Level_Id <= playerLevel).sort((a,b)=> b.Level_Id - a.Level_Id)
    const endingPoint = cutEnding ? filteredLevels[0]?.Level_Id - 3 : 1
      const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js
    
        function scrollToTop() {
            if (!isBrowser()) return;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      
    return (
      <div>
        
        {filteredLevels.map((level: levelType) => ((level.Level_Id >endingPoint) &&(
          <QuizLevelCard
            key={level.Level_Id}
            levelNumber={level.Level_Id}
            levelLink={`quiz/${level.Level_Id}`}
            levelName={level.Level_Title}
            currentLevel={playerLevel}
          />)
        ))}

      
        {!cutEnding ? 
          <div className='py-20 w-full flex'>
        <button className='underline text-center font-semibold mx-auto px-auto' onClick={scrollToTop}>Scroll To Top</button>

        </div>: ""}
      </div>
    );
  }

export default QuizList
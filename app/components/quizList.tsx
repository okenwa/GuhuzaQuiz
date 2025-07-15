"use client";

import React from "react";
import QuizLevelCard from "./quizLevelCard";
import fetchPlayers from "@/utils/fPlayers";

type levelType = {
  Level_Id: number;
  Level_Title: string;
  Level_number: number;
};
type levelsType = levelType[];

async function QuizList({ allLevels, cutEnding = true, playerLevel }: { allLevels: levelsType; cutEnding: boolean , playerLevel : number}) {
  // Show all levels, but lock those above playerLevel
  const displayLevel = playerLevel;
  const sortedLevels = allLevels.sort((a, b) => a.Level_Id - b.Level_Id);

  const isBrowser = () => typeof window !== "undefined";
  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sortedLevels.map((level: levelType) => (
        <QuizLevelCard
          key={level.Level_Id}
          levelNumber={level.Level_Id}
          levelLink={`quiz/${level.Level_Id}`}
          levelName={level.Level_Title}
          currentLevel={displayLevel}
          locked={level.Level_Id > displayLevel}
        />
      ))}

      {!cutEnding && (
        <div className="py-20 w-full flex col-span-full">
          <button className="underline text-center font-semibold mx-auto px-auto" onClick={scrollToTop}>
            Scroll To Top
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizList;

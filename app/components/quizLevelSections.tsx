import React from "react";
import { levels } from "@/lib/db";
import QuizLevelCard from "./quizLevelCard";
import { a } from "framer-motion/client";

type quizLevelSectionsType = {
  currentLevel: number;
};

function QuizLevelSections({ currentLevel }: quizLevelSectionsType) {
  const filteredLevels = levels
    .filter((level) => level.levelnumber <= currentLevel)
    .sort((a, b) => b.levelnumber - a.levelnumber);
  return (
    <div className="space-y-8 ">
      <div className=" container flex gap-12 ">
        <h2 className=" px-4 py-1 bg-blue-400 text-4xl w-fit  rounded font-bold text-gray-900 mb-10">
          Your Journey{" "}
        </h2>
        <p className="w-96">
          You will unlock new level as you complete the top level. New
          Challenges will appear as you grow
        </p>
      </div>
      <div className=" container grid gap-16   ">
        {filteredLevels.map((level) => (
          <QuizLevelCard
            key={level.levelnumber}
            levelNumber={level.levelnumber}
            levelLink={level.link}
            levelName={level.title}
            currentLevel={currentLevel}
          />
        ))}
      </div>
    </div>
  );
}

export default QuizLevelSections;

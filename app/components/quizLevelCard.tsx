import React from "react";
import Pbtn from "./buttons/primarybtn";

import { FaLock } from "react-icons/fa";

type QuizLevelCardTypes = {
  levelName: string;
  levelLink: string;
  levelNumber: number;
  currentLevel: number;
  locked?: boolean;
};

function QuizLevelCard({
  levelName,
  levelLink,
  levelNumber,
  currentLevel,
  locked = false,
}: QuizLevelCardTypes) {
  return (
    <div
      className={`levelContainer rounded-lg p-6 border-b-4 border-2 mt-6 duration-300 w-full shadow-lg relative
        ${locked ? 'opacity-60 grayscale pointer-events-none' : ''}
        bg-white`}
    >
      <div className="flex gap-4 items-center">
        <div className="flex items-center justify-center bg-blue-400 border-blue-400 text-[#191A23] w-8 h-8 rounded-full border-2 mb-4">
          <p className="font-bold">{levelNumber}</p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            {levelName}
            {locked && <FaLock className="inline text-gray-400 ml-2" title="Locked" />}
          </h3>
          <p className="text mb-4">Number of Questions: 10</p>
        </div>
      </div>
      <div className="pt-4 place-items-end">
        <Pbtn
          toDestination={locked ? undefined : levelLink}
          theme={levelNumber == currentLevel ? "light" : "dark"}
          message={locked ? "Locked" : "Start Quiz"}
          disabled={locked}
        />
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FaLock className="text-4xl text-gray-300 opacity-60" />
        </div>
      )}
    </div>
  );
}

export default QuizLevelCard;

import React from "react";
import Pbtn from "./buttons/primarybtn";

type QuizLevelCardTypes = {
  levelName: string;
  questionsCount: string;
  levelLink: string;
};
function QuizLevelCard({
  levelName,
  questionsCount,
  levelLink,
}: QuizLevelCardTypes) {
  return (
    <div className="levelContainer">
      <h3>{levelName}</h3>
      <p>Number of Quesions : {questionsCount} </p>
      <Pbtn toDestination={levelLink} message="Start Quiz" />
    </div>
  );
}

export default QuizLevelCard;

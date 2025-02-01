"use client";
import React, { useState } from "react";

type QbtnType = {
  option: string;
  index: number;
  correctAnswer: number;
};

function Qbtn({ option, index, correctAnswer }: QbtnType) {
  const [selected, setSeleted] = useState(false);

  return (
    <div>
      <button
        className={`${selected ? "border-b-1 border-blue-500" : ""}`}
        onClick={() => {
          setSeleted(true);
        }}
      >{index}
        {option}
      </button>
    </div>
  );
}

export default Qbtn;

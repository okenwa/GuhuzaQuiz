"use client";
import React, { useState } from "react";

type QbtnType = {
  option: string;
  index: number;
  correctAnswer: number;
};

function Qbtn({ option, index, correctAnswer }: QbtnType) {
  const [selected, setSelected] = useState(false);
  const isCorrect = index === correctAnswer;

  return (
    <div className="w-full group relative">
      <button
        className={`w-full text-left p-6 rounded-2xl shadow-lg transition-all duration-300 transform
          ${
            selected
              ? isCorrect
                ? "bg-gradient-to-br from-green-400 to-emerald-600 shadow-emerald-500/30"
                : "bg-gradient-to-br from-red-400 to-rose-600  shadow-rose-500/30"
              : "bg-gradient-to-br from-blue-50 to-purple-50 hover:bg-indigo-50 scale-95 hover:scale-100 shadow-indigo-500/10"
          }
          ${
            !selected &&
            "hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          }
          text-lg font-semibold relative overflow-hidden`}
        onClick={() => setSelected(true)}
        disabled={selected}
      >
        {/* Animated border */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 pointer-events-none transition-all duration-300
            ${
              selected
                ? isCorrect
                  ? "border-emerald-500/50"
                  : "border-rose-500/50"
                : "border-transparent"
            }`}
        />

        {/* Option indicator */}
        <div
          className={`w-8 h-8 rounded-lg mr-4 inline-flex items-center justify-center font-bold
            ${
              selected
                ? isCorrect
                  ? "bg-emerald-700 text-white"
                  : "bg-rose-700 text-white"
                : "bg-indigo-500 text-white"
            }`}
        >
          {String.fromCharCode(65 + index)}
        </div>

        {option}

        {/* Status icons */}
        {selected && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">
            {isCorrect ? "✅" : "❌"}
          </div>
        )}

        {/* Shine effect */}
        {!selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-45" />
        )}
      </button>

      {/* Floating particles effect for correct answers */}
      {selected && isCorrect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Qbtn;

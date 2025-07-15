import React from "react";
import Link from "next/link";

type PbtnType = {
  message: string;
  toDestination?: string;
  theme?: "dark" | "light";
  disabled?: boolean;
};

function Pbtn({ message, toDestination, theme = "light", disabled = false }: PbtnType) {
  const isDark = theme === "dark";
  const baseClass = `relative inline-block px-6 py-3 text-sm font-bold rounded-lg shadow-lg transition-transform transform active:translate-y-1 
    ${isDark ? "text-white bg-gray-800 border-b-4 border-gray-900 hover:bg-gray-700" : "text-gray-900 bg-gray-100 border-b-4 border-gray-300 hover:bg-gray-200"}
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`;

  if (disabled || !toDestination) {
    return (
      <button className={baseClass} disabled>
        {message}
      </button>
    );
  }

  return (
    <Link href={toDestination} className={baseClass}>
      {message}
    </Link>
  );
}

export default Pbtn;

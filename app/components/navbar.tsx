import React from "react";
import Link from "next/link";

function navbar() {
  return (
    <div className=" bg-black text-white relative">
      <div className="container">
        <Link href="/quiz">Quiz</Link>
      </div>
    </div>
  );
}

export default navbar;

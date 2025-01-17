import React from "react";
import Link from "next/link";

type PbtnType = {
  message: string;
  toDestination: string;
};

function Pbtn({ message, toDestination }: PbtnType) {
  return (
    <div>
      <Link href={toDestination}>{message}</Link>
    </div>
  );
}

export default Pbtn;

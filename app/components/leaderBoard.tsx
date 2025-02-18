"use client"; // Mark this as a Client Component in Next.js

import { Players } from "@/lib/db";
type leaderBoardType = {
  player: number;
  friends: Array<number>;
};

import ShareButton from "./buttons/sharebtn";
import fetchPlayers from "@/utils/fPlayers";

export default  function LeaderBoard({ player, friends }: leaderBoardType) {
  
  
  // Sort players by points in descending order
  const sortedPlayers = Players.sort((a, b) => b.point - a.point);

  // Get the top 5 players
  let topPlayers = sortedPlayers.slice(0, 5);

  // Check if the current player is in the top 5
  const isPlayerInTop5 = topPlayers.some((p) => p.player_id === player);

  // If the current player is not in the top 5, add them to the table
  if (!isPlayerInTop5) {
    const currentPlayer = Players.find((p) => p.player_id === player);
    if (currentPlayer) {
      topPlayers.push(currentPlayer); // Replace the 5th player with the current player
    }
  }
  const friendsToBeAdded = friends.filter((a) => {
    topPlayers.some((p) => p.player_id != a);
  });

  //   check if the friends are in the top 5 or no

  return (
    <div className=" py-24">
     
      <div className="container">
        <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto intersect:motion-preset-slide-up motion-delay-200 intersect-once ">
          Leader Board
        </h2>
        <p className="w-96 m-auto text-center mt-6 mb-10 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Check our top performers
        </p>
      </div>
      <div className="overflow-x-auto">
      <table className="intersect:motion-preset-slide-up motion-delay-200 intersect-once min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
  <thead className="bg-gradient-to-b from-gray-950 to-gray-800 text-white uppercase text-sm font-semibold">
    <tr>
      <th className="px-6 py-3 text-left tracking-wider">Name</th>
      <th className="px-6 py-3 text-left tracking-wider">Points</th>
      <th className="px-6 py-3 text-left tracking-wider">Level</th>
      <th className="px-6 py-3 text-left tracking-wider">Upcoming Reward</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-300">
    {topPlayers.map((playerData) => {
      const isCurrentPlayer = playerData.player_id === player;
      const isFriend = friends.includes(playerData.player_id);

      const rowClass = isCurrentPlayer
        ? "bg-blue-100 font-semibold text-gray-900"
        : isFriend
        ? "bg-gray-100 text-gray-800"
        : "hover:bg-gray-50";

      return (
        <tr key={playerData.player_id} className={`${rowClass} transition-all`}>
          <td className="px-6 py-4 text-sm ">{playerData.name}</td>
          <td className="px-6 py-4 text-sm">{playerData.point}</td>
          <td className="px-6 py-4 text-sm">{playerData.level}</td>
          <td className="px-6 py-4 text-sm">{playerData.reward}</td>
        </tr>
      );
    })}
  </tbody>
</table>

      </div>
    </div>
  );
}

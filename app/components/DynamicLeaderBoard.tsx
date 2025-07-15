'use client';

import { useLeaderboard } from '../hooks/useLeaderboard';

export default function DynamicLeaderBoard() {
  const {
    displayPlayers,
    loading,
    error,
    userRank,
    lastUpdated,
    isUserInTop5,
    refreshLeaderboard,
    session
  } = useLeaderboard();

  if (loading) {
    return (
      <div className="py-24">
        <div className="container">
          <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto">
            LeaderBoard
          </h2>
          <p className="w-96 m-auto text-center mt-6 mb-10">
            Check our top performers
          </p>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24">
        <div className="container">
          <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto">
            LeaderBoard
          </h2>
          <p className="w-96 m-auto text-center mt-6 mb-10">
            Check our top performers
          </p>
          <div className="text-center text-red-600 py-8">
            {error}
            <button 
              onClick={refreshLeaderboard}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="container">
        <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          LeaderBoard
        </h2>
        <p className="w-96 m-auto text-center mt-6 mb-10 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Check our top performers
        </p>
        
        {/* User's rank display if not in top 5 */}
        {session?.user && !isUserInTop5 && userRank && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
            <p className="text-center text-blue-800">
              <span className="font-semibold">Your Rank:</span> #{userRank}
            </p>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="intersect:motion-preset-slide-up motion-delay-200 intersect-once min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gradient-to-b from-gray-950 to-gray-800 text-white uppercase text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">Ranking</th>
              <th className="px-6 py-3 text-left tracking-wider">Name</th>
              <th className="px-6 py-3 text-left tracking-wider">Points</th>
              <th className="px-6 py-3 text-left tracking-wider">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {displayPlayers.map((playerData, index) => {
              if (!playerData) return null;
              const memberId = session?.user?.memberId;
              const isCurrentPlayer = memberId && 
                playerData.Player_ID === Number(memberId);
              const rank = isCurrentPlayer && !isUserInTop5 ? userRank : index + 1;
              const rowClass = isCurrentPlayer ? 
                "bg-blue-100 font-semibold text-gray-900" : "";

              return (
                <tr
                  key={playerData.Player_ID}
                  className={`${rowClass} transition-all hover:bg-gray-50`}
                >
                  <td className="px-6 py-4 text-sm">
                    {rank}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {playerData.nickname}
                    {isCurrentPlayer && (
                      <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {playerData.Playerpoint.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {playerData.Level_Id || 1}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Refresh button and last updated info */}
      <div className="text-center mt-6">
        <button 
          onClick={refreshLeaderboard}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Leaderboard
        </button>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
} 
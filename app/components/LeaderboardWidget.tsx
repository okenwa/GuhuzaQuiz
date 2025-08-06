'use client';

import { useLeaderboard } from '../hooks/useLeaderboard';

export default function LeaderboardWidget() {
  const {
    displayPlayers,
    loading,
    error,
    userRank,
    session
  } = useLeaderboard();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Players</h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Players</h3>
        <p className="text-red-500 text-sm">Failed to load leaderboard</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Players</h3>
      
      {/* User's rank if not in top 5 */}
      {session?.user && userRank && userRank > 5 && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            Your rank: #{userRank}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        {displayPlayers.slice(0, 5).filter(Boolean).map((player, index) => {
          if (!player) return null;
          
          const isCurrentPlayer = session?.user?.memberId && 
            player.Player_ID === Number(session.user.memberId);
          
          return (
            <div 
              key={player.Player_ID}
              className={`flex items-center justify-between p-2 rounded ${
                isCurrentPlayer ? 'bg-blue-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  #{index + 1}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {player.Player_name}
                  {isCurrentPlayer && (
                    <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">
                      You
                    </span>
                  )}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {player.Playerpoint.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Updates every 30 seconds
        </p>
      </div>
    </div>
  );
} 
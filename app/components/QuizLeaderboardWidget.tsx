'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type PlayerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  Level_Id?: number;
};

export default function QuizLeaderboardWidget() {
  const [leaderboardData, setLeaderboardData] = useState<PlayerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [previousPlayers, setPreviousPlayers] = useState<PlayerType[]>([]);
  const [animations, setAnimations] = useState<{[key: number]: string}>({});
  const { data: session } = useSession();

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboardData(data);
      setLastUpdated(new Date());
      
      // If user is logged in, fetch their rank
      if (session?.user?.memberId) {
        const rankResponse = await fetch(`/api/leaderboard/rank?playerId=${session.user.memberId}`);
        if (rankResponse.ok) {
          const rankData = await rankResponse.json();
          setUserRank(rankData.rank);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    // Only fetch if session is available
    if (session) {
      fetchLeaderboard();
      
      // Update every 30 seconds during quiz to reduce API calls
      const interval = setInterval(fetchLeaderboard, 30000);
      
      return () => clearInterval(interval);
    }
  }, [session]);

  // Detect changes in player positions and scores - optimized
  useEffect(() => {
    if (previousPlayers.length > 0 && leaderboardData.length > 0) {
      const newAnimations: {[key: number]: string} = {};
      let hasChanges = false;
      
      leaderboardData.slice(0, 5).forEach((player, index) => {
        const prevPlayer = previousPlayers.find(p => p.Player_ID === player.Player_ID);
        if (prevPlayer) {
          const prevIndex = previousPlayers.findIndex(p => p.Player_ID === player.Player_ID);
          
          // Only animate significant changes
          if (index !== prevIndex || Math.abs(player.Playerpoint - prevPlayer.Playerpoint) > 10) {
            hasChanges = true;
            if (index < prevIndex) {
              newAnimations[player.Player_ID] = 'bg-green-100';
            } else if (index > prevIndex) {
              newAnimations[player.Player_ID] = 'bg-red-100';
            } else if (player.Playerpoint > prevPlayer.Playerpoint) {
              newAnimations[player.Player_ID] = 'bg-yellow-100';
            }
          }
        }
      });
      
      if (hasChanges) {
        setAnimations(newAnimations);
        // Clear animations after 1.5 seconds
        setTimeout(() => setAnimations({}), 1500);
      }
    }
    
    setPreviousPlayers(leaderboardData);
  }, [leaderboardData]);

  // Get top 5 players
  const topPlayers = leaderboardData.slice(0, 5);
  
  // Check if current user is in top 5
  const currentUser = session?.user?.memberId ? 
    leaderboardData.find(p => p.Player_ID === Number(session.user?.memberId)) : null;
  
  const isUserInTop5 = currentUser && topPlayers.some(p => p.Player_ID === currentUser.Player_ID);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Live Rankings</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Live Rankings</h3>
        </div>
        <p className="text-red-500 text-sm text-center">Failed to load</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Live Rankings</h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>

      {/* User's rank if not in top 5 */}
      {session?.user && !isUserInTop5 && userRank && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center font-medium">
            Your rank: #{userRank}
          </p>
        </div>
      )}

      {/* Top 5 Players */}
      <div className="space-y-2">
        {topPlayers.map((player, index) => {
          const isCurrentPlayer = session?.user?.memberId && 
            player.Player_ID === Number(session.user.memberId);
          
          return (
            <div 
              key={player.Player_ID}
              className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                isCurrentPlayer 
                  ? 'bg-blue-100 border border-blue-300 shadow-sm' 
                  : 'hover:bg-gray-50'
              } ${animations[player.Player_ID] || ''}`}
            >
              <div className="flex items-center space-x-3">
                {/* Rank with medal */}
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && (
                    <span className="bg-gray-400 w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Player name */}
                <span className={`text-sm font-medium ${
                  isCurrentPlayer ? 'text-blue-800' : 'text-gray-800'
                }`}>
                  {player.Player_name.length > 12 
                    ? player.Player_name.substring(0, 12) + '...' 
                    : player.Player_name
                  }
                  {isCurrentPlayer && (
                    <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">
                      You
                    </span>
                  )}
                </span>
              </div>
              
              {/* Points */}
              <span className="text-sm font-bold text-gray-900">
                {player.Playerpoint.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Updates every 10s</span>
          {lastUpdated && (
            <span>{lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          )}
        </div>
      </div>
    </div>
  );
} 
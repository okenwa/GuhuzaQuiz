'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useLeaderboardToasts } from './LeaderboardToast';
import LeaderboardToast from './LeaderboardToast';

type PlayerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  Level_Id?: number;
  streak?: number;
  lastLogin?: Date;
};

export default function RealTimeLeaderBoard() {
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

  const [previousPlayers, setPreviousPlayers] = useState<PlayerType[]>([]);
  const [animations, setAnimations] = useState<{[key: number]: string}>({});
  const [showNewScore, setShowNewScore] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toasts, addToast, removeToast } = useLeaderboardToasts();

  // Detect changes in player positions and scores
  useEffect(() => {
    if (previousPlayers.length > 0 && displayPlayers.length > 0) {
      const newAnimations: {[key: number]: string} = {};
      
      displayPlayers.forEach((player, index) => {
        const prevPlayer = previousPlayers.find(p => p.Player_ID === player.Player_ID);
        if (prevPlayer) {
          const prevIndex = previousPlayers.findIndex(p => p.Player_ID === player.Player_ID);
          
          // Position change animation
          if (index !== prevIndex) {
            if (index < prevIndex) {
              newAnimations[player.Player_ID] = 'animate-bounce bg-green-100';
            } else {
              newAnimations[player.Player_ID] = 'animate-pulse bg-red-100';
            }
          }
          
          // Score change animation
          if (player.Playerpoint > prevPlayer.Playerpoint) {
            newAnimations[player.Player_ID] = 'animate-pulse bg-yellow-100';
            setShowNewScore(true);
            setTimeout(() => setShowNewScore(false), 2000);
            
            // Show toast notification for score updates
            const memberId = session?.user?.memberId;
            const isCurrentPlayer = memberId && 
              player.Player_ID === Number(memberId);
            if (isCurrentPlayer) {
              addToast(`Your score updated to ${player.Playerpoint.toLocaleString()}!`, 'success');
            } else {
              addToast(`${player.Player_name} scored ${player.Playerpoint.toLocaleString()}!`, 'info');
            }
          }
        }
      });
      
      setAnimations(newAnimations);
      
      // Clear animations after 2 seconds
      setTimeout(() => setAnimations({}), 2000);
    }
    
    setPreviousPlayers(displayPlayers);
  }, [displayPlayers]);

  // Auto-refresh every 15 seconds for more frequent updates
  useEffect(() => {
    intervalRef.current = setInterval(refreshLeaderboard, 15000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshLeaderboard]);

  if (loading) {
    return (
      <div className="py-24">
        <div className="container">
          <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto">
            Live LeaderBoard
          </h2>
          <p className="w-96 m-auto text-center mt-6 mb-10">
            Real-time updates every 15 seconds
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
            Live LeaderBoard
          </h2>
          <p className="w-96 m-auto text-center mt-6 mb-10">
            Real-time updates every 15 seconds
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
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <LeaderboardToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <div className="container">
        <h2 className="px-4 py-1 text-center bg-blue-400 text-4xl w-fit rounded font-bold text-gray-900 m-auto intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Live LeaderBoard
        </h2>
        <p className="w-96 m-auto text-center mt-6 mb-10 intersect:motion-preset-slide-up motion-delay-200 intersect-once">
          Real-time updates every 15 seconds
        </p>
        
        {/* Live indicator */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
        
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
              <th className="px-6 py-3 text-left tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {displayPlayers.map((playerData, index) => {
              // Skip rendering if playerData is null or undefined
              if (!playerData) return null;
              
              const memberId = session?.user?.memberId;
              const isCurrentPlayer = memberId && 
                playerData.Player_ID === Number(memberId);
              const rank = isCurrentPlayer && !isUserInTop5 ? userRank : index + 1;
              const animationClass = animations[playerData.Player_ID] || '';
              const baseRowClass = isCurrentPlayer ? 
                "bg-blue-100 font-semibold text-gray-900" : "";
              const finalRowClass = `${baseRowClass} ${animationClass} transition-all hover:bg-gray-50`;

              return (
                <tr
                  key={playerData.Player_ID}
                  className={finalRowClass}
                >
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      {rank <= 3 && (
                        <span className="mr-2">
                          {rank === 1 && '🥇'}
                          {rank === 2 && '🥈'}
                          {rank === 3 && '🥉'}
                        </span>
                      )}
                      {rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {playerData.Player_name}
                    {isCurrentPlayer && (
                      <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {playerData.Playerpoint.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {playerData.Level_Id || 1}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {animations[playerData.Player_ID] && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        Updated
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Controls and info */}
      <div className="text-center mt-6 space-y-2">
        <button 
          onClick={refreshLeaderboard}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Now
        </button>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        <p className="text-xs text-gray-400">
          Auto-refreshes every 15 seconds
        </p>
      </div>
    </div>
  );
} 
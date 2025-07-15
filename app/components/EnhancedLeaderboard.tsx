'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useLeaderboard } from '../hooks/useLeaderboard';

type FilterType = 'all' | 'top10' | 'top50' | 'myRank';

export default function EnhancedLeaderboard() {
  const {
    leaderboardData,
    displayPlayers,
    loading,
    error,
    userRank,
    lastUpdated,
    refreshLeaderboard,
    session
  } = useLeaderboard();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllPlayers, setShowAllPlayers] = useState(false);

  // Filter and search players
  const filteredPlayers = useMemo(() => {
    let filtered = leaderboardData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.Player_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply rank filter
    switch (filter) {
      case 'top10':
        filtered = filtered.slice(0, 10);
        break;
      case 'top50':
        filtered = filtered.slice(0, 50);
        break;
      case 'myRank':
        if (session?.user?.memberId) {
          const memberId = Number(session.user.memberId);
          const currentUser = filtered.find(p => p.Player_ID === memberId);
          if (currentUser) {
            const userIndex = filtered.findIndex(p => p.Player_ID === memberId);
            const start = Math.max(0, userIndex - 2);
            const end = Math.min(filtered.length, userIndex + 3);
            filtered = filtered.slice(start, end);
          }
        }
        break;
      default:
        filtered = showAllPlayers ? filtered : filtered.slice(0, 20);
    }

    return filtered;
  }, [leaderboardData, filter, searchTerm, showAllPlayers, session]);

  // Get current user's position
  const currentUserPosition = useMemo(() => {
    if (!session?.user?.memberId) return null;
    const memberId = Number(session.user.memberId);
    return leaderboardData.findIndex(p => p.Player_ID === memberId) + 1;
  }, [leaderboardData, session]);

  if (loading && leaderboardData.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error && leaderboardData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load leaderboard</p>
        <button 
          onClick={refreshLeaderboard}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Controls Section */}
      <div className="mb-6 space-y-4">
        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('top10')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'top10' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Top 10
            </button>
            <button
              onClick={() => setFilter('top50')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'top50' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Top 50
            </button>
            {session?.user && (
              <button
                onClick={() => setFilter('myRank')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'myRank' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                My Rank
              </button>
            )}
          </div>
        </div>

        {/* User Rank Display */}
        {session?.user && currentUserPosition && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-semibold text-gray-800">Your Position</p>
                  <p className="text-2xl font-bold text-blue-600">#{currentUserPosition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Players</p>
                <p className="text-lg font-semibold text-gray-800">{leaderboardData.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border">
            <p className="text-sm text-gray-600">Total Players</p>
            <p className="text-2xl font-bold text-blue-600">{leaderboardData.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <p className="text-sm text-gray-600">Highest Score</p>
            <p className="text-2xl font-bold text-green-600">
              {leaderboardData.length > 0 ? leaderboardData[0].Playerpoint.toLocaleString() : '0'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-purple-600">
              {leaderboardData.length > 0 
                ? Math.round(leaderboardData.reduce((sum, p) => sum + p.Playerpoint, 0) / leaderboardData.length).toLocaleString()
                : '0'
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border">
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold text-gray-800">
              {lastUpdated ? lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlayers.map((player, index) => {
                // Skip rendering if player is null or undefined
                if (!player) return null;
                
                const memberId = session?.user?.memberId;
                const isCurrentPlayer = memberId && 
                  player.Player_ID === Number(memberId);
                const globalRank = leaderboardData.findIndex(p => p.Player_ID === player.Player_ID) + 1;
                
                return (
                  <tr
                    key={player.Player_ID}
                    className={`${
                      isCurrentPlayer 
                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                        : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {globalRank <= 3 && (
                          <span className="mr-2 text-lg">
                            {globalRank === 1 && '🥇'}
                            {globalRank === 2 && '🥈'}
                            {globalRank === 3 && '🥉'}
                          </span>
                        )}
                        <span className={`font-bold ${
                          globalRank <= 3 ? 'text-yellow-600' : 'text-gray-900'
                        }`}>
                          #{globalRank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {player.nickname || player.Player_name}
                          {isCurrentPlayer && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        {player.Playerpoint.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Level {player.Level_Id || 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isCurrentPlayer && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Current Player
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {!showAllPlayers && filter === 'all' && leaderboardData.length > 20 && (
          <div className="p-4 text-center border-t">
            <button
              onClick={() => setShowAllPlayers(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load All Players ({leaderboardData.length})
            </button>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={refreshLeaderboard}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Leaderboard
        </button>
      </div>
    </div>
  );
} 
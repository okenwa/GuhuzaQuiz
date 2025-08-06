import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';

type PlayerType = {
  Player_ID: number;
  Player_name: string;
  Playerpoint: number;
  Level_Id?: number;
  streak?: number;
  lastLogin?: Date;
  nickname?: string;
};

type LeaderboardData = PlayerType[];

export const useLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { data: session } = useSession();

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [session]);

  const refreshLeaderboard = useCallback(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    // Only fetch if session is available
    if (session) {
      fetchLeaderboard();
      
      // Set up polling for real-time updates (every 30 seconds)
      const interval = setInterval(fetchLeaderboard, 30000);
      
      return () => clearInterval(interval);
    }
  }, [fetchLeaderboard, session]);

  // Memoized data processing to prevent unnecessary re-renders
  const { topPlayers, currentUser, isUserInTop5, displayPlayers } = useMemo(() => {
    const topPlayers = leaderboardData.slice(0, 5);
    
    // Check if current user is in top 5
    const currentUser = session?.user?.memberId ? 
      leaderboardData.find(p => p.Player_ID === Number(session.user?.memberId)) : null;
    
    const isUserInTop5 = currentUser && topPlayers.some(p => p.Player_ID === currentUser.Player_ID);
    
    // If user is not in top 5, add them to the display
    const displayPlayers = isUserInTop5 ? topPlayers : [...topPlayers, currentUser].filter(Boolean);
    
    return { topPlayers, currentUser, isUserInTop5, displayPlayers };
  }, [leaderboardData, session?.user?.memberId]);

  return {
    leaderboardData,
    displayPlayers,
    loading,
    error,
    userRank,
    lastUpdated,
    isUserInTop5,
    currentUser,
    refreshLeaderboard,
    session
  };
}; 
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { message: "Player ID is required" },
        { status: 400 }
      );
    }

    // Get the player's level and completion data
    const player = await db.player.findUnique({
      where: {
        Player_ID: Number(playerId)
      },
      select: {
        Level_Id: true,
        Playerpoint: true,
        quizSessions: {
          where: {
            Completed: true
          },
          select: {
            Time_Spent: true,
            Level_Id: true
          }
        }
      }
    });

    if (!player) {
      return NextResponse.json(
        { message: "Player not found" },
        { status: 404 }
      );
    }

    // Calculate player's average completion time
    const levelTimes: { [key: number]: number[] } = {};
    player.quizSessions.forEach(session => {
      if (!levelTimes[session.Level_Id]) {
        levelTimes[session.Level_Id] = [];
      }
      levelTimes[session.Level_Id].push(session.Time_Spent);
    });

    const averageTimePerLevel = Object.values(levelTimes).map(times => 
      times.reduce((sum, time) => sum + time, 0) / times.length
    );

    const playerAverageTime = averageTimePerLevel.length > 0 
      ? averageTimePerLevel.reduce((sum, time) => sum + time, 0) / averageTimePerLevel.length
      : 0;

    const playerLevel = player.Level_Id || 1;

    // Get all players with their ranking data
    const allPlayers = await db.player.findMany({
      select: {
        Player_ID: true,
        Level_Id: true,
        Playerpoint: true,
        quizSessions: {
          where: {
            Completed: true
          },
          select: {
            Time_Spent: true,
            Level_Id: true
          }
        }
      }
    });

    // Calculate ranking data for all players
    const playersWithRanking = allPlayers.map(p => {
      const pLevelTimes: { [key: number]: number[] } = {};
      p.quizSessions.forEach(session => {
        if (!pLevelTimes[session.Level_Id]) {
          pLevelTimes[session.Level_Id] = [];
        }
        pLevelTimes[session.Level_Id].push(session.Time_Spent);
      });

      const pAverageTimePerLevel = Object.values(pLevelTimes).map(times => 
        times.reduce((sum, time) => sum + time, 0) / times.length
      );

      const pAverageTime = pAverageTimePerLevel.length > 0 
        ? pAverageTimePerLevel.reduce((sum, time) => sum + time, 0) / pAverageTimePerLevel.length
        : 0;

      return {
        Player_ID: p.Player_ID,
        Level_Id: p.Level_Id || 1,
        Playerpoint: p.Playerpoint,
        averageCompletionTime: Math.round(pAverageTime)
      };
    });

    // Sort players using the same logic as the main leaderboard
    const sortedPlayers = playersWithRanking.sort((a, b) => {
      // First priority: Level progression (higher level = better rank)
      if (a.Level_Id !== b.Level_Id) {
        return b.Level_Id - a.Level_Id;
      }
      
      // Second priority: Average completion time (faster = better rank)
      if (a.averageCompletionTime === 0 && b.averageCompletionTime === 0) {
        return b.Playerpoint - a.Playerpoint;
      }
      
      if (a.averageCompletionTime === 0) return 1;
      if (b.averageCompletionTime === 0) return -1;
      
      return a.averageCompletionTime - b.averageCompletionTime;
    });

    // Find the player's rank
    const rank = sortedPlayers.findIndex(p => p.Player_ID === Number(playerId)) + 1;

    const response = NextResponse.json({ 
      rank,
      level: playerLevel,
      averageCompletionTime: Math.round(playerAverageTime),
      completedSessions: player.quizSessions.length
    }, { status: 200 });
    
    // Add cache headers to reduce database load
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error("Error fetching player rank:", error);
    return NextResponse.json(
      { message: "Failed to fetch player rank" },
      { status: 500 }
    );
  }
} 
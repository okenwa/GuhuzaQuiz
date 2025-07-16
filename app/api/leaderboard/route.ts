import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Get all players with their level and average completion time
    const players = await db.player.findMany({
      select: {
        Player_ID: true,
        Player_name: true,
        nickname: true,
        Playerpoint: true,
        Level_Id: true,
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

    // Calculate average completion time per level for each player
    const playersWithSpeed = players.map(player => {
      // Group sessions by level and calculate average time per level
      const levelTimes: { [key: number]: number[] } = {};
      
      player.quizSessions.forEach(session => {
        if (!levelTimes[session.Level_Id]) {
          levelTimes[session.Level_Id] = [];
        }
        levelTimes[session.Level_Id].push(session.Time_Spent);
      });

      // Calculate average time per level
      const averageTimePerLevel = Object.values(levelTimes).map(times => 
        times.reduce((sum, time) => sum + time, 0) / times.length
      );

      // Overall average completion time (in seconds)
      const averageCompletionTime = averageTimePerLevel.length > 0 
        ? averageTimePerLevel.reduce((sum, time) => sum + time, 0) / averageTimePerLevel.length
        : 0;

      return {
        Player_ID: player.Player_ID,
        Player_name: player.Player_name,
        nickname: player.nickname,
        Playerpoint: player.Playerpoint,
        Level_Id: player.Level_Id || 1,
        averageCompletionTime: Math.round(averageCompletionTime),
        completedSessions: player.quizSessions.length
      };
    });

    // Sort players: first by level (descending), then by average completion time (ascending - faster is better)
    const sortedPlayers = playersWithSpeed.sort((a, b) => {
      // First priority: Level progression (higher level = better rank)
      if (a.Level_Id !== b.Level_Id) {
        return b.Level_Id - a.Level_Id;
      }
      
      // Second priority: Average completion time (faster = better rank)
      // If no completion time data, rank by points as fallback
      if (a.averageCompletionTime === 0 && b.averageCompletionTime === 0) {
        return b.Playerpoint - a.Playerpoint;
      }
      
      if (a.averageCompletionTime === 0) return 1; // No completion data = lower rank
      if (b.averageCompletionTime === 0) return -1;
      
      return a.averageCompletionTime - b.averageCompletionTime;
    });

    // Take top 10 players
    const topPlayers = sortedPlayers.slice(0, 10);

    const response = NextResponse.json(topPlayers, { status: 200 });
    
    // Add cache headers to reduce API calls
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { playerId, score } = await req.json();

    if (!playerId || score === undefined) {
      return NextResponse.json(
        { message: "Player ID and score are required" },
        { status: 400 }
      );
    }

    const updatedPlayer = await db.player.update({
      where: {
        Player_ID: playerId
      },
      data: {
        Playerpoint: score
      },
      select: {
        Player_ID: true,
        Player_name: true,
        Playerpoint: true,
        Level_Id: true
      }
    });

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json(
      { message: "Failed to update leaderboard" },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Add caching headers to reduce database load
    const players = await db.player.findMany({
      orderBy: {
        Playerpoint: 'desc'
      },
      take: 10,
      select: {
        Player_ID: true,
        Player_name: true,
        Playerpoint: true,
        Level_Id: true
      }
    });

    const response = NextResponse.json(players, { status: 200 });
    
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
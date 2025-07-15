import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Get the player's points
    const player = await prisma.player.findUnique({
      where: {
        Player_ID: Number(playerId)
      },
      select: {
        Playerpoint: true
      }
    });

    if (!player) {
      return NextResponse.json(
        { message: "Player not found" },
        { status: 404 }
      );
    }

    // Count how many players have more points than this player
    const rank = await prisma.player.count({
      where: {
        Playerpoint: {
          gt: player.Playerpoint
        }
      }
    }) + 1;

    const response = NextResponse.json({ rank }, { status: 200 });
    
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
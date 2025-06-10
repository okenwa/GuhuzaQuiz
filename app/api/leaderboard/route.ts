import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
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

    return NextResponse.json(players, { status: 200 });
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

    const updatedPlayer = await prisma.player.update({
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
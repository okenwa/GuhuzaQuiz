import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserActiveSessions } from "@/utils/quizSessionUtils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.memberId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const activeSessions = await getUserActiveSessions(Number(session.user.memberId));

    return NextResponse.json({
      sessions: activeSessions
    });

  } catch (error) {
    console.error("Error getting active sessions:", error);
    return NextResponse.json(
      { message: "Failed to get active sessions" },
      { status: 500 }
    );
  }
} 
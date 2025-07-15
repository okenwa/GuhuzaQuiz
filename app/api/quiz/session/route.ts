import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { 
  getOrCreateQuizSession, 
  updateSessionProgress, 
  completeQuizSession,
  getUserActiveSessions 
} from "@/utils/quizSessionUtils";

// GET - Get or create quiz session
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.memberId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get('levelId');
    const totalQuestions = searchParams.get('totalQuestions');

    if (!levelId || !totalQuestions) {
      return NextResponse.json(
        { message: "Level ID and total questions are required" },
        { status: 400 }
      );
    }

    const quizSession = await getOrCreateQuizSession(
      Number(session.user.memberId),
      Number(levelId),
      Number(totalQuestions)
    );

    return NextResponse.json({
      session: quizSession
    });

  } catch (error) {
    console.error("Error getting quiz session:", error);
    return NextResponse.json(
      { message: "Failed to get quiz session" },
      { status: 500 }
    );
  }
}

// POST - Update session progress
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.memberId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, progressData } = body;

    if (!sessionId) {
      return NextResponse.json(
        { message: "Session ID is required" },
        { status: 400 }
      );
    }

    const updatedSession = await updateSessionProgress(sessionId, progressData);

    return NextResponse.json({
      session: updatedSession
    });

  } catch (error) {
    console.error("Error updating session progress:", error);
    return NextResponse.json(
      { message: "Failed to update session progress" },
      { status: 500 }
    );
  }
}

// PUT - Complete quiz session
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.memberId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, finalScore } = body;

    if (!sessionId || finalScore === undefined) {
      return NextResponse.json(
        { message: "Session ID and final score are required" },
        { status: 400 }
      );
    }

    const completedSession = await completeQuizSession(sessionId, finalScore);

    return NextResponse.json({
      session: completedSession
    });

  } catch (error) {
    console.error("Error completing quiz session:", error);
    return NextResponse.json(
      { message: "Failed to complete quiz session" },
      { status: 500 }
    );
  }
} 
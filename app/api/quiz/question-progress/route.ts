import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveQuestionProgress } from "@/utils/quizSessionUtils";

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
    const { 
      sessionId, 
      questionIndex, 
      selectedAnswer, 
      isCorrect, 
      timeTaken, 
      usedHint, 
      retryCount, 
      answerChecked 
    } = body;

    if (!sessionId || questionIndex === undefined) {
      return NextResponse.json(
        { message: "Session ID and question index are required" },
        { status: 400 }
      );
    }

    const progress = await saveQuestionProgress({
      Session_ID: sessionId,
      Question_Index: questionIndex,
      Selected_Answer: selectedAnswer,
      Is_Correct: isCorrect,
      Time_Taken: timeTaken,
      Used_Hint: usedHint || false,
      Retry_Count: retryCount || 0,
      Answer_Checked: answerChecked || false,
    });

    return NextResponse.json({
      progress
    });

  } catch (error) {
    console.error("Error saving question progress:", error);
    return NextResponse.json(
      { message: "Failed to save question progress" },
      { status: 500 }
    );
  }
} 
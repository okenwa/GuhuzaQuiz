import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateJobMatches } from "@/lib/ai";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.memberId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeText, preferences } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { message: "Please provide resume text (at least 50 characters)." },
        { status: 400 }
      );
    }

    // Generate job matches based on resume
    const jobMatches = await generateJobMatches(resumeText, preferences);

    // Save job matching session
    const jobMatchSession = await prisma.jobMatchSession.create({
      data: {
        Player_ID: parseInt(session.user.memberId.toString()),
        Resume_Text: resumeText,
        Preferences: JSON.stringify(preferences || {}),
        Match_Results: JSON.stringify(jobMatches),
        Created_At: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true,
      jobMatches,
      sessionId: jobMatchSession.Session_ID 
    });
  } catch (error) {
    console.error("Error generating job matches:", error);
    return NextResponse.json(
      { message: "Failed to generate job matches" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.memberId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's job matching history
    const history = await prisma.jobMatchSession.findMany({
      where: {
        Player_ID: parseInt(session.user.memberId.toString()),
      },
      orderBy: {
        Created_At: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({ 
      success: true,
      history: history.map(session => ({
        sessionId: session.Session_ID,
        createdAt: session.Created_At,
        matchCount: JSON.parse(session.Match_Results || '[]').length,
      }))
    });
  } catch (error) {
    console.error("Error fetching job match history:", error);
    return NextResponse.json(
      { message: "Failed to fetch job match history" },
      { status: 500 }
    );
  }
}

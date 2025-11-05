import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.memberId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get resume statistics for the user
    const stats = await prisma.resumeReport.findMany({
      where: {
        Player_ID: Number(session.user.memberId),
      },
      orderBy: {
        Created_At: 'desc',
      },
    });

    if (stats.length === 0) {
      return NextResponse.json({
        totalReports: 0,
        avgScore: 0,
        totalSkills: 0,
        lastUpdated: null,
      });
    }

    // Calculate statistics
    let totalSkills = 0;
    let totalScore = 0;
    let validReports = 0;

    stats.forEach(stat => {
      try {
        const reportData = JSON.parse(stat.Report_Data);
        if (reportData.skills) {
          totalSkills += reportData.skills.length;
        }
        if (reportData.atsScore) {
          totalScore += reportData.atsScore;
          validReports++;
        }
      } catch (error) {
        console.error('Error parsing report data:', error);
      }
    });

    const avgScore = validReports > 0 ? totalScore / validReports : 0;
    const latestReport = stats[0];
    const lastUpdated = latestReport.Updated_At || latestReport.Created_At;

    return NextResponse.json({
      totalReports: stats.length,
      avgScore: avgScore,
      totalSkills: totalSkills,
      lastUpdated: lastUpdated.toISOString(),
      latestReport: {
        fileName: latestReport.File_Name,
        createdAt: latestReport.Created_At.toISOString(),
      },
    });

  } catch (error) {
    console.error("Error fetching resume stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch resume stats" },
      { status: 500 }
    );
  }
}

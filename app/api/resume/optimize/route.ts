import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.memberId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeText, targetJob } = body;

    if (!resumeText || !targetJob) {
      return NextResponse.json(
        { message: "Resume text and target job are required" },
        { status: 400 }
      );
    }

    // Generate optimized resume based on target job
    const optimizedResume = await generateOptimizedResume(resumeText, targetJob);

    return NextResponse.json({ 
      success: true,
      optimizedResume 
    });
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return NextResponse.json(
      { message: "Failed to optimize resume" },
      { status: 500 }
    );
  }
}

async function generateOptimizedResume(resumeText: string, targetJob: any): Promise<string> {
  // This would typically use AI to optimize the resume
  // For now, we'll return a mock optimized version with suggestions applied
  
  const suggestions = [
    `Add keywords: ${targetJob.skillsGap.join(", ")}`,
    `Emphasize experience with: ${targetJob.skillsMatched.slice(0, 3).join(", ")}`,
    `Include specific frameworks: ${targetJob.frameworksUsed.join(", ")}`,
    `Highlight ${targetJob.experienceLevel} level responsibilities`,
    `Mention ${targetJob.industry} industry experience if applicable`
  ];

  const optimizedSections = [
    "PROFESSIONAL SUMMARY",
    `Experienced ${targetJob.experienceLevel} developer with expertise in ${targetJob.skillsMatched.slice(0, 3).join(", ")} and strong background in ${targetJob.industry.toLowerCase()} solutions. Proven track record of delivering scalable applications using modern technologies including ${targetJob.frameworksUsed.join(", ")}.`,
    "",
    "TECHNICAL SKILLS",
    `• Frontend: ${targetJob.frameworksUsed.filter((f: string) => ['React', 'Vue.js', 'Angular'].includes(f)).join(", ")}`,
    `• Backend: ${targetJob.backendTech.join(", ")}`,
    `• Libraries: ${targetJob.librariesUsed.join(", ")}`,
    targetJob.uiuxSkills.length > 0 ? `• UI/UX: ${targetJob.uiuxSkills.join(", ")}` : null,
    targetJob.aiAlgorithms && targetJob.aiAlgorithms.length > 0 ? `• AI/ML: ${targetJob.aiAlgorithms.join(", ")}` : null,
    "",
    "OPTIMIZATION SUGGESTIONS:",
    ...suggestions.map(s => `• ${s}`),
    "",
    "--- ORIGINAL RESUME CONTENT ---",
    resumeText
  ].filter(Boolean).join("\n");

  return optimizedSections;
}

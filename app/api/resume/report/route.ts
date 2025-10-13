import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateResumeInsights } from "@/lib/ai";
import prisma from "@/lib/prisma";

// Helper function to extract skills from resume text
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL',
    'HTML', 'CSS', 'Angular', 'Vue', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Git', 'Docker', 'AWS', 'Azure', 'GCP', 'Kubernetes', 'Jenkins', 'CI/CD',
    'Agile', 'Scrum', 'REST API', 'GraphQL', 'Redis', 'Elasticsearch', 'Linux',
    'Windows', 'macOS', 'Unity', 'C#', 'Swift', 'Kotlin', 'Flutter', 'React Native',
    'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'Analytics',
    'Figma', 'Sketch', 'Adobe', 'Photoshop', 'Illustrator', 'UI/UX', 'Design'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills.slice(0, 15); // Limit to 15 skills
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.memberId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    let resumeText = "";
    let fileName: string | undefined;
    let mimeType: string | undefined;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      resumeText = (body?.resumeText || "").toString();
      fileName = body?.fileName;
      mimeType = body?.mimeType;
    } else if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      if (file) {
        const text = await file.text();
        resumeText = text.toString();
        fileName = (file as any)?.name;
        mimeType = file.type;
      }
      const textField = form.get("resumeText");
      if (!resumeText && typeof textField === "string") {
        resumeText = textField;
      }
    } else if (contentType.includes("text/plain")) {
      resumeText = await request.text();
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { message: "Please provide resume text (at least 50 characters)." },
        { status: 400 }
      );
    }

    const aiReport = await generateResumeInsights(resumeText, { fileName, mimeType });

    // Transform AI report to match frontend expectations with all analysis data
    const report = {
      name: aiReport.contactInfo?.extracted?.email?.split('@')[0] || "Unknown",
      email: aiReport.contactInfo?.extracted?.email || "Not found",
      phone: aiReport.contactInfo?.extracted?.phone || undefined,
      summary: aiReport.summary,
      experience: [], // Will be empty for now since AI doesn't extract experience structure
      education: [], // Will be empty for now since AI doesn't extract education structure
      skills: extractSkillsFromText(resumeText), // Extract skills from resume text
      strengths: aiReport.strengths || [],
      weaknesses: aiReport.gaps || [], // Map gaps to weaknesses
      overallScore: aiReport.atsScore || 50,
      // Include all additional AI analysis data
      atsScore: aiReport.atsScore || 50,
      tailoringTips: aiReport.tailoringTips || [],
      actionItems: aiReport.actionItems || [],
      atsTips: aiReport.atsTips || [],
      contactInfo: aiReport.contactInfo || {},
      dateFormatting: aiReport.dateFormatting || {},
      fileType: aiReport.fileType,
      measurableResults: aiReport.measurableResults || { present: false },
      resumeTone: aiReport.resumeTone,
      webPresence: aiReport.webPresence || { links: [], suggestions: [] },
      formattingAudit: aiReport.formattingAudit || { suggestions: [] },
    };

    // Save the report to the database
    await prisma.resumeReport.create({
      data: {
        Player_ID: parseInt(session.user.memberId.toString()),
        Resume_Text: resumeText,
        Report_Data: JSON.stringify(report),
        File_Name: fileName || null,
        Mime_Type: mimeType || null,
      },
    });

    // Return the transformed report
    return NextResponse.json({ report, resumeText, fileName, success: true });

  } catch (error) {
    console.error("Error generating resume report:", error);
    return NextResponse.json(
      { message: "Failed to generate resume report" },
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

    // Fetch the latest resume report from the database
    const latestReport = await prisma.resumeReport.findFirst({
      where: {
        Player_ID: parseInt(session.user.memberId.toString()),
      },
      orderBy: {
        Created_At: 'desc',
      },
    });

    if (!latestReport) {
      return NextResponse.json(
        { message: "No resume report found. Please upload a resume first." },
        { status: 404 }
      );
    }

    const report = JSON.parse(latestReport.Report_Data);
    
    return NextResponse.json({ 
      report, 
      resumeText: latestReport.Resume_Text,
      fileName: latestReport.File_Name,
      createdAt: latestReport.Created_At
    });
  } catch (error) {
    console.error("Error fetching resume report:", error);
    return NextResponse.json(
      { message: "Failed to fetch resume report" },
      { status: 500 }
    );
  }
}



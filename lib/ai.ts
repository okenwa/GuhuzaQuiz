// Simple AI helper to generate resume insights using OpenAI if available,
// otherwise return a deterministic mock for development.

type ResumeInsightSection = {
  title: string;
  bullets: string[];
};

export { generateJobMatches } from './jobMatching';

export type ResumeInsightReport = {
  summary: string;
  strengths: string[];
  gaps: string[];
  atsScore: number;
  tailoringTips: ResumeInsightSection[];
  actionItems: string[];
  // Extended sections
  atsTips: string[];
  contactInfo: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    extracted?: { email?: string; phone?: string; linkedin?: string };
  };
  dateFormatting: { pattern?: string; consistency?: string };
  fileType?: string;
  measurableResults: { present: boolean; examples?: string[] };
  resumeTone?: string;
  webPresence: { links: string[]; suggestions: string[] };
  formattingAudit: {
    fontConsistency?: string;
    layout?: string;
    pageSetup?: string;
    suggestions: string[];
  };
  overusedActionVerbs?: Array<{ verb: string; count: number }>;
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

function getGuhuzaProxyConfig() {
  const domain = process.env.GHZ_AI_API_DOMAIN?.trim();
  const apiKey = process.env.GHZ_AI_API_KEY?.trim();
  if (!domain || !apiKey) return null;
  const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
  // Endpoint convention: proxy chat endpoint
  const url = `${baseUrl}/api/v2/ai/chat`;
  return { url, apiKey } as const;
}

type FileContext = { fileName?: string; mimeType?: string };

const buildPrompt = (resumeText: string, fileCtx?: FileContext) => `You are an expert technical recruiter and career coach.
Analyze the following resume content and produce a concise, structured report as valid JSON matching this TypeScript type:

type ResumeInsightReport = {
  summary: string;
  strengths: string[];
  gaps: string[];
  atsScore: number; // 0-100, estimate ATS friendliness
  tailoringTips: { title: string; bullets: string[] }[];
  actionItems: string[];
  atsTips: string[];
  contactInfo: { hasEmail: boolean; hasPhone: boolean; hasLinkedIn: boolean; extracted?: { email?: string; phone?: string; linkedin?: string } };
  dateFormatting: { pattern?: string; consistency?: string };
  fileType?: string;
  measurableResults: { present: boolean; examples?: string[] };
  resumeTone?: string;
  webPresence: { links: string[]; suggestions: string[] };
  formattingAudit: { fontConsistency?: string; layout?: string; pageSetup?: string; suggestions: string[] };
};

Rules:
- Keep bullets short (max ~15 words each)
- Avoid duplicating ideas
- Prefer specific, measurable statements when possible
- Do not include backticks or commentary; return JSON only
- If resume lacks data for any field, infer or provide practical suggestions

File context (may help with fileType): ${fileCtx?.fileName || ""} ${fileCtx?.mimeType || ""}

Resume:
"""
${resumeText}
"""`;

const parseJsonSafe = (text: string, fallback: ResumeInsightReport): ResumeInsightReport => {
  try {
    const data = JSON.parse(text);
    // Minimal shape validation
    if (
      typeof data?.summary === "string" &&
      Array.isArray(data?.strengths) &&
      Array.isArray(data?.gaps) &&
      typeof data?.atsScore === "number" &&
      Array.isArray(data?.tailoringTips) &&
      Array.isArray(data?.actionItems)
    ) {
      return data as ResumeInsightReport;
    }
  } catch (_) {
    // fallthrough to mock
  }
  return fallback;
};

// Helper function to extract email from text
const extractEmail = (text: string): string | undefined => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const match = text.match(emailRegex);
  return match ? match[0] : undefined;
};

// Helper function to extract phone from text
const extractPhone = (text: string): string | undefined => {
  const phoneRegex = /[\d\s\(\)\-\+]{10,}/;
  const match = text.match(phoneRegex);
  return match ? match[0].trim() : undefined;
};

// Helper function to count quantified achievements
const countQuantifiedResults = (text: string): { count: number; examples: string[] } => {
  // Look for patterns like "X%", "X users", "$X", etc.
  const quantifiedPatterns = [
    /[\d]+%/g,  // percentages
    /[\d]+ (users|employees|customers|clients|projects|years|months)/gi,  // counts
    /\$\d+[KMkm]?/g,  // currency
    /improved|increased|reduced|cut|boosted|decreased|grew|expanded/gi,  // action verbs often with numbers
  ];
  
  let examples: string[] = [];
  quantifiedPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      examples.push(...matches.slice(0, 3)); // Take first 3 examples
    }
  });
  
  return { count: examples.length, examples: [...new Set(examples)] }; // Remove duplicates
};

const mockReport = (resumeText: string, fileCtx?: FileContext): ResumeInsightReport => {
  const lengthHint = Math.min(100, Math.round((resumeText?.length || 0) / 40));
  
  // Extract basic info from resume text
  const extractedEmail = extractEmail(resumeText);
  const extractedPhone = extractPhone(resumeText);
  const hasEmail = !!extractedEmail;
  const hasPhone = !!extractedPhone;
  
  // Check for LinkedIn and GitHub
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);
  const linkedinMatch = resumeText.match(/linkedin\.com\/[\w-]+/i);
  const extractedLinkedIn = linkedinMatch ? linkedinMatch[0] : undefined;
  
  // Check for GitHub
  const hasGitHub = /github\.com/i.test(resumeText);
  const githubMatch = resumeText.match(/github\.com\/[\w-]+/i);
  const extractedGitHub = githubMatch ? githubMatch[0] : undefined;
  
  // Collect all web presence links
  const webLinks: string[] = [];
  if (extractedLinkedIn) webLinks.push(extractedLinkedIn);
  if (extractedGitHub) webLinks.push(extractedGitHub);
  
  // Check for summary
  const hasSummary = /summary|professional summary|profile|objective/i.test(resumeText);
  const summary = hasSummary 
    ? "We found a summary section on your resume. Good job! The summary provides a quick overview of the candidate's qualifications, helping recruiters and hiring managers promptly grasp the value the candidate can offer in the position."
    : "We did not find a summary section in your resume. Consider adding a 2-3 line professional summary that highlights your key qualifications and career objectives.";
  
  // Check for education
  const hasEducation = /education|university|college|degree|diploma|bachelor|master|phd/i.test(resumeText);
  
  // Check for measurable results
  const quantified = countQuantifiedResults(resumeText);
  const hasQuantifiedResults = quantified.count >= 3;
  const measurableResults = hasQuantifiedResults 
    ? { present: true, examples: quantified.examples.slice(0, 3) }
    : { present: false, examples: [] };
  
  // Check for negative words/cliches
  const negativeWords = ["responsible for", "think outside the box", "go-getter", "team player", "hard worker", "self-starter"];
  const foundNegative = negativeWords.filter(word => new RegExp(word, 'i').test(resumeText));
  
  // Check for overused action verbs
  const commonActionVerbs = [
    "built", "created", "developed", "managed", "led", "improved", "increased", "decreased",
    "reduced", "implemented", "designed", "established", "maintained", "coordinated", "analyzed",
    "assisted", "provided", "supported", "trained", "supervised", "organized", "planned"
  ];
  
  const overusedVerbs: Array<{ verb: string; count: number }> = [];
  commonActionVerbs.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = resumeText.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 2) {
      overusedVerbs.push({ verb: verb.charAt(0).toUpperCase() + verb.slice(1), count });
    }
  });
  
  return {
    summary: "Resume analysis generated in development mode. For full AI-powered analysis, configure AI credentials.",
    strengths: [
      hasSummary ? "Clear professional summary present" : "Add a professional summary",
      hasQuantifiedResults ? "Quantified achievements present" : "Consider adding more measurable results",
      hasEducation ? "Education section properly formatted" : "Include education details",
    ],
    gaps: [
      !hasSummary ? "Profile summary could be sharper" : null,
      !hasQuantifiedResults ? "Skills section lacks grouping" : null,
      "Impact metrics could be more specific",
    ].filter(Boolean) as string[],
    atsScore: Math.max(55, Math.min(90, 65 + Math.floor(lengthHint / 5))),
    tailoringTips: [
      {
        title: "Alignment to target role",
        bullets: [
          "Mirror job title in headline",
          "Surface 3-5 role keywords upfront",
          "Prioritize most relevant projects",
        ],
      },
      {
        title: "Achievement framing",
        bullets: [
          "Use action + context + metric",
          "Add scale (traffic, users, revenue)",
          "Note tools and constraints",
        ],
      },
    ],
    actionItems: [
      !hasSummary ? "Add 2-3 line professional summary" : null,
      "Group skills by category",
      "Normalize bullet tense and structure",
      "Include links to portfolio or GitHub",
    ].filter(Boolean) as string[],
    atsTips: [
      "Use standard section headings",
      "Avoid tables and text boxes",
      "Save as .pdf or .docx with text layer",
    ],
    contactInfo: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      extracted: { 
        email: extractedEmail, 
        phone: extractedPhone,
        linkedin: extractedLinkedIn 
      },
    },
    dateFormatting: { pattern: "MMM YYYY – MMM YYYY", consistency: "mostly consistent" },
    fileType: fileCtx?.mimeType || inferFileTypeFromName(fileCtx?.fileName) || "unknown",
    measurableResults,
    resumeTone: foundNegative.length > 0 ? `Found ${foundNegative.length} potential cliches` : "professional and impact-focused",
    webPresence: { 
      links: webLinks, 
      suggestions: webLinks.length > 0 ? [] : ["Add LinkedIn profile", "Add GitHub repository", "Add personal website"] 
    },
    formattingAudit: {
      fontConsistency: "two fonts detected; prefer one family",
      layout: "good hierarchy, room for whitespace",
      pageSetup: "1 page, margins ~1 inch",
      suggestions: ["Increase line-height", "Unify bullet style"],
    },
  };
};

export async function generateResumeInsights(resumeText: string, fileCtx?: { fileName?: string; mimeType?: string }): Promise<ResumeInsightReport> {
  // 1) Prefer Guhuza proxy if configured
  const proxy = getGuhuzaProxyConfig();
  const fallback = mockReport(resumeText, fileCtx);
  if (proxy) {
    try {
      const response = await fetch(proxy.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": proxy.apiKey,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You return strictly and only JSON." },
            { role: "user", content: buildPrompt(resumeText, fileCtx) },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content ?? "";
        return parseJsonSafe(content, fallback);
      }
    } catch (_) {
      // fall through to OpenAI/mock
    }
  }

  // 2) Fallback to OpenAI if configured
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You return strictly and only JSON." },
          { role: "user", content: buildPrompt(resumeText, fileCtx) },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return parseJsonSafe(content, fallback);
  } catch (_) {
    return fallback;
  }
}

function inferFileTypeFromName(name?: string) {
  if (!name) return undefined;
  if (name.endsWith('.pdf')) return 'application/pdf';
  if (name.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (name.endsWith('.txt')) return 'text/plain';
  return undefined;
}



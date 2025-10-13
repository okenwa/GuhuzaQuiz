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

const mockReport = (resumeText: string, fileCtx?: FileContext): ResumeInsightReport => {
  const lengthHint = Math.min(100, Math.round((resumeText?.length || 0) / 40));
  return {
    summary: "Preliminary resume analysis generated in development mode.",
    strengths: [
      "Clear role progression",
      "Quantified achievements present",
      "Relevant keywords included",
    ],
    gaps: [
      "Profile summary could be sharper",
      "Skills section lacks grouping",
      "Impact metrics inconsistent across roles",
    ],
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
      "Add 2-3 line professional summary",
      "Group skills by category",
      "Normalize bullet tense and structure",
      "Include links to portfolio or GitHub",
    ],
    atsTips: [
      "Use standard section headings",
      "Avoid tables and text boxes",
      "Save as .pdf or .docx with text layer",
    ],
    contactInfo: {
      hasEmail: true,
      hasPhone: false,
      hasLinkedIn: true,
      extracted: { email: "example@email.com", linkedin: "linkedin.com/in/yourname" },
    },
    dateFormatting: { pattern: "MMM YYYY – MMM YYYY", consistency: "mostly consistent" },
    fileType: fileCtx?.mimeType || inferFileTypeFromName(fileCtx?.fileName) || "unknown",
    measurableResults: { present: true, examples: ["Cut cost 15%", "Improved CTR 22%"] },
    resumeTone: "professional and impact-focused",
    webPresence: { links: ["github.com/you", "portfolio.site"], suggestions: ["Add custom domain", "Ensure HTTPS"] },
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



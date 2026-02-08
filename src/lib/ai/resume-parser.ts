import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";

// ============================================
// TYPES
// ============================================

export interface ParsedResume {
  skills: string[];
  greenSkills: string[];
  certifications: string[];
  yearsExperience: number | null;
  summary: string;
  education: string[];
  workHistory: {
    company: string;
    title: string;
    duration: string;
  }[];
}

// ============================================
// RESUME PARSER SERVICE
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Extract text from a PDF buffer using pdf-parse v2.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

/**
 * Download a file from a URL and extract its text content.
 * Supports PDF files (the primary resume format).
 */
async function extractTextFromUrl(fileUrl: string): Promise<string> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const buffer = Buffer.from(await response.arrayBuffer());

  if (contentType.includes("pdf") || fileUrl.toLowerCase().endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  // For plain text or other formats, return as string
  return buffer.toString("utf-8");
}

/**
 * Parse a resume using Claude API to extract structured data.
 *
 * @param fileUrl - Public URL of the resume file in Supabase Storage
 * @returns Parsed resume data with skills, experience, certifications, etc.
 */
export async function parseResume(fileUrl: string): Promise<ParsedResume> {
  const startTime = Date.now();

  // Step 1: Extract text from file
  const resumeText = await extractTextFromUrl(fileUrl);

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Could not extract meaningful text from the resume file");
  }

  // Truncate very long resumes to stay within reasonable token limits
  const truncated = resumeText.slice(0, 15000);

  // Step 2: Send to Claude for structured extraction
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are an expert resume parser for a climate and sustainability recruitment platform. Extract structured information from the following resume text.

IMPORTANT: Focus especially on identifying climate/sustainability/green economy skills and certifications.

Resume text:
---
${truncated}
---

Respond with ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "skills": ["skill1", "skill2"],
  "greenSkills": ["climate-related skill1", "sustainability skill2"],
  "certifications": ["cert1", "cert2"],
  "yearsExperience": <number or null>,
  "summary": "2-3 sentence professional summary",
  "education": ["Degree from University (Year)"],
  "workHistory": [
    {"company": "Company Name", "title": "Job Title", "duration": "Start - End"}
  ]
}

Rules:
- "skills" = general professional skills (programming languages, tools, methodologies, soft skills)
- "greenSkills" = climate/sustainability-specific skills (renewable energy, ESG, circular economy, carbon accounting, LEED, environmental compliance, clean tech, etc.)
- "certifications" = professional certifications (LEED, NABCEP, PMP, B Corp, ISO 14001, etc.)
- "yearsExperience" = total years of professional experience (estimate from work history dates), null if unclear
- "summary" = concise professional summary capturing key strengths and career focus
- "education" = degrees and institutions
- "workHistory" = up to 5 most recent positions
- Return empty arrays if a category has no matches
- Do NOT invent or hallucinate information not present in the resume`,
      },
    ],
  });

  const duration = Date.now() - startTime;

  // Extract the text response
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude API");
  }

  // Parse the JSON response
  try {
    const parsed = JSON.parse(textBlock.text) as ParsedResume;

    logger.info("Resume parsed successfully", {
      duration: `${duration}ms`,
      skillsCount: parsed.skills.length,
      greenSkillsCount: parsed.greenSkills.length,
      certsCount: parsed.certifications.length,
    });

    return {
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      greenSkills: Array.isArray(parsed.greenSkills) ? parsed.greenSkills : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      yearsExperience: typeof parsed.yearsExperience === "number" ? parsed.yearsExperience : null,
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      education: Array.isArray(parsed.education) ? parsed.education : [],
      workHistory: Array.isArray(parsed.workHistory) ? parsed.workHistory : [],
    };
  } catch {
    logger.error("Failed to parse Claude response as JSON", {
      response: textBlock.text.slice(0, 500),
    });
    throw new Error("Failed to parse resume extraction results");
  }
}

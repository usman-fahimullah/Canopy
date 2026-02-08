import Anthropic from "@anthropic-ai/sdk";
import { logger } from "@/lib/logger";
import { CANDIDATE_MATCH_PROMPT } from "./prompts";

// ============================================
// TYPES
// ============================================

export interface CandidateProfile {
  id: string;
  name: string;
  skills: string[];
  greenSkills: string[];
  certifications: string[];
  yearsExperience: number | null;
  aiSummary: string | null;
}

export interface JobProfile {
  id: string;
  title: string;
  description: string;
  greenSkills: string[];
  requiredCerts: string[];
  experienceLevel: string | null;
  climateCategory: string | null;
}

export interface MatchScoreBreakdown {
  skills: number;
  experience: number;
  certifications: number;
  climatePassion: number;
}

export interface MatchScoreResult {
  score: number;
  breakdown: MatchScoreBreakdown;
  reasons: string[];
  strengths: string[];
  concerns: string[];
}

// ============================================
// CANDIDATE MATCHER SERVICE
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Calculate a match score between a candidate and a job using Claude.
 * Returns a score 0-100 with breakdown and reasoning.
 */
export async function calculateMatchScore(
  candidate: CandidateProfile,
  job: JobProfile
): Promise<MatchScoreResult> {
  const startTime = Date.now();

  // Build prompt from template
  const prompt = CANDIDATE_MATCH_PROMPT.replace("{candidateName}", candidate.name)
    .replace("{candidateSkills}", JSON.stringify(candidate.skills))
    .replace("{candidateGreenSkills}", JSON.stringify(candidate.greenSkills))
    .replace("{candidateCerts}", JSON.stringify(candidate.certifications))
    .replace("{candidateYears}", String(candidate.yearsExperience ?? "Unknown"))
    .replace("{candidateSummary}", candidate.aiSummary ?? "No summary available")
    .replace("{jobTitle}", job.title)
    .replace("{jobDescription}", job.description.slice(0, 3000))
    .replace("{jobGreenSkills}", JSON.stringify(job.greenSkills))
    .replace("{jobRequiredCerts}", JSON.stringify(job.requiredCerts))
    .replace("{jobExperienceLevel}", job.experienceLevel ?? "Not specified")
    .replace("{jobClimateCategory}", job.climateCategory ?? "Not specified");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const duration = Date.now() - startTime;

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude API for match scoring");
  }

  const parsed = JSON.parse(textBlock.text) as MatchScoreResult;

  // Clamp score to 0-100
  const score = Math.min(100, Math.max(0, Math.round(parsed.score)));

  const result: MatchScoreResult = {
    score,
    breakdown: {
      skills: clamp(parsed.breakdown?.skills ?? 0),
      experience: clamp(parsed.breakdown?.experience ?? 0),
      certifications: clamp(parsed.breakdown?.certifications ?? 0),
      climatePassion: clamp(parsed.breakdown?.climatePassion ?? 0),
    },
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
  };

  logger.info("Match score calculated", {
    candidateId: candidate.id,
    jobId: job.id,
    score: result.score,
    duration: `${duration}ms`,
  });

  return result;
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

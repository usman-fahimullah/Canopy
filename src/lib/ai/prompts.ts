/**
 * Centralized prompt templates for AI services.
 */

/**
 * Prompt for matching a candidate profile to a job listing.
 * Used by candidate-matcher.ts at application time.
 */
export const CANDIDATE_MATCH_PROMPT = `You are an expert climate/sustainability recruiter evaluating a candidate's fit for a job opening. Score the candidate 0–100 and explain your reasoning.

## Candidate Profile
Name: {candidateName}
Skills: {candidateSkills}
Green/Climate Skills: {candidateGreenSkills}
Certifications: {candidateCerts}
Years of Experience: {candidateYears}
Summary: {candidateSummary}

## Job Opening
Title: {jobTitle}
Description:
{jobDescription}

Required Green Skills: {jobGreenSkills}
Required Certifications: {jobRequiredCerts}
Experience Level: {jobExperienceLevel}
Climate Category: {jobClimateCategory}

## Instructions
Evaluate the candidate across these four dimensions:
1. **Skills Match** (0–100): How well do the candidate's technical and professional skills align with the job requirements?
2. **Experience Match** (0–100): Does the candidate's experience level meet the role's expectations?
3. **Certifications Match** (0–100): Does the candidate hold relevant certifications?
4. **Climate Passion** (0–100): Based on green skills, climate-related experience, and summary, how aligned is this candidate with climate/sustainability work?

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "score": <overall score 0-100>,
  "breakdown": {
    "skills": <0-100>,
    "experience": <0-100>,
    "certifications": <0-100>,
    "climatePassion": <0-100>
  },
  "reasons": ["reason 1", "reason 2", "reason 3"],
  "strengths": ["strength 1", "strength 2"],
  "concerns": ["concern 1"]
}

Rules:
- "score" is a weighted average: skills 35%, experience 25%, certifications 15%, climatePassion 25%
- "reasons" = 2-4 concise sentences explaining the overall score
- "strengths" = 1-3 specific candidate strengths for this role
- "concerns" = 0-2 potential gaps (empty array if none)
- Be fair and objective. A score of 50 means a reasonable but not ideal fit.
- Do NOT invent qualifications the candidate doesn't have.`;

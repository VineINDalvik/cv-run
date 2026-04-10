import { callAI } from './client'
import { ResumeData } from '../schema'

const OPTIMIZE_SYSTEM = `You are a resume optimization expert. Given a structured resume JSON and a target job description, return an optimized version of the resume JSON.

Rules:
- Reorder bullets within each job to surface most JD-relevant achievements first
- Reorder skills array to match JD keywords first (only real skills, never fabricate)
- Rewrite summary to align with role requirements
- Do NOT add or fabricate any experience, education, or skills
- Do NOT change dates, company names, or factual details
- Return ONLY valid JSON, same schema as input, no markdown fences`

export async function optimizeForJD(
  data: ResumeData,
  jobDescription: string
): Promise<ResumeData> {
  const text = await callAI(
    OPTIMIZE_SYSTEM,
    `Optimize this resume for the job description below.\n\nRESUME JSON:\n${JSON.stringify(data, null, 2)}\n\nJOB DESCRIPTION:\n${jobDescription}`
  )
  try {
    return JSON.parse(text) as ResumeData
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as ResumeData
    throw new Error('parse_failed')
  }
}

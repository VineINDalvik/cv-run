import { callAI } from './client'
import { InputSource, ResumeData } from '../schema'

// Determine if this is a structured resume (PDF/LaTeX/LinkedIn) or free text
function hasStructuredSource(sources: InputSource[]): boolean {
  return sources.some(s => s.type === 'pdf' || s.type === 'latex' || s.type === 'linkedin')
}

const EXTRACT_SYSTEM_STRUCTURED = `You are a resume data extractor and formatter. Your task is to extract resume data from structured sources (PDF/LaTeX/LinkedIn) into JSON.

CRITICAL RULES FOR STRUCTURED SOURCES:
- PRESERVE the original content exactly. Do not compress, summarize, or remove details
- NEVER turn multiple bullet points into one. Each bullet should remain separate
- NEVER rephrase entire sections. Keep the original wording whenever possible
- Minor improvements only:
  * Fix grammar/spelling errors
  * Add missing punctuation
  * Normalize date formats (e.g., "Jan 2020" format)
  * Ensure consistent tone within same section
- Deduplicate only if content is identical (exact duplicates across sources)
- When merging multiple sources: keep all information, add details from additional sources under appropriate entries
- Numbers and metrics: keep exactly as stated in source (never fabricate or infer)
- Return ONLY valid JSON, no markdown fences, no commentary`

const EXTRACT_SYSTEM_TEXT = `You are a resume data extractor. Given free-text resume descriptions, extract and structure them into a resume JSON object.

Rules for text input:
- Organize content logically into resume sections
- Can improve clarity and phrasing (but preserve original meaning)
- Add action verbs where appropriate (Led, Built, Designed, etc.)
- Deduplicate overlapping information
- Include numbers/metrics where present
- Past tense for previous roles, present tense for current role
- Remove obvious filler: "responsible for", "worked on", "helped with", "participated in"
- Return ONLY valid JSON, no markdown fences, no commentary`

const EXTRACT_SCHEMA = `{
  "name": "string",
  "title": "string (Current Role · Company)",
  "location": "string (City, Country)",
  "contact": {
    "email": "string or null",
    "github": "string or null (github.com/handle)",
    "linkedin": "string or null (linkedin.com/in/handle)",
    "website": "string or null"
  },
  "summary": "2-3 sentence professional summary, first person, concrete and specific",
  "availability": "Open to work | Not looking | Freelance only | null",
  "experience": [
    {
      "company": "string",
      "role": "string",
      "start": "Mon YYYY or YYYY",
      "end": "Present or Mon YYYY or YYYY",
      "location": "string or null",
      "bullets": ["action verb + what + measurable result"]
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "Degree · Major",
      "year": "YYYY"
    }
  ],
  "skills": ["string"],
  "languages": ["Language (Proficiency)"],
  "projects": []
}`

function formatSources(sources: InputSource[]): string {
  return sources
    .map((s, i) => {
      const label =
        s.type === 'linkedin'
          ? 'LinkedIn Profile Text'
          : s.type === 'pdf'
            ? `PDF Resume (${s.filename})`
            : s.type === 'latex'
              ? 'LaTeX Resume'
              : 'Text Description'
      return `--- SOURCE ${i + 1}: ${label} ---\n${s.content}`
    })
    .join('\n\n')
}

export async function extractResume(sources: InputSource[]): Promise<ResumeData> {
  // Choose extraction strategy based on source type
  const isStructured = hasStructuredSource(sources)
  const systemPrompt = isStructured ? EXTRACT_SYSTEM_STRUCTURED : EXTRACT_SYSTEM_TEXT

  const userPrompt = isStructured
    ? `Extract the resume data from the following structured resume source(s) into this JSON schema:\n\n${EXTRACT_SCHEMA}\n\n${formatSources(sources)}\n\nREMINDER: Preserve original content exactly. Do not compress or remove information.`
    : `Extract and structure the resume data from the following text into this JSON schema:\n\n${EXTRACT_SCHEMA}\n\n${formatSources(sources)}`

  const text = await callAI(systemPrompt, userPrompt)

  try {
    return JSON.parse(text) as ResumeData
  } catch {
    // Try to find JSON in the response
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as ResumeData
    throw new Error('parse_failed')
  }
}

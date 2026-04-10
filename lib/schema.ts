export interface ContactInfo {
  email?: string
  github?: string
  linkedin?: string
  website?: string
}

export interface ExperienceEntry {
  company: string
  role: string
  start: string
  end: string
  location?: string
  bullets: string[]
}

export interface EducationEntry {
  school: string
  degree: string
  year: string
}

export interface ProjectEntry {
  name: string
  description: string
  url?: string
  bullets?: string[]
}

export type Theme = 't3' | 'm1' | 'm3'
export type Availability = 'Open to work' | 'Not looking' | 'Freelance only' | null

export interface ResumeData {
  name: string
  title: string
  location: string
  contact: ContactInfo
  summary: string
  availability?: Availability
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  languages?: string[]
  projects?: ProjectEntry[]
}

export interface ResumeRecord {
  slug: string
  theme: Theme
  data: ResumeData
  createdAt: string
  expiresAt: string | null
  email?: string
}

export type InputSource =
  | { type: 'linkedin'; content: string }
  | { type: 'pdf'; content: string; filename: string }
  | { type: 'latex'; content: string }
  | { type: 'text'; content: string }

export interface ParseRequest {
  sources: InputSource[]
}

export interface OptimizeRequest {
  data: ResumeData
  jobDescription: string
}

import { kv } from '@vercel/kv'
import { ResumeRecord, Theme } from './schema'

export async function saveResume(record: ResumeRecord): Promise<void> {
  const key = `resume:${record.slug}`
  if (record.expiresAt) {
    const ttlSeconds = Math.floor(
      (new Date(record.expiresAt).getTime() - Date.now()) / 1000
    )
    await kv.set(key, record, { ex: ttlSeconds })
  } else {
    await kv.set(key, record)
  }

  if (record.email) {
    const emailKey = `email:${record.email}`
    const existing = (await kv.get<string[]>(emailKey)) ?? []
    await kv.set(emailKey, [...existing, record.slug])
  }
}

export async function getResume(slug: string): Promise<ResumeRecord | null> {
  return kv.get<ResumeRecord>(`resume:${slug}`)
}

export async function updateTheme(slug: string, theme: Theme): Promise<void> {
  const record = await getResume(slug)
  if (!record) return
  await saveResume({ ...record, theme })
}

import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { saveResume } from '@/lib/kv'
import { ResumeRecord, Theme, ResumeData } from '@/lib/schema'

export async function POST(req: NextRequest) {
  try {
    const body: { data: ResumeData; theme: Theme; email?: string } = await req.json()

    if (!body.data || !body.theme) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const slug = nanoid(6)
    const now = new Date()
    const expires = body.email ? null : new Date(now.getTime() + 72 * 60 * 60 * 1000)

    const record: ResumeRecord = {
      slug,
      theme: body.theme,
      data: body.data,
      createdAt: now.toISOString(),
      expiresAt: expires ? expires.toISOString() : null,
      email: body.email,
    }

    await saveResume(record)

    return NextResponse.json({ slug, url: `/r/${slug}` })
  } catch (err) {
    console.error('[/api/resume]', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

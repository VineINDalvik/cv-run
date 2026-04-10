import { NextRequest, NextResponse } from 'next/server'
import { optimizeForJD } from '@/lib/ai/optimize'
import { OptimizeRequest } from '@/lib/schema'

export async function POST(req: NextRequest) {
  try {
    const body: OptimizeRequest = await req.json()

    if (!body.data || !body.jobDescription) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const optimized = await optimizeForJD(body.data, body.jobDescription)
    return NextResponse.json({ data: optimized })
  } catch (err: unknown) {
    const code = err instanceof Error ? err.message : 'unknown'
    if (code === 'parse_failed') {
      return NextResponse.json({ error: 'parse_failed' }, { status: 422 })
    }
    console.error('[/api/optimize]', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

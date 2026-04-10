// MUST set up polyfills FIRST before any other imports that touch pdf-parse
// (Polyfills are defined inline here, not imported from external file)

import { NextRequest, NextResponse } from 'next/server'
import { InputSource } from '@/lib/schema'

// Polyfills MUST run synchronously at module load time
if (typeof (globalThis as Record<string, unknown>).DOMMatrix === 'undefined') {
  (globalThis as Record<string, unknown>).DOMMatrix = class DOMMatrix {
    constructor(init?: string | number[]) {}
    static fromMatrix() { return {} }
    static fromFloat32Array() { return {} }
    static fromFloat64Array() { return {} }
  }
}
if (typeof (globalThis as Record<string, unknown>).ImageData === 'undefined') {
  (globalThis as Record<string, unknown>).ImageData = class ImageData {
    constructor(data: Uint8ClampedArray | Uint8Array, width: number, height?: number) {
      this.data = data
      this.width = width
      this.height = height || data.length / (width * 4)
    }
    data: Uint8ClampedArray | Uint8Array
    width: number
    height: number
  }
}
if (typeof (globalThis as Record<string, unknown>).Path2D === 'undefined') {
  (globalThis as Record<string, unknown>).Path2D = class Path2D {
    constructor(path?: Path2D | string) {}
    addPath() {}
    closePath() {}
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    quadraticCurveTo() {}
    arc() {}
    arcTo() {}
    ellipse() {}
    rect() {}
  }
}

// Now safe to import after polyfills are set
import { parsePdf } from '@/lib/pdf-parse'
import { extractResume } from '@/lib/ai/extract'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const sourcesJson = formData.get('sources') as string
    const sources: InputSource[] = JSON.parse(sourcesJson)

    // Handle PDF file uploads
    const processedSources: InputSource[] = []
    for (const source of sources) {
      if (source.type === 'pdf') {
        const file = formData.get(`pdf_${source.filename}`) as File | null
        if (file) {
          const buffer = Buffer.from(await file.arrayBuffer())
          try {
            const { text } = await parsePdf(buffer)
            processedSources.push({ ...source, content: text })
          } catch (err: unknown) {
            const code = err instanceof Error ? err.message : 'parse_failed'
            return NextResponse.json({ error: code }, { status: 422 })
          }
        } else {
          processedSources.push(source)
        }
      } else {
        processedSources.push(source)
      }
    }

    const data = await extractResume(processedSources)
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const code = err instanceof Error ? err.message : 'unknown'
    if (code === 'parse_failed') {
      return NextResponse.json({ error: 'parse_failed' }, { status: 422 })
    }
    console.error('[/api/parse]', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

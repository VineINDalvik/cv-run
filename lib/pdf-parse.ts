// Set up polyfills INLINE before requiring pdf-parse
// (Do not import from external file - polyfills must be set synchronously here)

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
      ;(this as any).data = data
      ;(this as any).width = width
      ;(this as any).height = height || data.length / (width * 4)
    }
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

// Now safe to require pdf-parse
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse')

export interface PdfParseResult {
  text: string
  pageCount: number
}

export async function parsePdf(buffer: Buffer): Promise<PdfParseResult> {
  const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

  if (buffer.length > MAX_SIZE_BYTES) {
    throw new Error('file_too_large')
  }

  // pdf-parse v2 uses PDFParse class with data property for buffer
  const parser = new PDFParse({ data: buffer })
  const info = await parser.getInfo()
  const textResult = await parser.getText()

  if (info.total > 50) {
    throw new Error('too_many_pages')
  }

  const trimmedText = textResult.text.trim()

  if (trimmedText.length < 50) {
    throw new Error('no_text')
  }

  return {
    text: trimmedText,
    pageCount: info.total,
  }
}

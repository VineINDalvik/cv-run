// This file must be require'd (not imported) to set up polyfills before pdf-parse loads
// Create stub classes for browser APIs that pdf-parse needs

if (typeof (globalThis as Record<string, unknown>).DOMMatrix === 'undefined') {
  (globalThis as Record<string, unknown>).DOMMatrix = class DOMMatrix {
    constructor(init?: string | number[]) {}
    static fromMatrix() { return {} }
    static fromFloat32Array() { return {} }
    static fromFloat64Array() { return {} }
  } as any
}

if (typeof (globalThis as Record<string, unknown>).ImageData === 'undefined') {
  (globalThis as Record<string, unknown>).ImageData = class ImageData {
    constructor(data: Uint8ClampedArray | Uint8Array, width: number, height?: number) {
      ;(this as any).data = data
      ;(this as any).width = width
      ;(this as any).height = height || data.length / (width * 4)
    }
  } as any
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
  } as any
}

export {}

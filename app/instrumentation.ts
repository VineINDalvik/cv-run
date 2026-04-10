export function register() {
  // Setup polyfills for Node.js environment
  // These must run BEFORE pdf-parse tries to load
  setupNodePolyfills()
}

function setupNodePolyfills() {
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
}

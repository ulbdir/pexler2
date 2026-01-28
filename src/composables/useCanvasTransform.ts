import { useCanvasStore } from '@/stores/canvasStore'
import { useHistoryStore } from '@/stores/historyStore'

export function useCanvasTransform() {
  const canvasStore = useCanvasStore()
  const historyStore = useHistoryStore()

  function copyPixel(
    src: Uint8ClampedArray,
    srcIdx: number,
    dst: Uint8ClampedArray,
    dstIdx: number
  ): void {
    dst[dstIdx] = src[srcIdx]!
    dst[dstIdx + 1] = src[srcIdx + 1]!
    dst[dstIdx + 2] = src[srcIdx + 2]!
    dst[dstIdx + 3] = src[srcIdx + 3]!
  }

  function flipHorizontal(): void {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < Math.floor(width / 2); x++) {
        const leftIdx = (y * width + x) * 4
        const rightIdx = (y * width + (width - 1 - x)) * 4

        for (let c = 0; c < 4; c++) {
          const temp = pixels[leftIdx + c]!
          pixels[leftIdx + c] = pixels[rightIdx + c]!
          pixels[rightIdx + c] = temp
        }
      }
    }

    canvasStore.bumpVersion()
  }

  function flipVertical(): void {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    for (let y = 0; y < Math.floor(height / 2); y++) {
      for (let x = 0; x < width; x++) {
        const topIdx = (y * width + x) * 4
        const bottomIdx = ((height - 1 - y) * width + x) * 4

        for (let c = 0; c < 4; c++) {
          const temp = pixels[topIdx + c]!
          pixels[topIdx + c] = pixels[bottomIdx + c]!
          pixels[bottomIdx + c] = temp
        }
      }
    }

    canvasStore.bumpVersion()
  }

  function rotate90(): void {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    const newWidth = height
    const newHeight = width
    const newPixels = new Uint8ClampedArray(newWidth * newHeight * 4)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4
        const dstIdx = (x * newWidth + (height - 1 - y)) * 4
        copyPixel(pixels, srcIdx, newPixels, dstIdx)
      }
    }

    canvasStore.setImageData(newPixels, newWidth, newHeight)
  }

  function rotate180(): void {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    const newPixels = new Uint8ClampedArray(width * height * 4)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4
        const dstIdx = ((height - 1 - y) * width + (width - 1 - x)) * 4
        copyPixel(pixels, srcIdx, newPixels, dstIdx)
      }
    }

    canvasStore.setImageData(newPixels, width, height)
  }

  function rotate270(): void {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    const newWidth = height
    const newHeight = width
    const newPixels = new Uint8ClampedArray(newWidth * newHeight * 4)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4
        const dstIdx = ((width - 1 - x) * newWidth + y) * 4
        copyPixel(pixels, srcIdx, newPixels, dstIdx)
      }
    }

    canvasStore.setImageData(newPixels, newWidth, newHeight)
  }

  return {
    flipHorizontal,
    flipVertical,
    rotate90,
    rotate180,
    rotate270,
  }
}

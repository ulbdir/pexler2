import { useCanvasStore } from '@/stores/canvasStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useHistoryStore } from '@/stores/historyStore'
import { usePaletteStore } from '@/stores/paletteStore'
import { useI18n } from '@/i18n'
import type { RGBA } from '@/types'

export function useImageIO() {
  const { t } = useI18n()
  const canvasStore = useCanvasStore()
  const settingsStore = useSettingsStore()
  const historyStore = useHistoryStore()
  const paletteStore = usePaletteStore()

  function exportPNG() {
    const canvas = document.createElement('canvas')
    canvas.width = canvasStore.width
    canvas.height = canvasStore.height
    const ctx = canvas.getContext('2d')!
    const imageData = new ImageData(
      new Uint8ClampedArray(canvasStore.pixels),
      canvasStore.width,
      canvasStore.height
    )
    ctx.putImageData(imageData, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pexler-image.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  function loadImage(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(t('error.loadImage')))
      }

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        historyStore.clear()
        canvasStore.setImageData(imageData.data, img.width, img.height)

        const container = document.querySelector('main')
        if (container) {
          settingsStore.resetView(img.width, img.height, container.clientWidth, container.clientHeight)
        }
        resolve()
      }

      img.src = objectUrl
    })
  }

  function savePalette() {
    const data = JSON.stringify(paletteStore.colors)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pexler-palette.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function loadPalette(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onerror = () => reject(new Error(t('error.readPalette')))

      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as RGBA[]
          paletteStore.colors = data
          resolve()
        } catch {
          reject(new Error(t('error.invalidPalette')))
        }
      }

      reader.readAsText(file)
    })
  }

  return { exportPNG, loadImage, savePalette, loadPalette }
}

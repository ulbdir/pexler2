import { type Ref } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'
import { useToolStore } from '@/stores/toolStore'
import { usePaletteStore } from '@/stores/paletteStore'
import { useHistoryStore } from '@/stores/historyStore'
import { screenToImage } from '@/composables/useCanvasInteraction'
import { floodFill } from '@/utils/floodFill'
import { bresenhamLine } from '@/utils/bresenham'
import type { Point } from '@/types'

export function useDrawingTools(canvasRef: Ref<HTMLCanvasElement | null>) {
  const canvasStore = useCanvasStore()
  const toolStore = useToolStore()
  const paletteStore = usePaletteStore()
  const historyStore = useHistoryStore()

  let isDrawing = false
  let lastPos: Point | null = null

  function applyAtPixel(x: number, y: number) {
    const tool = toolStore.activeTool

    switch (tool) {
      case 'pencil': {
        const color = paletteStore.selectedColor
        canvasStore.setPixel(x, y, color)
        break
      }
      case 'eraser': {
        canvasStore.setPixel(x, y, { r: 0, g: 0, b: 0, a: 0 })
        break
      }
    }
  }

  function applyTool(clientX: number, clientY: number) {
    const pos = screenToImage(canvasRef.value, clientX, clientY)
    if (!pos) return

    const tool = toolStore.activeTool

    switch (tool) {
      case 'pencil':
      case 'eraser': {
        if (lastPos) {
          bresenhamLine(lastPos, pos, applyAtPixel)
        } else {
          applyAtPixel(pos.x, pos.y)
        }
        lastPos = pos
        canvasStore.bumpVersion()
        if (tool === 'pencil' && paletteStore.autoAdd) {
          paletteStore.addColor(paletteStore.selectedColor)
        }
        break
      }
      case 'fill': {
        const color = paletteStore.selectedColor
        floodFill(canvasStore.pixels, canvasStore.width, canvasStore.height, pos.x, pos.y, color)
        canvasStore.bumpVersion()
        if (paletteStore.autoAdd) {
          paletteStore.addColor(color)
        }
        break
      }
      case 'eyedropper': {
        const pixel = canvasStore.getPixel(pos.x, pos.y)
        if (pixel.a > 0) {
          paletteStore.selectedColor = pixel
        }
        break
      }
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || e.ctrlKey) return

    isDrawing = true
    lastPos = null
    canvasRef.value?.setPointerCapture(e.pointerId)

    if (toolStore.activeTool !== 'eyedropper') {
      historyStore.pushState()
    }

    applyTool(e.clientX, e.clientY)
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDrawing) return
    if (toolStore.activeTool === 'fill' || toolStore.activeTool === 'eyedropper') return
    applyTool(e.clientX, e.clientY)
  }

  function onPointerUp(e: PointerEvent) {
    if (isDrawing) {
      isDrawing = false
      lastPos = null
      canvasRef.value?.releasePointerCapture(e.pointerId)
    }
  }

  function onPointerCancel(e: PointerEvent) {
    if (isDrawing) {
      isDrawing = false
      lastPos = null
      canvasRef.value?.releasePointerCapture(e.pointerId)
    }
  }

  function attach() {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerCancel)
  }

  function detach() {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerCancel)
  }

  return { attach, detach }
}

import { type Ref } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'
import { useToolStore } from '@/stores/toolStore'
import { usePaletteStore } from '@/stores/paletteStore'
import { useHistoryStore } from '@/stores/historyStore'
import { screenToImage } from '@/composables/useCanvasInteraction'
import { floodFill } from '@/utils/floodFill'
import { bresenhamLine } from '@/utils/bresenham'
import { rectOutline, rectFilled, ellipseOutline, ellipseFilled, constrainToSquare } from '@/utils/shapes'
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
    const points = toolStore.getSymmetryPoints(x, y, canvasStore.width, canvasStore.height)

    switch (tool) {
      case 'pencil': {
        const color = paletteStore.selectedColor
        for (const p of points) {
          canvasStore.setPixel(p.x, p.y, color, toolStore.blendMode)
        }
        break
      }
      case 'eraser': {
        for (const p of points) {
          canvasStore.setPixel(p.x, p.y, { r: 0, g: 0, b: 0, a: 0 }, 'overwrite')
        }
        break
      }
    }
  }

  function resolveEnd(start: Point, end: Point): Point {
    if (toolStore.shapeConstrain && toolStore.shapeType !== 'line') {
      return constrainToSquare(start, end)
    }
    return end
  }

  function commitShape(start: Point, end: Point) {
    const color = paletteStore.selectedColor
    const setPixel = (x: number, y: number) => {
      canvasStore.setPixel(x, y, color, toolStore.blendMode)
    }

    const resolved = resolveEnd(start, end)

    switch (toolStore.shapeType) {
      case 'line':
        bresenhamLine(start, resolved, setPixel)
        break
      case 'rect':
        if (toolStore.shapeFilled) {
          rectFilled(start, resolved, setPixel)
        } else {
          rectOutline(start, resolved, setPixel)
        }
        break
      case 'ellipse':
        if (toolStore.shapeFilled) {
          ellipseFilled(start, resolved, setPixel)
        } else {
          ellipseOutline(start, resolved, setPixel)
        }
        break
    }

    canvasStore.bumpVersion()
    if (paletteStore.autoAdd) {
      paletteStore.addColor(color)
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
          // Skip first pixel (already painted in previous segment) to prevent double-blending
          bresenhamLine(lastPos, pos, applyAtPixel, true)
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

    const tool = toolStore.activeTool

    if (tool === 'shape') {
      const pos = screenToImage(canvasRef.value, e.clientX, e.clientY)
      if (!pos) return

      if (!toolStore.pendingShape) {
        // First click: set start point
        toolStore.setPendingShape({ start: pos, end: pos })
      } else {
        // Second click: commit shape
        historyStore.pushState()
        commitShape(toolStore.pendingShape.start, pos)
        toolStore.setPendingShape(null)
      }
      return
    }

    isDrawing = true
    lastPos = null
    canvasRef.value?.setPointerCapture(e.pointerId)

    if (tool !== 'eyedropper') {
      historyStore.pushState()
    }

    applyTool(e.clientX, e.clientY)
  }

  function onPointerMove(e: PointerEvent) {
    const tool = toolStore.activeTool
    const pos = screenToImage(canvasRef.value, e.clientX, e.clientY)

    // Track hover position for pencil/eraser (used for symmetry preview)
    if (tool === 'pencil' || tool === 'eraser') {
      if (pos) {
        toolStore.setHoverPosition(pos)
      }
    } else {
      toolStore.setHoverPosition(null)
    }

    if (tool === 'shape' && toolStore.pendingShape) {
      // Update preview endpoint
      if (pos) {
        toolStore.setPendingShape({ start: toolStore.pendingShape.start, end: pos })
      }
      return
    }

    if (!isDrawing) return
    if (tool === 'fill' || tool === 'eyedropper') return
    applyTool(e.clientX, e.clientY)
  }

  function stopDrawing(e: PointerEvent): void {
    if (isDrawing) {
      isDrawing = false
      lastPos = null
      canvasRef.value?.releasePointerCapture(e.pointerId)
    }
  }

  function onContextMenu(e: MouseEvent) {
    // Right-click cancels pending shape
    if (toolStore.activeTool === 'shape' && toolStore.pendingShape) {
      e.preventDefault()
      toolStore.setPendingShape(null)
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    // Escape cancels pending shape
    if (e.key === 'Escape' && toolStore.activeTool === 'shape' && toolStore.pendingShape) {
      e.preventDefault()
      e.stopPropagation()
      toolStore.setPendingShape(null)
    }
  }

  function onMouseLeave() {
    toolStore.setHoverPosition(null)
  }

  function attach() {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', stopDrawing)
    canvas.addEventListener('pointercancel', stopDrawing)
    canvas.addEventListener('contextmenu', onContextMenu)
    canvas.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('keydown', onKeyDown)
  }

  function detach() {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', stopDrawing)
    canvas.removeEventListener('pointercancel', stopDrawing)
    canvas.removeEventListener('contextmenu', onContextMenu)
    canvas.removeEventListener('mouseleave', onMouseLeave)
    document.removeEventListener('keydown', onKeyDown)
  }

  return { attach, detach }
}

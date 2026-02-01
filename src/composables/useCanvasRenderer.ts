import { watch, type Ref, type WatchStopHandle } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToolStore } from '@/stores/toolStore'
import { usePaletteStore } from '@/stores/paletteStore'
import { bresenhamLine } from '@/utils/bresenham'
import { rectOutline, rectFilled, ellipseOutline, ellipseFilled, constrainToSquare } from '@/utils/shapes'
import { getBrushOffsets } from '@/utils/brush'
import { drawCheckerboard } from '@/utils/checkerboard'

export function useCanvasRenderer(canvasRef: Ref<HTMLCanvasElement | null>) {
  const canvasStore = useCanvasStore()
  const settings = useSettingsStore()
  const toolStore = useToolStore()
  const paletteStore = usePaletteStore()

  let offscreen: OffscreenCanvas | null = null
  let rafId = 0
  let needsRender = true

  function scheduleRender() {
    needsRender = true
    if (!rafId) {
      rafId = requestAnimationFrame(render)
    }
  }

  function render() {
    rafId = 0
    if (!needsRender) return
    needsRender = false

    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const displayWidth = canvas.clientWidth
    const displayHeight = canvas.clientHeight

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    const zoom = settings.zoom
    const panX = settings.panX
    const panY = settings.panY
    const imgW = canvasStore.width
    const imgH = canvasStore.height

    // Draw checkerboard background (sized in image pixels, scales with zoom)
    if (settings.backgroundEnabled) {
      drawCheckerboard(ctx, {
        x: panX,
        y: panY,
        width: imgW * zoom,
        height: imgH * zoom,
        checkerSize: settings.checkerSize * zoom,
      })
    }

    // Render image pixels via offscreen canvas
    if (!offscreen || offscreen.width !== imgW || offscreen.height !== imgH) {
      offscreen = new OffscreenCanvas(imgW, imgH)
    }
    const offCtx = offscreen.getContext('2d')!
    const imageData = new ImageData(new Uint8ClampedArray(canvasStore.pixels), imgW, imgH)
    offCtx.putImageData(imageData, 0, 0)

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(offscreen, panX, panY, imgW * zoom, imgH * zoom)

    // Draw shape preview overlay
    if (toolStore.pendingShape) {
      const pending = toolStore.pendingShape
      const color = paletteStore.selectedColor
      const cssColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`

      let end = pending.end
      if (toolStore.shapeConstrain && toolStore.shapeType !== 'line') {
        end = constrainToSquare(pending.start, end)
      }

      const shapePixels: { x: number; y: number }[] = []
      const collect = (x: number, y: number) => shapePixels.push({ x, y })

      switch (toolStore.shapeType) {
        case 'line':
          bresenhamLine(pending.start, end, collect)
          break
        case 'rect':
          if (toolStore.shapeFilled) {
            rectFilled(pending.start, end, collect)
          } else {
            rectOutline(pending.start, end, collect)
          }
          break
        case 'ellipse':
          if (toolStore.shapeFilled) {
            ellipseFilled(pending.start, end, collect)
          } else {
            ellipseOutline(pending.start, end, collect)
          }
          break
      }

      ctx.fillStyle = cssColor
      for (const p of shapePixels) {
        if (p.x < 0 || p.x >= imgW || p.y < 0 || p.y >= imgH) continue
        ctx.fillRect(panX + p.x * zoom, panY + p.y * zoom, zoom, zoom)
      }
    }

    // Draw grid overlay
    if (settings.gridVisible && zoom >= 4) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      for (let x = 0; x <= imgW; x++) {
        const px = panX + x * zoom
        ctx.moveTo(px, panY)
        ctx.lineTo(px, panY + imgH * zoom)
      }
      for (let y = 0; y <= imgH; y++) {
        const py = panY + y * zoom
        ctx.moveTo(panX, py)
        ctx.lineTo(panX + imgW * zoom, py)
      }
      ctx.stroke()
    }

    // Draw hover pixel highlight (only for pencil and eraser tools)
    if (toolStore.hoverPosition && (toolStore.activeTool === 'pencil' || toolStore.activeTool === 'eraser')) {
      const symmetryPoints = toolStore.getSymmetryPoints(
        toolStore.hoverPosition.x,
        toolStore.hoverPosition.y,
        imgW,
        imgH
      )
      const brushOffsets = getBrushOffsets(toolStore.brushShape, toolStore.brushSize)
      const color = paletteStore.selectedColor
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
      for (const sp of symmetryPoints) {
        for (const offset of brushOffsets) {
          const px = sp.x + offset.x
          const py = sp.y + offset.y
          if (px < 0 || px >= imgW || py < 0 || py >= imgH) continue
          ctx.fillRect(panX + px * zoom, panY + py * zoom, zoom, zoom)
        }
      }
    }

    // Draw replace tool preview - highlight all matching pixels with blue tint
    if (toolStore.activeTool === 'replace' && toolStore.hoverPosition) {
      const hoverColor = canvasStore.getPixel(toolStore.hoverPosition.x, toolStore.hoverPosition.y)
      
      // Only show preview if we have a valid pixel
      if (hoverColor.a > 0 || toolStore.replaceIgnoreAlpha) {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.4)' // Semi-transparent blue
        
        // Iterate through all pixels and highlight matches
        for (let y = 0; y < imgH; y++) {
          for (let x = 0; x < imgW; x++) {
            const pixel = canvasStore.getPixel(x, y)
            
            // Check if this pixel matches the hover color
            const rgbMatches = pixel.r === hoverColor.r && pixel.g === hoverColor.g && pixel.b === hoverColor.b
            const alphaMatches = toolStore.replaceIgnoreAlpha || pixel.a === hoverColor.a
            
            if (rgbMatches && alphaMatches) {
              ctx.fillRect(panX + x * zoom, panY + y * zoom, zoom, zoom)
            }
          }
        }
      }
    }
  }

  const stopWatch: WatchStopHandle = watch(
    () => [
      canvasStore.version,
      settings.zoom,
      settings.panX,
      settings.panY,
      settings.gridVisible,
      settings.backgroundEnabled,
      settings.checkerSize,
      toolStore.activeTool,
      toolStore.pendingShape,
      toolStore.shapeType,
      toolStore.shapeFilled,
      toolStore.shapeConstrain,
      toolStore.hoverPosition,
      toolStore.symmetryHorizontal,
      toolStore.symmetryVertical,
      toolStore.brushSize,
      toolStore.brushShape,
      toolStore.replaceIgnoreAlpha,
      paletteStore.selectedColor,
    ],
    scheduleRender,
  )

  function handleResize() {
    scheduleRender()
  }

  function stop() {
    stopWatch()
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  return { scheduleRender, handleResize, stop }
}

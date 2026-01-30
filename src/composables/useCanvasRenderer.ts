import { watch, type Ref, type WatchStopHandle } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToolStore } from '@/stores/toolStore'
import { usePaletteStore } from '@/stores/paletteStore'
import { bresenhamLine } from '@/utils/bresenham'
import { rectOutline, rectFilled, ellipseOutline, ellipseFilled, constrainToSquare } from '@/utils/shapes'

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
      const checker = settings.checkerSize
      const screenChecker = checker * zoom
      const cols = Math.ceil(imgW / checker)
      const rows = Math.ceil(imgH / checker)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const isLight = ((col + row) % 2) === 0
          ctx.fillStyle = isLight ? '#ffffff' : '#e0e0e0'
          const sx = panX + col * screenChecker
          const sy = panY + row * screenChecker
          const sw = Math.min(screenChecker, panX + imgW * zoom - sx)
          const sh = Math.min(screenChecker, panY + imgH * zoom - sy)
          ctx.fillRect(sx, sy, sw, sh)
        }
      }
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

    // Draw hover pixel highlight
    if (toolStore.hoverPosition) {
      const points = toolStore.getSymmetryPoints(
        toolStore.hoverPosition.x,
        toolStore.hoverPosition.y,
        imgW,
        imgH
      )
      const color = paletteStore.selectedColor
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
      for (const p of points) {
        if (p.x < 0 || p.x >= imgW || p.y < 0 || p.y >= imgH) continue
        ctx.fillRect(panX + p.x * zoom, panY + p.y * zoom, zoom, zoom)
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
      toolStore.pendingShape,
      toolStore.shapeType,
      toolStore.shapeFilled,
      toolStore.shapeConstrain,
      toolStore.hoverPosition,
      toolStore.symmetryHorizontal,
      toolStore.symmetryVertical,
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

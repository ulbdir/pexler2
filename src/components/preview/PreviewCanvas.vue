<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { drawCheckerboard } from '@/utils/checkerboard'

const canvasStore = useCanvasStore()
const settings = useSettingsStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
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

  const imgW = canvasStore.width
  const imgH = canvasStore.height
  const zoom = settings.previewZoom

  // Calculate tile counts
  const tilesX = settings.previewRepeatX ? 3 : 1
  const tilesY = settings.previewRepeatY ? 3 : 1

  // Calculate canvas size based on zoom and tiles
  const scaledW = imgW * zoom
  const scaledH = imgH * zoom
  const totalW = scaledW * tilesX
  const totalH = scaledH * tilesY

  // Set canvas size
  const dpr = window.devicePixelRatio || 1
  canvas.width = totalW * dpr
  canvas.height = totalH * dpr
  canvas.style.width = `${totalW}px`
  canvas.style.height = `${totalH}px`

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, totalW, totalH)

  // Draw checkerboard background
  if (settings.backgroundEnabled) {
    drawCheckerboard(ctx, {
      x: 0,
      y: 0,
      width: totalW,
      height: totalH,
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

  // Draw tiles
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const x = tx * scaledW
      const y = ty * scaledH
      ctx.drawImage(offscreen, x, y, scaledW, scaledH)
    }
  }
}

const stopWatch = watch(
  () => [
    canvasStore.version,
    canvasStore.width,
    canvasStore.height,
    settings.previewZoom,
    settings.previewRepeatX,
    settings.previewRepeatY,
    settings.backgroundEnabled,
    settings.checkerSize,
  ],
  scheduleRender,
)

onMounted(() => {
  scheduleRender()
})

onUnmounted(() => {
  stopWatch()
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="block" />
</template>

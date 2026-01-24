<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCanvasRenderer } from '@/composables/useCanvasRenderer'
import { useCanvasInteraction } from '@/composables/useCanvasInteraction'
import { useDrawingTools } from '@/composables/useDrawingTools'
import { useSettingsStore } from '@/stores/settingsStore'
import { useCanvasStore } from '@/stores/canvasStore'

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const settings = useSettingsStore()
const canvasStore = useCanvasStore()

const { scheduleRender, handleResize, stop } = useCanvasRenderer(canvasRef)
const { attach: attachInteraction, detach: detachInteraction } = useCanvasInteraction(canvasRef)
const { attach: attachDrawing, detach: detachDrawing } = useDrawingTools(canvasRef)

let resizeObserver: ResizeObserver | null = null
let initialViewSet = false

onMounted(() => {
  attachInteraction()
  attachDrawing()

  resizeObserver = new ResizeObserver(() => {
    handleResize()
    if (!initialViewSet && containerRef.value) {
      initialViewSet = true
      settings.resetView(
        canvasStore.width,
        canvasStore.height,
        containerRef.value.clientWidth,
        containerRef.value.clientHeight
      )
    }
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  scheduleRender()
})

onUnmounted(() => {
  detachInteraction()
  detachDrawing()
  stop()
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full relative bg-surface bg-[length:12px_12px] bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04)_0px,rgba(0,0,0,0.04)_1px,transparent_1px,transparent_50%)]">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full"
      style="touch-action: none;"
    />
  </div>
</template>

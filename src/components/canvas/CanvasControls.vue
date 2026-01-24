<script setup lang="ts">
import { ZoomIn, ZoomOut, Maximize, Grid3x3 } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settingsStore'
import { useCanvasStore } from '@/stores/canvasStore'

const settings = useSettingsStore()
const canvasStore = useCanvasStore()

function zoomIn() {
  settings.zoom = Math.min(64, Math.round(settings.zoom * 1.5))
}

function zoomOut() {
  settings.zoom = Math.max(1, Math.round(settings.zoom / 1.5))
}

function resetView() {
  const container = document.querySelector('main')
  if (container) {
    settings.resetView(
      canvasStore.width,
      canvasStore.height,
      container.clientWidth,
      container.clientHeight
    )
  }
}

function toggleGrid() {
  settings.gridVisible = !settings.gridVisible
}
</script>

<template>
  <div class="absolute bottom-3 right-3 flex gap-1">
    <button
      class="w-8 h-8 flex items-center justify-center bg-surface-panel border border-edge rounded hover:bg-hover"
      title="Reset view"
      @click="resetView"
    >
      <Maximize class="w-4 h-4 text-foreground-secondary" />
    </button>
    <button
      class="w-8 h-8 flex items-center justify-center bg-surface-panel border border-edge rounded hover:bg-hover"
      title="Zoom in"
      @click="zoomIn"
    >
      <ZoomIn class="w-4 h-4 text-foreground-secondary" />
    </button>
    <button
      class="w-8 h-8 flex items-center justify-center bg-surface-panel border border-edge rounded hover:bg-hover"
      title="Zoom out"
      @click="zoomOut"
    >
      <ZoomOut class="w-4 h-4 text-foreground-secondary" />
    </button>
    <button
      class="w-8 h-8 flex items-center justify-center border border-edge rounded hover:bg-hover"
      :class="settings.gridVisible ? 'bg-surface-active' : 'bg-surface-panel'"
      title="Toggle grid"
      @click="toggleGrid"
    >
      <Grid3x3 class="w-4 h-4 text-foreground-secondary" />
    </button>
  </div>
</template>

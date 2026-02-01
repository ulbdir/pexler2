<script setup lang="ts">
import PixelCanvas from '@/components/canvas/PixelCanvas.vue'
import CanvasControls from '@/components/canvas/CanvasControls.vue'
import PreviewWindow from '@/components/preview/PreviewWindow.vue'
</script>

<template>
  <main class="bg-surface relative overflow-hidden">
    <PixelCanvas />
    <CanvasControls />
    <PreviewWindow />
  </main>
</template>

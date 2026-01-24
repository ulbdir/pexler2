<script setup lang="ts">
import PixelCanvas from '@/components/canvas/PixelCanvas.vue'
import CanvasControls from '@/components/canvas/CanvasControls.vue'
</script>

<template>
  <main class="bg-surface relative overflow-hidden">
    <PixelCanvas />
    <CanvasControls />
  </main>
</template>

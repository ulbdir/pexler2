<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import ToolSidebar from './components/layout/ToolSidebar.vue'
import PaletteSidebar from './components/layout/PaletteSidebar.vue'
import CanvasArea from './components/layout/CanvasArea.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

useKeyboardShortcuts()
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] w-full h-full">
    <AppHeader />
    <div class="grid grid-cols-[auto_1fr_auto] min-h-0 bg-surface gap-0">
      <ToolSidebar />
      <CanvasArea />
      <PaletteSidebar />
    </div>
  </div>
</template>

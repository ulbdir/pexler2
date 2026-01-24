<script setup lang="ts">
import { Pencil, Eraser, PaintBucket, Pipette } from 'lucide-vue-next'
import ToolButton from './ToolButton.vue'
</script>

<template>
  <div>
    <h2 class="text-xs font-semibold text-foreground-secondary mb-2">Werkzeuge</h2>
    <div class="grid grid-cols-2 gap-1">
      <ToolButton tool="pencil" title="Pencil (P)">
        <Pencil class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="eraser" title="Eraser (E)">
        <Eraser class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="fill" title="Fill (G)">
        <PaintBucket class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="eyedropper" title="Eyedropper (I)">
        <Pipette class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
    </div>
  </div>
</template>

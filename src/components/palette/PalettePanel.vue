<script setup lang="ts">
import { usePaletteStore } from '@/stores/paletteStore'
import SelectedColor from './SelectedColor.vue'
import ColorSwatch from './ColorSwatch.vue'

const paletteStore = usePaletteStore()
</script>

<template>
  <div>
    <h2 class="text-xs font-semibold text-foreground-secondary mb-2">Farbpalette</h2>
    <SelectedColor />
    <div class="grid grid-cols-6 gap-0.5">
      <ColorSwatch
        v-for="(color, index) in paletteStore.colors"
        :key="`${color.r}-${color.g}-${color.b}-${color.a}-${index}`"
        :color="color"
        :index="index"
      />
    </div>
  </div>
</template>

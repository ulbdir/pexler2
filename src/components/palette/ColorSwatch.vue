<script setup lang="ts">
import { computed } from 'vue'
import { rgbaToCss } from '@/utils/colorUtils'
import { usePaletteStore } from '@/stores/paletteStore'
import type { RGBA } from '@/types'

const props = defineProps<{
  color: RGBA
  index: number
}>()

const paletteStore = usePaletteStore()

const cssColor = computed(() => rgbaToCss(props.color))
const isSelected = computed(() => {
  const s = paletteStore.selectedColor
  return s.r === props.color.r && s.g === props.color.g && s.b === props.color.b && s.a === props.color.a
})

function select() {
  paletteStore.selectedColor = { ...props.color }
}
</script>

<template>
  <button
    class="w-5 h-5 rounded-sm border transition-transform"
    :class="isSelected ? 'border-edge-emphasis scale-125 z-10' : 'border-edge hover:scale-110'"
    :style="{ backgroundColor: cssColor }"
    :title="cssColor"
    @click="select"
  />
</template>

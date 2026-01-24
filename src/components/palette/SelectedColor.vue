<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { usePaletteStore } from '@/stores/paletteStore'
import { rgbaToCss, rgbaToHex } from '@/utils/colorUtils'
import Pickr from '@simonwep/pickr'
import '@simonwep/pickr/dist/themes/monolith.min.css'

const paletteStore = usePaletteStore()
const pickrContainer = ref<HTMLElement | null>(null)
let pickrInstance: Pickr | null = null
let updatingFromStore = false
let updatingFromPickr = false

const hexColor = computed(() => rgbaToHex(paletteStore.selectedColor))

onMounted(() => {
  if (!pickrContainer.value) return

  pickrInstance = Pickr.create({
    el: pickrContainer.value,
    theme: 'monolith',
    default: rgbaToCss(paletteStore.selectedColor),
    defaultRepresentation: 'HEXA',
    components: {
      preview: true,
      opacity: true,
      hue: true,
      interaction: {
        hex: true,
        rgba: true,
        input: true,
      },
    },
  })

  pickrInstance.on('change', (color: Pickr.HSVaColor) => {
    if (updatingFromStore) return
    const [r = 0, g = 0, b = 0, a = 1] = color.toRGBA()
    updatingFromPickr = true
    paletteStore.selectedColor = {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      a: Math.round(a * 255),
    }
    pickrInstance!.applyColor()
    updatingFromPickr = false
  })
})

watch(() => paletteStore.selectedColor, (newColor) => {
  if (!pickrInstance || updatingFromPickr) return
  updatingFromStore = true
  try {
    pickrInstance.setColor(rgbaToCss(newColor), true)
    pickrInstance.applyColor()
  } finally {
    updatingFromStore = false
  }
}, { deep: true })

onBeforeUnmount(() => {
  pickrInstance?.destroyAndRemove()
})
</script>

<template>
  <div class="flex items-center gap-2 mb-2">
    <div ref="pickrContainer" />
    <span class="text-[9px] text-foreground-muted font-mono">{{ hexColor }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
} from 'radix-vue'
import { Check } from 'lucide-vue-next'
import { usePaletteStore } from '@/stores/paletteStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { useImageIO } from '@/composables/useImageIO'

const paletteStore = usePaletteStore()
const canvasStore = useCanvasStore()
const { savePalette, loadPalette } = useImageIO()

const fileInputRef = ref<HTMLInputElement | null>(null)

function onLoadClick() {
  fileInputRef.value?.click()
}

async function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    await loadPalette(file)
    ;(e.target as HTMLInputElement).value = ''
  }
}

function extractFromImage() {
  paletteStore.extractFromImage(canvasStore.pixels, canvasStore.width, canvasStore.height)
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="px-3 py-1 text-sm text-foreground-secondary hover:bg-hover-emphasis rounded cursor-pointer"
    >
      Farbpalette
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[180px] bg-surface-overlay border border-edge rounded shadow-md py-1 z-50"
        :side-offset="4"
      >
        <DropdownMenuItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="onLoadClick"
        >
          Palette laden
        </DropdownMenuItem>
        <DropdownMenuItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="savePalette"
        >
          Palette speichern
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-px bg-surface-active my-1" />
        <DropdownMenuItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="paletteStore.clearPalette()"
        >
          Palette leeren
        </DropdownMenuItem>
        <DropdownMenuItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="extractFromImage"
        >
          Aus Bild extrahieren
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-px bg-surface-active my-1" />
        <DropdownMenuCheckboxItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          :checked="paletteStore.autoAdd"
          @update:checked="paletteStore.autoAdd = $event"
        >
          <DropdownMenuItemIndicator>
            <Check class="w-3 h-3" />
          </DropdownMenuItemIndicator>
          Farben auto-hinzufügen
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>

  <input
    ref="fileInputRef"
    type="file"
    accept=".json"
    class="hidden"
    @change="onFileSelected"
  />
</template>

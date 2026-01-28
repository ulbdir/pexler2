<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
} from 'radix-vue'
import { Check, ChevronDown } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { usePaletteStore } from '@/stores/paletteStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { useImageIO } from '@/composables/useImageIO'

const { t } = useI18n()
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
      class="flex items-center gap-1 px-3 py-1 text-sm text-foreground-secondary hover:bg-hover-emphasis rounded cursor-pointer"
    >
      {{ t('menu.palette') }}
      <ChevronDown class="w-3.5 h-3.5" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[180px] bg-surface-overlay border border-edge rounded shadow-md py-1 z-50"
        :side-offset="4"
      >
        <DropdownMenuItem
          class="pl-8 pr-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="onLoadClick"
        >
          {{ t('menu.palette.load') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="pl-8 pr-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="savePalette"
        >
          {{ t('menu.palette.save') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-px bg-surface-active my-1" />
        <DropdownMenuItem
          class="pl-8 pr-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="paletteStore.clearPalette()"
        >
          {{ t('menu.palette.clear') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="pl-8 pr-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="extractFromImage"
        >
          {{ t('menu.palette.extractFromImage') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-px bg-surface-active my-1" />
        <DropdownMenuCheckboxItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          :checked="paletteStore.autoAdd"
          @update:checked="paletteStore.autoAdd = $event"
        >
          <span class="w-3 h-3 flex items-center justify-center border border-foreground-muted rounded-sm">
            <Check v-if="paletteStore.autoAdd" class="w-2.5 h-2.5" />
          </span>
          {{ t('menu.palette.autoAdd') }}
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

<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from 'radix-vue'
import {
  ChevronDown,
  FilePlus,
  FolderOpen,
  Download,
  FlipHorizontal2,
  FlipVertical2,
  RotateCw,
  RotateCcw,
} from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useImageIO } from '@/composables/useImageIO'
import { useCanvasTransform } from '@/composables/useCanvasTransform'
import NewCanvasDialog from '@/components/dialogs/NewCanvasDialog.vue'

const { t } = useI18n()
const { exportPNG, loadImage } = useImageIO()
const { flipHorizontal, flipVertical, rotate90, rotate180, rotate270 } = useCanvasTransform()
const fileInputRef = ref<HTMLInputElement | null>(null)
const showNewDialog = ref(false)

function onLoadClick() {
  fileInputRef.value?.click()
}

async function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    await loadImage(file)
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex items-center gap-1 px-3 py-1 text-sm text-foreground-secondary hover:bg-hover-emphasis rounded cursor-pointer"
    >
      {{ t('menu.image') }}
      <ChevronDown class="w-3.5 h-3.5" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[160px] bg-surface-overlay border border-edge rounded shadow-md py-1 z-50"
        :side-offset="4"
      >
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="showNewDialog = true"
        >
          <FilePlus class="w-4 h-4" />
          {{ t('menu.image.new') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="onLoadClick"
        >
          <FolderOpen class="w-4 h-4" />
          {{ t('menu.image.load') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="exportPNG"
        >
          <Download class="w-4 h-4" />
          {{ t('menu.image.save') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-px bg-edge my-1" />
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="flipHorizontal"
        >
          <FlipHorizontal2 class="w-4 h-4" />
          {{ t('menu.image.flipH') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="flipVertical"
        >
          <FlipVertical2 class="w-4 h-4" />
          {{ t('menu.image.flipV') }}
        </DropdownMenuItem>
        <DropdownMenuSeparator class="h-px bg-edge my-1" />
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="rotate90"
        >
          <RotateCw class="w-4 h-4" />
          {{ t('menu.image.rotate90') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="rotate180"
        >
          <RotateCw class="w-4 h-4 rotate-90" />
          {{ t('menu.image.rotate180') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="rotate270"
        >
          <RotateCcw class="w-4 h-4" />
          {{ t('menu.image.rotate270') }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>

  <input
    ref="fileInputRef"
    type="file"
    accept="image/*"
    class="hidden"
    @change="onFileSelected"
  />

  <NewCanvasDialog v-model:open="showNewDialog" />
</template>

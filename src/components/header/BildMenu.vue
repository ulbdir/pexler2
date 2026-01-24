<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useImageIO } from '@/composables/useImageIO'
import NewCanvasDialog from '@/components/dialogs/NewCanvasDialog.vue'

const { t } = useI18n()
const { exportPNG, loadImage } = useImageIO()
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
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="showNewDialog = true"
        >
          {{ t('menu.image.new') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="onLoadClick"
        >
          {{ t('menu.image.load') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none"
          @select="exportPNG"
        >
          {{ t('menu.image.save') }}
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

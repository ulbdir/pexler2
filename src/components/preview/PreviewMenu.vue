<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
} from 'radix-vue'
import { Menu, Check, Circle } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import { computed } from 'vue'

const { t } = useI18n()
const settings = useSettingsStore()

const zoomValue = computed({
  get: () => String(settings.previewZoom),
  set: (val) => {
    const n = Number(val)
    if (n === 1 || n === 2 || n === 4) {
      settings.previewZoom = n
    }
  },
})
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="w-6 h-6 flex items-center justify-center hover:bg-hover rounded cursor-pointer"
      :title="t('preview.options')"
    >
      <Menu class="w-3.5 h-3.5 text-foreground-secondary" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[160px] bg-surface-overlay border border-edge rounded shadow-md py-1 z-[100]"
        :side-offset="4"
        align="end"
      >
        <DropdownMenuRadioGroup v-model="zoomValue">
          <DropdownMenuRadioItem
            value="1"
            class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          >
            <span class="w-3 h-3 flex items-center justify-center">
              <Circle v-if="zoomValue === '1'" class="w-2 h-2 fill-current" />
            </span>
            {{ t('preview.zoom1') }}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="2"
            class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          >
            <span class="w-3 h-3 flex items-center justify-center">
              <Circle v-if="zoomValue === '2'" class="w-2 h-2 fill-current" />
            </span>
            {{ t('preview.zoom2') }}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="4"
            class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          >
            <span class="w-3 h-3 flex items-center justify-center">
              <Circle v-if="zoomValue === '4'" class="w-2 h-2 fill-current" />
            </span>
            {{ t('preview.zoom4') }}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator class="h-px bg-edge my-1" />
        <DropdownMenuCheckboxItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          :checked="settings.previewRepeatX"
          @update:checked="settings.previewRepeatX = $event"
        >
          <span class="w-3 h-3 flex items-center justify-center border border-foreground-muted rounded-sm">
            <Check v-if="settings.previewRepeatX" class="w-2.5 h-2.5" />
          </span>
          {{ t('preview.repeatHorizontal') }}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          class="px-3 py-1.5 text-sm text-foreground hover:bg-hover cursor-pointer outline-none flex items-center gap-2"
          :checked="settings.previewRepeatY"
          @update:checked="settings.previewRepeatY = $event"
        >
          <span class="w-3 h-3 flex items-center justify-center border border-foreground-muted rounded-sm">
            <Check v-if="settings.previewRepeatY" class="w-2.5 h-2.5" />
          </span>
          {{ t('preview.repeatVertical') }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

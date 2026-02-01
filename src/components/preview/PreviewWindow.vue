<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import PreviewCanvas from './PreviewCanvas.vue'
import PreviewMenu from './PreviewMenu.vue'

const { t } = useI18n()
const settings = useSettingsStore()

const MIN_WIDTH = 140
const MIN_HEIGHT = 80

const windowRef = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragTarget = ref<HTMLElement | null>(null)
const resizeTarget = ref<HTMLElement | null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

function getContainerBounds() {
  const container = windowRef.value?.parentElement
  if (!container) return { width: window.innerWidth, height: window.innerHeight }
  return { width: container.clientWidth, height: container.clientHeight }
}

// Dragging
function onTitlePointerDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('button')) return
  
  e.preventDefault()
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - settings.previewPosition.x,
    y: e.clientY - settings.previewPosition.y,
  }
  dragTarget.value = e.currentTarget as HTMLElement
  dragTarget.value.setPointerCapture(e.pointerId)
}

function onTitlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  
  const newX = e.clientX - dragOffset.value.x
  const newY = e.clientY - dragOffset.value.y
  
  // Constrain to parent container (canvas area)
  const bounds = getContainerBounds()
  const windowWidth = settings.previewSize.width
  const windowHeight = settings.previewSize.height
  
  // Keep at least 50px visible on each edge
  const margin = 10
  const maxX = bounds.width - windowWidth - margin
  const maxY = bounds.height - windowHeight - margin
  
  settings.previewPosition = {
    x: Math.max(margin, Math.min(maxX, newX)),
    y: Math.max(margin, Math.min(maxY, newY)),
  }
}

function onTitlePointerUp(e: PointerEvent) {
  isDragging.value = false
  dragTarget.value?.releasePointerCapture(e.pointerId)
  dragTarget.value = null
}

// Resizing
function onResizePointerDown(e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: settings.previewSize.width,
    height: settings.previewSize.height,
  }
  resizeTarget.value = e.currentTarget as HTMLElement
  resizeTarget.value.setPointerCapture(e.pointerId)
}

function onResizePointerMove(e: PointerEvent) {
  if (!isResizing.value) return
  
  const deltaX = e.clientX - resizeStart.value.x
  const deltaY = e.clientY - resizeStart.value.y
  
  // Constrain to container bounds
  const bounds = getContainerBounds()
  const margin = 10
  const maxWidth = bounds.width - settings.previewPosition.x - margin
  const maxHeight = bounds.height - settings.previewPosition.y - margin
  
  const newWidth = Math.max(MIN_WIDTH, Math.min(maxWidth, resizeStart.value.width + deltaX))
  const newHeight = Math.max(MIN_HEIGHT, Math.min(maxHeight, resizeStart.value.height + deltaY))
  
  settings.previewSize = { width: newWidth, height: newHeight }
}

function onResizePointerUp(e: PointerEvent) {
  isResizing.value = false
  resizeTarget.value?.releasePointerCapture(e.pointerId)
  resizeTarget.value = null
}

function closeWindow() {
  settings.previewVisible = false
}

function constrainToContainer() {
  const bounds = getContainerBounds()
  const margin = 10
  
  // Constrain size first
  const maxWidth = bounds.width - margin * 2
  const maxHeight = bounds.height - margin * 2
  const newWidth = Math.max(MIN_WIDTH, Math.min(maxWidth, settings.previewSize.width))
  const newHeight = Math.max(MIN_HEIGHT, Math.min(maxHeight, settings.previewSize.height))
  
  if (newWidth !== settings.previewSize.width || newHeight !== settings.previewSize.height) {
    settings.previewSize = { width: newWidth, height: newHeight }
  }
  
  // Then constrain position
  const maxX = bounds.width - settings.previewSize.width - margin
  const maxY = bounds.height - settings.previewSize.height - margin
  const newX = Math.max(margin, Math.min(maxX, settings.previewPosition.x))
  const newY = Math.max(margin, Math.min(maxY, settings.previewPosition.y))
  
  if (newX !== settings.previewPosition.x || newY !== settings.previewPosition.y) {
    settings.previewPosition = { x: newX, y: newY }
  }
}

// Re-constrain when container resizes (e.g., browser window resize)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (windowRef.value) {
    windowRef.value.style.width = `${settings.previewSize.width}px`
    windowRef.value.style.height = `${settings.previewSize.height}px`
    
    // Ensure window is within bounds on load
    constrainToContainer()
    
    // Watch for container resize
    const container = windowRef.value.parentElement
    if (container) {
      resizeObserver = new ResizeObserver(() => {
        constrainToContainer()
      })
      resizeObserver.observe(container)
    }
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

// Also constrain when visibility changes (window might have been hidden during resize)
watch(() => settings.previewVisible, (visible) => {
  if (visible) {
    // Use nextTick via setTimeout to ensure DOM is updated
    setTimeout(constrainToContainer, 0)
  }
})
</script>

<template>
  <div
    v-if="settings.previewVisible"
    ref="windowRef"
    class="absolute bg-surface-panel border-2 border-edge rounded-lg shadow-lg overflow-hidden flex flex-col z-40"
    :style="{
      left: `${settings.previewPosition.x}px`,
      top: `${settings.previewPosition.y}px`,
      width: `${settings.previewSize.width}px`,
      height: `${settings.previewSize.height}px`,
      minWidth: `${MIN_WIDTH}px`,
      minHeight: `${MIN_HEIGHT}px`,
    }"
  >
    <!-- Title bar -->
    <div
      class="flex items-center justify-between px-2 py-1 bg-surface-active border-b border-edge cursor-move select-none shrink-0"
      @pointerdown="onTitlePointerDown"
      @pointermove="onTitlePointerMove"
      @pointerup="onTitlePointerUp"
    >
      <span class="text-xs font-medium text-foreground-secondary">
        {{ t('preview.title') }}
      </span>
      <div class="flex items-center gap-1">
        <PreviewMenu />
        <button
          class="w-6 h-6 flex items-center justify-center hover:bg-hover rounded"
          :title="t('preview.close')"
          @click="closeWindow"
        >
          <X class="w-3.5 h-3.5 text-foreground-secondary" />
        </button>
      </div>
    </div>
    
    <!-- Canvas area -->
    <div class="flex-1 overflow-hidden bg-surface flex items-center justify-center">
      <PreviewCanvas />
    </div>

    <!-- Resize handle -->
    <div
      class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
      @pointerdown="onResizePointerDown"
      @pointermove="onResizePointerMove"
      @pointerup="onResizePointerUp"
    >
      <svg class="w-full h-full text-foreground-muted" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z" />
      </svg>
    </div>
  </div>
</template>

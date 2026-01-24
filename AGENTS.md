# AGENTS.md

## Build & Development Commands

### Primary Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check + production build 
- `npm run preview` - Preview production build
- `npm run lint` - ESLint + TypeScript type check
- `npm run test` - Run all unit tests once
- `npm run test:watch` - Run tests in watch mode

### Single Test Execution
- `npx vitest run path/to/specific.test.ts` - Run single test file
- `npx vitest run --reporter=verbose` - Detailed output
- `npx vitest run --grep "test name"` - Run specific tests by name pattern

## Code Style Guidelines

### Import Organization
```typescript
// External libraries first
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'

// Internal imports with @ alias
import { useCanvasStore } from '@/stores/canvasStore'
import type { RGBA, Point } from '@/types'
```

- External libraries grouped separately from internal imports
- Use `@/` alias for all internal imports
- Type-only imports: `import type { ... }`
- Named imports preferred over defaults

### TypeScript Patterns
- Strict mode enabled with `noUncheckedIndexedAccess: true`
- Use type-only imports for types only
- Explicit interfaces over type aliases where appropriate
- Non-null assertion (`!`) used sparingly for guaranteed non-null values
- Guard clauses for null/undefined handling

```typescript
export function screenToImage(
  canvasEl: HTMLCanvasElement | null,
  clientX: number,
  clientY: number
): Point | null {
  if (!canvasEl) return null
  // Implementation
}
```

### Vue 3 Composition API
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const store = useCanvasStore()

onMounted(() => {
  // Setup logic
})

onUnmounted(() => {
  // Cleanup logic
})
</script>
```

### Naming Conventions
- **Files**: `ComponentName.vue`, `utilName.ts`, `storeName.ts`, `useComposable.ts`
- **Variables/Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Error Handling
```typescript
// Preferred: Guard clauses and early returns
if (!canvasEl) return null
if (x < 0 || x >= width) return null

// Boundary checking in critical paths
function setPixel(x: number, y: number, color: RGBA) {
  if (x < 0 || x >= width || y < 0 || y >= height) return
  // Set pixel logic
}
```

- Guard clauses and early returns preferred
- Boundary checking in critical paths (canvas coordinates, array access)
- Minimal try-catch, rely on TypeScript compile-time checking
- Defensive programming in utility functions

### Testing Patterns
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCanvasStore } from '@/stores/canvasStore'

describe('utilityName', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should handle edge cases', () => {
    const store = useCanvasStore()
    expect(result).toBe(expected)
  })
})
```

- Vitest with jsdom environment
- Co-located test files (`*.test.ts` alongside source)
- Pinia setup with `createPinia` and `setActivePinia` for store tests
- Descriptive test names, comprehensive edge case coverage
- Nested `describe` blocks for logical grouping

### Performance Guidelines
- Use `Uint8ClampedArray` for pixel data manipulation
- OffscreenCanvas for rendering operations
- Direct array manipulation for performance-critical code
- Proper cleanup in Vue `onUnmounted` lifecycle
- Version counters to trigger re-renders instead of deep watching

```typescript
// Performance pattern for reactive pixel data
const pixels = ref(new Uint8ClampedArray(width * height * 4))
const version = ref(0)

function setPixel(x: number, y: number, color: RGBA) {
  const i = (y * width + x) * 4
  pixels.value[i] = color.r
  pixels.value[i + 1] = color.g
  pixels.value[i + 2] = color.b
  pixels.value[i + 3] = color.a
  version.value++ // Trigger reactivity
}
```

### State Management (Pinia)
```typescript
export const useStoreName = defineStore('store', () => {
  const state = ref(initialValue)
  const version = ref(0)
  
  function mutateState() {
    // Mutation logic
    version.value++ // Trigger reactivity
  }
  
  return { state, version, mutateState }
})
```

- Composition API style for stores
- Version-based reactivity for performance
- Direct mutations for performance-critical operations
- Immutable snapshots for history/undo functionality

## Architecture Notes

### Core Patterns
- **Pixel Data**: Stored as `Uint8ClampedArray` in RGBA format
- **Rendering**: OffscreenCanvas with `imageSmoothingEnabled: false` for crisp pixels
- **Drawing**: Bresenham line interpolation between pointer events
- **Reactivity**: Version-based pattern instead of deep watching for performance
- **Events**: Pointer Events API for unified mouse/touch handling
- **History**: Immutable snapshots with max 50 states for undo/redo

### Component Structure
- **Layout**: Fixed four-zone layout (Header, Left sidebar, Right sidebar, Main area)
- **Components**: Single responsibility, composition over inheritance
- **Composables**: Logic extracted into reusable composables
- **Styling**: Tailwind CSS v4 with custom beige theme

### Algorithms
- **Line Drawing**: Bresenham algorithm for straight lines
- **Flood Fill**: Stack-based 4-directional implementation
- **Color Conversion**: RGBA ↔ hex ↔ CSS utilities

## ESLint Configuration Notes
- Flat config format (`eslint.config.js`)
- TypeScript ESLint and Vue plugin
- Relaxed Vue stylistic rules (single-word components allowed)
- `no-undef` disabled for TypeScript files (TS handles this better)
- Custom rules for Vue formatting flexibility

## Dependencies & Tools
- **Build**: Vite 7, Vue 3.5+, TypeScript 5.9+
- **Testing**: Vitest + Vue Test Utils + jsdom
- **State**: Pinia 3+
- **UI**: Radix Vue, Tailwind CSS v4, Lucide icons
- **Path Alias**: `@/*` maps to `./src/*`

## Key Files to Understand
- `src/types/index.ts` - Core type definitions
- `src/stores/canvasStore.ts` - Pixel data management
- `src/composables/useCanvasInteraction.ts` - Zoom/pan handling
- `src/utils/floodFill.ts` - Flood fill algorithm
- `App.vue` - Main layout and routing
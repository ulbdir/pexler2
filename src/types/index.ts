export type ToolType = 'pencil' | 'eraser' | 'fill' | 'eyedropper' | 'replace' | 'shape'

export type ShapeType = 'line' | 'rect' | 'ellipse'

export type BlendMode = 'overwrite' | 'blend'

export type BrushShape = 'square' | 'circle'

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export interface Point {
  x: number
  y: number
}

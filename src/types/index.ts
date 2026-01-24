export type ToolType = 'pencil' | 'eraser' | 'fill' | 'eyedropper' | 'shape'

export type ShapeType = 'line' | 'rect' | 'ellipse'

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

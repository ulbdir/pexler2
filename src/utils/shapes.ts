import type { Point } from '@/types'

/**
 * Constrains an endpoint to form a square/circle by using the larger dimension.
 */
export function constrainToSquare(start: Point, end: Point): Point {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const size = Math.max(Math.abs(dx), Math.abs(dy))
  return {
    x: start.x + size * Math.sign(dx || 1),
    y: start.y + size * Math.sign(dy || 1),
  }
}

export function rectOutline(
  a: Point,
  b: Point,
  callback: (x: number, y: number) => void
): void {
  const x0 = Math.min(a.x, b.x)
  const y0 = Math.min(a.y, b.y)
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)

  // Degenerate: single pixel
  if (x0 === x1 && y0 === y1) {
    callback(x0, y0)
    return
  }

  // Degenerate: horizontal line
  if (y0 === y1) {
    for (let x = x0; x <= x1; x++) callback(x, y0)
    return
  }

  // Degenerate: vertical line
  if (x0 === x1) {
    for (let y = y0; y <= y1; y++) callback(x0, y)
    return
  }

  // Top and bottom rows
  for (let x = x0; x <= x1; x++) {
    callback(x, y0)
    callback(x, y1)
  }
  // Left and right sides (excluding corners)
  for (let y = y0 + 1; y < y1; y++) {
    callback(x0, y)
    callback(x1, y)
  }
}

export function rectFilled(
  a: Point,
  b: Point,
  callback: (x: number, y: number) => void
): void {
  const x0 = Math.min(a.x, b.x)
  const y0 = Math.min(a.y, b.y)
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      callback(x, y)
    }
  }
}

export function ellipseOutline(
  a: Point,
  b: Point,
  callback: (x: number, y: number) => void
): void {
  const x0 = Math.min(a.x, b.x)
  const y0 = Math.min(a.y, b.y)
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)

  const w = x1 - x0
  const h = y1 - y0

  // Degenerate cases
  if (w === 0 && h === 0) {
    callback(x0, y0)
    return
  }
  if (w === 0) {
    for (let y = y0; y <= y1; y++) callback(x0, y)
    return
  }
  if (h === 0) {
    for (let x = x0; x <= x1; x++) callback(x, y0)
    return
  }

  // Midpoint ellipse algorithm using bounding box
  // Based on: http://members.chello.at/~easyfilter/bresenham.html
  let a0 = w
  const b0 = h
  let b1 = b0 & 1
  let dx = 4 * (1 - a0) * b0 * b0
  let dy = 4 * (b1 + 1) * a0 * a0
  let err = dx + dy + b1 * a0 * a0

  let cy0 = y0 + Math.floor((h + 1) / 2)
  let cy1 = y0 + Math.floor(h / 2)
  let cx0 = x0
  let cx1 = x1

  a0 = 8 * a0 * a0
  b1 = 8 * b0 * b0

  do {
    callback(cx1, cy0)
    if (cx0 !== cx1) callback(cx0, cy0)
    if (cy0 !== cy1) {
      callback(cx0, cy1)
      if (cx0 !== cx1) callback(cx1, cy1)
    }
    const e2 = 2 * err
    if (e2 <= dy) {
      cy0++
      cy1--
      dy += a0
      err += dy
    }
    if (e2 >= dx || 2 * err > dy) {
      cx0++
      cx1--
      dx += b1
      err += dx
    }
  } while (cx0 <= cx1)

  // Finish vertical tips
  while (cy0 - cy1 <= h) {
    callback(cx0 - 1, cy0)
    callback(cx1 + 1, cy0)
    callback(cx0 - 1, cy1)
    callback(cx1 + 1, cy1)
    cy0++
    cy1--
  }
}

export function ellipseFilled(
  a: Point,
  b: Point,
  callback: (x: number, y: number) => void
): void {
  const x0 = Math.min(a.x, b.x)
  const y0 = Math.min(a.y, b.y)
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)

  const w = x1 - x0
  const h = y1 - y0

  // Degenerate cases
  if (w === 0 && h === 0) {
    callback(x0, y0)
    return
  }
  if (w === 0) {
    for (let y = y0; y <= y1; y++) callback(x0, y)
    return
  }
  if (h === 0) {
    for (let x = x0; x <= x1; x++) callback(x, y0)
    return
  }

  // Midpoint ellipse — fill scanlines between left and right edges
  let a0 = w
  const b0 = h
  let b1 = b0 & 1
  let dx = 4 * (1 - a0) * b0 * b0
  let dy = 4 * (b1 + 1) * a0 * a0
  let err = dx + dy + b1 * a0 * a0

  let cy0 = y0 + Math.floor((h + 1) / 2)
  let cy1 = y0 + Math.floor(h / 2)
  let cx0 = x0
  let cx1 = x1

  a0 = 8 * a0 * a0
  b1 = 8 * b0 * b0

  do {
    fillScanline(cx0, cx1, cy0, callback)
    if (cy0 !== cy1) {
      fillScanline(cx0, cx1, cy1, callback)
    }
    const e2 = 2 * err
    if (e2 <= dy) {
      cy0++
      cy1--
      dy += a0
      err += dy
    }
    if (e2 >= dx || 2 * err > dy) {
      cx0++
      cx1--
      dx += b1
      err += dx
    }
  } while (cx0 <= cx1)

  // Finish vertical tips
  while (cy0 - cy1 <= h) {
    callback(cx0 - 1, cy0)
    callback(cx1 + 1, cy0)
    if (cy0 !== cy1) {
      callback(cx0 - 1, cy1)
      callback(cx1 + 1, cy1)
    }
    cy0++
    cy1--
  }
}

function fillScanline(
  x0: number,
  x1: number,
  y: number,
  callback: (x: number, y: number) => void
): void {
  for (let x = x0; x <= x1; x++) {
    callback(x, y)
  }
}

import { describe, it, expect } from 'vitest'
import { floodFill } from './floodFill'

describe('floodFill', () => {
  it('fills connected area with target color', () => {
    // 4x4 image, all transparent
    const pixels = new Uint8ClampedArray(4 * 4 * 4)
    const fillColor = { r: 255, g: 0, b: 0, a: 255 }

    floodFill(pixels, 4, 4, 0, 0, fillColor)

    // All pixels should be red
    for (let i = 0; i < 4 * 4; i++) {
      expect(pixels[i * 4]).toBe(255)
      expect(pixels[i * 4 + 1]).toBe(0)
      expect(pixels[i * 4 + 2]).toBe(0)
      expect(pixels[i * 4 + 3]).toBe(255)
    }
  })

  it('does not fill across different colors', () => {
    // 4x4 image with a barrier
    const pixels = new Uint8ClampedArray(4 * 4 * 4)

    // Draw a vertical barrier at x=2 (blue)
    for (let y = 0; y < 4; y++) {
      const i = (y * 4 + 2) * 4
      pixels[i] = 0
      pixels[i + 1] = 0
      pixels[i + 2] = 255
      pixels[i + 3] = 255
    }

    const fillColor = { r: 255, g: 0, b: 0, a: 255 }
    floodFill(pixels, 4, 4, 0, 0, fillColor)

    // Left side (x=0,1) should be red
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 2; x++) {
        const i = (y * 4 + x) * 4
        expect(pixels[i]).toBe(255)
        expect(pixels[i + 3]).toBe(255)
      }
    }

    // Right side (x=3) should still be transparent
    for (let y = 0; y < 4; y++) {
      const i = (y * 4 + 3) * 4
      expect(pixels[i + 3]).toBe(0)
    }
  })

  it('does nothing when fill color matches target', () => {
    const pixels = new Uint8ClampedArray(4 * 4 * 4)
    // Fill entire image with red
    for (let i = 0; i < 4 * 4; i++) {
      pixels[i * 4] = 255
      pixels[i * 4 + 3] = 255
    }

    const fillColor = { r: 255, g: 0, b: 0, a: 255 }
    floodFill(pixels, 4, 4, 0, 0, fillColor)

    // Should remain unchanged
    for (let i = 0; i < 4 * 4; i++) {
      expect(pixels[i * 4]).toBe(255)
    }
  })

  it('fills starting at a corner', () => {
    const pixels = new Uint8ClampedArray(4 * 4 * 4)
    const fillColor = { r: 0, g: 255, b: 0, a: 255 }

    floodFill(pixels, 4, 4, 3, 3, fillColor)

    // All pixels should be green (all were same transparent color)
    for (let i = 0; i < 4 * 4; i++) {
      expect(pixels[i * 4 + 1]).toBe(255)
      expect(pixels[i * 4 + 3]).toBe(255)
    }
  })

  it('works on a 1x1 canvas', () => {
    const pixels = new Uint8ClampedArray(4)
    const fillColor = { r: 128, g: 64, b: 32, a: 255 }

    floodFill(pixels, 1, 1, 0, 0, fillColor)

    expect(pixels[0]).toBe(128)
    expect(pixels[1]).toBe(64)
    expect(pixels[2]).toBe(32)
    expect(pixels[3]).toBe(255)
  })

  it('can fill with transparent color', () => {
    const pixels = new Uint8ClampedArray(2 * 2 * 4)
    // Fill with red first
    for (let i = 0; i < 4; i++) {
      pixels[i * 4] = 255
      pixels[i * 4 + 3] = 255
    }

    const transparent = { r: 0, g: 0, b: 0, a: 0 }
    floodFill(pixels, 2, 2, 0, 0, transparent)

    // All pixels should be transparent
    for (let i = 0; i < 4; i++) {
      expect(pixels[i * 4 + 3]).toBe(0)
    }
  })

  it('fills only the matching region in a checkerboard', () => {
    // 2x2 checkerboard: red at (0,0) and (1,1), blue at (0,1) and (1,0)
    const pixels = new Uint8ClampedArray(2 * 2 * 4)
    const red = [255, 0, 0, 255]
    const blue = [0, 0, 255, 255]

    // (0,0) = red
    pixels.set(red, 0)
    // (1,0) = blue
    pixels.set(blue, 4)
    // (0,1) = blue
    pixels.set(blue, 8)
    // (1,1) = red
    pixels.set(red, 12)

    // Fill at (0,0) with green — only (0,0) should change since
    // no same-colored neighbors are adjacent
    const green = { r: 0, g: 255, b: 0, a: 255 }
    floodFill(pixels, 2, 2, 0, 0, green)

    expect(pixels[0]).toBe(0)   // green r
    expect(pixels[1]).toBe(255) // green g
    // (1,0) still blue
    expect(pixels[6]).toBe(255)
    // (1,1) still red
    expect(pixels[12]).toBe(255)
  })
})

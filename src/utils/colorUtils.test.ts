import { describe, it, expect } from 'vitest'
import { rgbaToHex, hexToRgba, rgbaToCss } from './colorUtils'

describe('colorUtils', () => {
  describe('rgbaToHex', () => {
    it('converts RGBA to hex string', () => {
      expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 255 })).toBe('#ff0000')
      expect(rgbaToHex({ r: 0, g: 128, b: 255, a: 255 })).toBe('#0080ff')
      expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 255 })).toBe('#000000')
    })

    it('pads single-digit hex values with zero', () => {
      expect(rgbaToHex({ r: 1, g: 2, b: 3, a: 255 })).toBe('#010203')
    })

    it('converts white correctly', () => {
      expect(rgbaToHex({ r: 255, g: 255, b: 255, a: 255 })).toBe('#ffffff')
    })

    it('ignores alpha channel', () => {
      expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 0 })).toBe('#ff0000')
      expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 128 })).toBe('#ff0000')
    })
  })

  describe('hexToRgba', () => {
    it('converts hex string to RGBA', () => {
      expect(hexToRgba('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 255 })
      expect(hexToRgba('#0080ff')).toEqual({ r: 0, g: 128, b: 255, a: 255 })
    })

    it('handles without hash', () => {
      expect(hexToRgba('ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 255 })
    })

    it('is case insensitive', () => {
      expect(hexToRgba('#FF0000')).toEqual({ r: 255, g: 0, b: 0, a: 255 })
      expect(hexToRgba('#Ff8800')).toEqual({ r: 255, g: 136, b: 0, a: 255 })
    })

    it('returns black for invalid input', () => {
      expect(hexToRgba('')).toEqual({ r: 0, g: 0, b: 0, a: 255 })
      expect(hexToRgba('xyz')).toEqual({ r: 0, g: 0, b: 0, a: 255 })
      expect(hexToRgba('#fff')).toEqual({ r: 0, g: 0, b: 0, a: 255 }) // 3-char not supported
      expect(hexToRgba('#gggggg')).toEqual({ r: 0, g: 0, b: 0, a: 255 })
    })

    it('always returns alpha 255', () => {
      const result = hexToRgba('#808080')
      expect(result.a).toBe(255)
    })
  })

  describe('rgbaToCss', () => {
    it('returns hex for fully opaque colors', () => {
      expect(rgbaToCss({ r: 255, g: 0, b: 0, a: 255 })).toBe('#ff0000')
    })

    it('returns rgba for semi-transparent colors', () => {
      expect(rgbaToCss({ r: 255, g: 0, b: 0, a: 128 })).toBe('rgba(255, 0, 0, 0.50)')
    })

    it('returns rgba with 0.00 for fully transparent', () => {
      expect(rgbaToCss({ r: 100, g: 200, b: 50, a: 0 })).toBe('rgba(100, 200, 50, 0.00)')
    })

    it('formats alpha to two decimal places', () => {
      // 1/255 = 0.00392... → "0.00"
      expect(rgbaToCss({ r: 0, g: 0, b: 0, a: 1 })).toBe('rgba(0, 0, 0, 0.00)')
      // 254/255 = 0.99607... → "1.00"
      expect(rgbaToCss({ r: 0, g: 0, b: 0, a: 254 })).toBe('rgba(0, 0, 0, 1.00)')
    })
  })
})

import { hexToRgb, hslToHex, lerpRgb, randomColorInHueRange, rgbToHex } from './color';
import { clamp, dampingForFrame, REFERENCE_FRAME_MS, resolveValue } from './math';

describe('math helpers', () => {
    it('resolves a fixed number as is and a range from the random source', () => {
        expect(resolveValue(7, () => 0.9)).toBe(7);
        expect(resolveValue({ min: 10, max: 20 }, () => 0.25)).toBe(12.5);
    });

    it('clamps into the interval', () => {
        expect(clamp(-1, 0, 1)).toBe(0);
        expect(clamp(2, 0, 1)).toBe(1);
        expect(clamp(0.5, 0, 1)).toBe(0.5);
    });

    it('applies the tuned damping once per 60fps frame and compounds over shorter frames', () => {
        expect(dampingForFrame(0.9, REFERENCE_FRAME_MS)).toBeCloseTo(0.9);
        expect(dampingForFrame(0.9, REFERENCE_FRAME_MS / 2) ** 2).toBeCloseTo(0.9);
        expect(dampingForFrame(1, 100)).toBe(1);
    });
});

describe('colour helpers', () => {
    it('parses hex with or without # and falls back to white', () => {
        expect(hexToRgb('#ff6600')).toEqual({ r: 255, g: 102, b: 0 });
        expect(hexToRgb('4fc3f7')).toEqual({ r: 79, g: 195, b: 247 });
        expect(hexToRgb('red')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('formats rgb as hex, clamping out-of-range channels', () => {
        expect(rgbToHex({ r: 255, g: 102, b: 0 })).toBe('#ff6600');
        expect(rgbToHex({ r: 300, g: -5, b: 15.6 })).toBe('#ff0010');
    });

    it('converts hsl to hex', () => {
        expect(hslToHex(0, 100, 50)).toBe('#ff0000');
        expect(hslToHex(120, 100, 50)).toBe('#00ff00');
        expect(hslToHex(240, 100, 50)).toBe('#0000ff');
        expect(hslToHex(0, 0, 50)).toBe('#808080');
    });

    it('interpolates between two colours', () => {
        const black = { r: 0, g: 0, b: 0 };
        const white = { r: 255, g: 255, b: 255 };
        expect(lerpRgb(black, white, 0.5)).toEqual({ r: 127, g: 127, b: 127 });
        expect(lerpRgb(black, white, 1)).toEqual(white);
    });

    it('picks a hue inside the requested range', () => {
        expect(randomColorInHueRange(120, 240, 100, 50, () => 0)).toBe('#00ff00');
        expect(randomColorInHueRange(120, 240, 100, 50, () => 1)).toBe('#0000ff');
    });
});

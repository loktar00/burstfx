import { clamp, lerp, type RandomSource } from './math';

export interface Rgb {
    r: number;
    g: number;
    b: number;
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const HEX_COLOR = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const CHANNEL_MAX = 255;
const HUE_SEXTANT = 1 / 6;
const HUE_THIRD = 1 / 3;
const HUE_HALF = 1 / 2;
const HUE_TWO_THIRDS = 2 / 3;
const HUE_SEGMENTS = 6;

/** Parses `#rrggbb` (the `#` is optional). Anything else falls back to white. */
export const hexToRgb = (hex: string): Rgb => {
    const match = HEX_COLOR.exec(hex);
    if (!match) {
        return WHITE;
    }
    const [, r = '', g = '', b = ''] = match;
    return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
};

const toHexChannel = (channel: number): string =>
    Math.round(clamp(channel, 0, CHANNEL_MAX))
        .toString(16)
        .padStart(2, '0');

export const rgbToHex = ({ r, g, b }: Rgb): string =>
    `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;

const hueToChannel = (p: number, q: number, hue: number): number => {
    const t = hue < 0 ? hue + 1 : hue > 1 ? hue - 1 : hue;
    if (t < HUE_SEXTANT) {
        return p + (q - p) * HUE_SEGMENTS * t;
    }
    if (t < HUE_HALF) {
        return q;
    }
    if (t < HUE_TWO_THIRDS) {
        return p + (q - p) * (HUE_TWO_THIRDS - t) * HUE_SEGMENTS;
    }
    return p;
};

/** Converts hue (0-360), saturation (0-100) and lightness (0-100) to `#rrggbb`. */
export const hslToHex = (hue: number, saturation: number, lightness: number): string => {
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;
    if (s === 0) {
        return rgbToHex({ r: l * CHANNEL_MAX, g: l * CHANNEL_MAX, b: l * CHANNEL_MAX });
    }
    const q = l < HUE_HALF ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return rgbToHex({
        r: hueToChannel(p, q, h + HUE_THIRD) * CHANNEL_MAX,
        g: hueToChannel(p, q, h) * CHANNEL_MAX,
        b: hueToChannel(p, q, h - HUE_THIRD) * CHANNEL_MAX,
    });
};

export const lerpRgb = (from: Rgb, to: Rgb, progress: number): Rgb => ({
    r: Math.floor(lerp(from.r, to.r, progress)),
    g: Math.floor(lerp(from.g, to.g, progress)),
    b: Math.floor(lerp(from.b, to.b, progress)),
});

/** A random colour with a hue between `hueMin` and `hueMax` (degrees). */
export const randomColorInHueRange = (
    hueMin: number,
    hueMax: number,
    saturation: number,
    lightness: number,
    random: RandomSource = Math.random,
): string => hslToHex(lerp(hueMin, hueMax, random()), saturation, lightness);

export const randomCoolColor = (): string => randomColorInHueRange(180, 300, 80, 60);
export const randomElectricColor = (): string => randomColorInHueRange(200, 280, 95, 70);
export const randomFluorescentColor = (): string => randomColorInHueRange(0, 360, 90, 60);
export const randomNeonColor = (): string => randomColorInHueRange(0, 360, 100, 70);

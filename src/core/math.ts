/** A closed numeric interval. Values are picked uniformly between `min` and `max`. */
export interface Range {
    min: number;
    max: number;
}

/** Either a fixed number or a range to pick a random number from. */
export type NumberOrRange = number | Range;

/** Returns a number in [0, 1). Injectable so the engine can be tested deterministically. */
export type RandomSource = () => number;

/** The frame length that per-frame damping values were tuned against (60fps). */
export const REFERENCE_FRAME_MS = 1000 / 60;

const DEGREES_TO_RADIANS = Math.PI / 180;

export const degToRad = (degrees: number): number => degrees * DEGREES_TO_RADIANS;

export const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, progress: number): number =>
    from + (to - from) * progress;

/** A fixed number is returned as is; a range yields a random value inside it. */
export const resolveValue = (value: NumberOrRange, random: RandomSource): number =>
    typeof value === 'number' ? value : lerp(value.min, value.max, random());

export const maxOf = (value: NumberOrRange): number =>
    typeof value === 'number' ? value : value.max;

/**
 * Scales a per-frame damping factor to an arbitrary frame length, so a particle slows
 * by the same amount per second whether the display runs at 60Hz or 144Hz.
 */
export const dampingForFrame = (damping: number, dtMs: number): number =>
    damping ** (dtMs / REFERENCE_FRAME_MS);

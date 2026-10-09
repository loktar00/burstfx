import type { NumberOrRange, Range } from './math';

/**
 * Describes one stream of particles. Positions are in CSS pixels relative to the centre
 * of the effect, angles are in degrees (0 points right, 90 points down) and times are
 * in milliseconds.
 */
export interface EffectEmitterConfig {
    /** Total number of particles this emitter spawns. */
    particles: number;
    /** Emitter position, as an offset from the centre of the effect. */
    x?: NumberOrRange;
    y?: NumberOrRange;
    /** Extra random offset added to each particle's spawn point. */
    particleOffset?: {
        x?: NumberOrRange;
        y?: NumberOrRange;
    };
    /** Spawn particles on a circle of this radius around the emitter instead of at its centre. */
    circularRadius?: NumberOrRange;
    /** Initial speed in pixels per second. */
    speedRange: Range;
    /**
     * Direction of travel. Instant emitters spread their particles evenly across the range;
     * timed emitters pick a random angle inside it.
     */
    angleRange: Range;
    /** Particle radius (or image size) at birth, in pixels. */
    size: NumberOrRange;
    /** Size at the end of the particle's life. Defaults to `size`. */
    endSize?: NumberOrRange;
    /** How long each particle lives. */
    lifeTime: NumberOrRange;
    /** Image URL (or data URL) to draw instead of a circle. */
    image?: string;
    /** Single colour for the whole life of the particle, `#rrggbb`. Takes precedence over startColor and endColor. */
    color?: string;
    /** Colour at birth, `#rrggbb`. Defaults to white. */
    startColor?: string;
    /** Colour at death, `#rrggbb`. Defaults to `startColor`. */
    endColor?: string;
    /** Opacity at birth, 0 to 1. Defaults to 1. */
    alpha?: NumberOrRange;
    /** Opacity at death. Defaults to `alpha`. */
    endAlpha?: NumberOrRange;
    /** Particles per second. Leave it out to emit every particle at once. */
    emissionRate?: number;
    /** Stop a timed emitter after this long, even if it has particles left. */
    emissionDuration?: number;
    /** Wait this long before the emitter starts. */
    emissionDelay?: number;
    /** Turns the direction of travel by this many degrees per second, which curves the path. */
    angleChange?: NumberOrRange;
    /** Spins the drawn particle by this many degrees per second. */
    drawAngleChange?: NumberOrRange;
    /** Rotate the drawn particle to face its direction of travel. */
    alignToAngle?: boolean;
    /** Fixed rotation added when drawing, for sprites that do not point right. */
    drawAngleOffset?: number;
    /** Draw with additive blending, which makes overlapping particles glow. */
    blend?: boolean;
    /** Velocity multiplier per 60fps frame. 1 keeps full speed, lower values slow particles down. */
    damping?: NumberOrRange;
    /** Emitters attached to every particle of this emitter; they follow it and stop when it dies. */
    particleEmitters?: EffectEmitterConfig[];
}

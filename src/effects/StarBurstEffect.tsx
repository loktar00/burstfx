import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EffectProps } from './types';

export interface StarBurstEffectProps extends EffectProps {
    /** Base particle count. */
    particles?: number;
    /** Base speed in pixels per second. */
    speed?: number;
    /** Main colour, `#rrggbb`. */
    color?: string;
}

const CORE_PARTICLES = 4;
const WHITE = '#ffffff';

const starBurstEmitters = (
    particles: number,
    speed: number,
    color: string,
): EffectEmitterConfig[] => [
    // Main burst: fast, bright particles fading to white.
    {
        particles: particles * 2,
        speedRange: { min: speed * 0.7, max: speed * 1.5 },
        angleRange: FULL_CIRCLE,
        size: { min: 2, max: 4 },
        endSize: 0,
        lifeTime: { min: 400, max: 700 },
        startColor: color,
        endColor: WHITE,
        alpha: 1,
        endAlpha: 0,
        blend: true,
        damping: 0.985,
    },
    // Secondary sparkle ring: smaller, slower and a moment later.
    {
        particles: Math.floor(particles / 2),
        speedRange: { min: speed * 0.3, max: speed * 0.8 },
        angleRange: FULL_CIRCLE,
        size: { min: 1, max: 2 },
        endSize: 0,
        lifeTime: { min: 600, max: 900 },
        startColor: WHITE,
        endColor: color,
        alpha: 0.8,
        endAlpha: 0,
        emissionDelay: 100,
        angleChange: 90,
        blend: true,
        damping: 0.98,
    },
    // Bright core that swells and fades.
    {
        particles: CORE_PARTICLES,
        speedRange: { min: speed * 0.1, max: speed * 0.3 },
        angleRange: FULL_CIRCLE,
        size: { min: 6, max: 10 },
        endSize: { min: 15, max: 20 },
        lifeTime: { min: 300, max: 500 },
        startColor: WHITE,
        endColor: color,
        alpha: 0.9,
        endAlpha: 0,
        blend: true,
        damping: 0.99,
    },
];

export const StarBurstEffect = ({
    particles = 8,
    speed = 120,
    color = '#ffd54f',
    ...rest
}: StarBurstEffectProps) => (
    <EffectBase {...rest} emitters={starBurstEmitters(particles, speed, color)} />
);

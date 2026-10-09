import { EffectBase } from '../core/EffectBase';
import { randomCoolColor, randomElectricColor, randomNeonColor } from '../core/color';
import { resolveValue, type RandomSource, type Range } from '../core/math';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type IntensityEffectProps } from './types';

export type FireworksEffectProps = IntensityEffectProps;

const BURST_COUNT = 4;
const BURST_X: Range = { min: -40, max: 40 };
const BURST_Y: Range = { min: -20, max: 20 };
const BURST_DELAY_MS: Range = { min: 200, max: 1400 };
const SPARKS_AFTER_MS = 150;
const TRAILS_AFTER_MS = 500;

interface Burst {
    x: number;
    y: number;
    delay: number;
}

const randomBurst = (random: RandomSource): Burst => ({
    x: resolveValue(BURST_X, random),
    y: resolveValue(BURST_Y, random),
    delay: resolveValue(BURST_DELAY_MS, random),
});

const burstEmitters = ({ x, y, delay }: Burst, intensity: number): EffectEmitterConfig[] => [
    // Main shell.
    {
        particles: intensity,
        x,
        y,
        speedRange: { min: 60, max: 100 },
        angleRange: FULL_CIRCLE,
        size: { min: 3, max: 6 },
        endSize: { min: 1, max: 3 },
        lifeTime: { min: 1000, max: 1500 },
        alpha: 1,
        endAlpha: 0,
        angleChange: 180,
        color: randomNeonColor(),
        damping: 0.98,
        emissionDelay: delay,
    },
    // Bright sparks just after.
    {
        particles: intensity * 2,
        x,
        y,
        speedRange: { min: 80, max: 120 },
        angleRange: FULL_CIRCLE,
        size: { min: 1, max: 3 },
        endSize: 0,
        lifeTime: { min: 600, max: 1000 },
        alpha: 1,
        endAlpha: 0,
        blend: true,
        color: randomCoolColor(),
        angleChange: 360,
        emissionDelay: delay + SPARKS_AFTER_MS,
        damping: 0.96,
    },
    // Slow glowing trails.
    {
        particles: intensity,
        x,
        y,
        speedRange: { min: 40, max: 80 },
        angleRange: FULL_CIRCLE,
        size: { min: 2, max: 4 },
        endSize: 0,
        lifeTime: { min: 1200, max: 1800 },
        alpha: 0.7,
        endAlpha: 0,
        blend: true,
        color: randomElectricColor(),
        angleChange: 90,
        emissionDelay: delay + TRAILS_AFTER_MS,
        damping: 0.97,
    },
];

// Several shells at random spots and times around the centre.
const fireworksEmitters = (intensity: number): EffectEmitterConfig[] =>
    Array.from({ length: BURST_COUNT }, () => randomBurst(Math.random)).flatMap((burst) =>
        burstEmitters(burst, intensity),
    );

export const FireworksEffect = ({ intensity = 8, ...rest }: FireworksEffectProps) => (
    <EffectBase {...rest} emitters={fireworksEmitters(intensity)} />
);

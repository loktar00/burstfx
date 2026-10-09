import { EffectBase } from '../core/EffectBase';
import { randomCoolColor, randomElectricColor } from '../core/color';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type RainbowCycleEffectProps = EmojiEffectProps;

const rainbowCycleEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => [
    // Main burst that shifts colour as it travels.
    {
        particles: intensity * 2,
        speedRange: { min: 80, max: 120 },
        angleRange: FULL_CIRCLE,
        size: emojiImage ? { min: 16, max: 24 } : { min: 4, max: 8 },
        endSize: emojiImage ? { min: 8, max: 16 } : { min: 1, max: 3 },
        lifeTime: { min: 1500, max: 2500 },
        alpha: 1,
        endAlpha: 0,
        image: emojiImage,
        startColor: randomCoolColor(),
        endColor: randomElectricColor(),
        angleChange: 180,
        blend: true,
        damping: 0.98,
    },
    // Second ring of smaller particles.
    {
        particles: intensity,
        speedRange: { min: 60, max: 100 },
        angleRange: FULL_CIRCLE,
        size: { min: 2, max: 5 },
        endSize: 0,
        lifeTime: { min: 1000, max: 1800 },
        alpha: 0.9,
        endAlpha: 0,
        color: randomCoolColor(),
        angleChange: 270,
        blend: true,
        emissionDelay: 100,
        damping: 0.96,
    },
    // Fast thin trails.
    {
        particles: intensity,
        speedRange: { min: 100, max: 150 },
        angleRange: FULL_CIRCLE,
        size: { min: 1, max: 3 },
        endSize: 0,
        lifeTime: { min: 800, max: 1400 },
        alpha: 1,
        endAlpha: 0,
        color: randomCoolColor(),
        angleChange: 360,
        blend: true,
        emissionDelay: 200,
        damping: 0.94,
    },
    // Slow particles that grow as they fade between two colours.
    {
        particles: Math.floor(intensity * 0.75),
        speedRange: { min: 40, max: 80 },
        angleRange: FULL_CIRCLE,
        size: { min: 3, max: 7 },
        endSize: { min: 8, max: 15 },
        lifeTime: { min: 2000, max: 3000 },
        alpha: 0.6,
        endAlpha: 0,
        startColor: randomCoolColor(),
        endColor: randomCoolColor(),
        angleChange: 45,
        emissionDelay: 300,
        damping: 0.99,
    },
];

export const RainbowCycleEffect = ({
    intensity = 10,
    emojiImage,
    ...rest
}: RainbowCycleEffectProps) => (
    <EffectBase {...rest} emitters={rainbowCycleEmitters(intensity, emojiImage)} />
);

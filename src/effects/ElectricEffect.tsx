import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type ElectricEffectProps = EmojiEffectProps;

const DISCHARGE_WAVES = 4;

const electricEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => [
    // Spinning energy core (the emoji when one is given).
    {
        particles: Math.floor(intensity * 0.75),
        circularRadius: 20,
        speedRange: { min: 8, max: 12 },
        angleRange: FULL_CIRCLE,
        size: emojiImage ? { min: 20, max: 28 } : { min: 6, max: 10 },
        endSize: emojiImage ? { min: 14, max: 20 } : { min: 3, max: 6 },
        lifeTime: { min: 1500, max: 2500 },
        alpha: 1,
        endAlpha: 0.3,
        image: emojiImage,
        angleChange: 270,
        drawAngleChange: 360,
        color: emojiImage ? undefined : '#ffeb3b',
        blend: !emojiImage,
        damping: 0.995,
    },
    // Lightning: fast, jagged streaks.
    {
        particles: intensity * 2,
        speedRange: { min: 150, max: 250 },
        angleRange: FULL_CIRCLE,
        size: { min: 2, max: 4 },
        endSize: { min: 6, max: 10 },
        lifeTime: { min: 300, max: 600 },
        alpha: 1,
        endAlpha: 0,
        blend: true,
        color: '#03a9f4',
        angleChange: 720,
        emissionDelay: 100,
    },
    // Crackling: tiny rapid white sparks.
    {
        particles: intensity * 4,
        speedRange: { min: 80, max: 140 },
        angleRange: FULL_CIRCLE,
        size: { min: 1, max: 2 },
        endSize: 0,
        lifeTime: { min: 200, max: 500 },
        alpha: 1,
        endAlpha: 0,
        blend: true,
        color: '#ffffff',
        angleChange: 900,
        emissionRate: intensity * 8,
        emissionDuration: 800,
        emissionDelay: 150,
        damping: 0.95,
    },
    // Discharge waves that expand as they fade.
    {
        particles: DISCHARGE_WAVES,
        speedRange: { min: 60, max: 100 },
        angleRange: FULL_CIRCLE,
        size: { min: 8, max: 12 },
        endSize: { min: 25, max: 40 },
        lifeTime: { min: 800, max: 1200 },
        alpha: 0.7,
        endAlpha: 0,
        blend: true,
        color: '#4fc3f7',
        emissionDelay: 200,
        damping: 0.97,
    },
    // Soft green afterglow.
    {
        particles: intensity,
        particleOffset: {
            x: { min: -20, max: 20 },
            y: { min: -20, max: 20 },
        },
        speedRange: { min: 20, max: 50 },
        angleRange: FULL_CIRCLE,
        size: { min: 3, max: 6 },
        endSize: 0,
        lifeTime: { min: 1500, max: 2500 },
        alpha: 0.6,
        endAlpha: 0,
        blend: true,
        color: '#81c784',
        emissionDelay: 600,
        damping: 0.98,
    },
];

export const ElectricEffect = ({ intensity = 8, emojiImage, ...rest }: ElectricEffectProps) => (
    <EffectBase {...rest} emitters={electricEmitters(intensity, emojiImage)} />
);

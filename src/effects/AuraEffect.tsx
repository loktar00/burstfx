import { EffectBase } from '../core/EffectBase';
import { randomCoolColor } from '../core/color';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type AuraEffectProps = EmojiEffectProps;

const auraEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => [
    // Emoji (or purple orbs) drifting in a loose orbit around the centre.
    {
        particles: intensity * 2,
        circularRadius: 50,
        speedRange: { min: 12, max: 18 },
        angleRange: FULL_CIRCLE,
        size: emojiImage ? { min: 4, max: 16 } : { min: 3, max: 6 },
        endSize: emojiImage ? { min: 10, max: 16 } : { min: 1, max: 3 },
        lifeTime: { min: 2000, max: 3000 },
        alpha: 0.9,
        endAlpha: 0,
        image: emojiImage,
        angleChange: 150,
        drawAngleChange: 30,
        color: emojiImage ? undefined : '#9c27b0',
        damping: 0.995,
    },
    // Soft glow that swells as it fades.
    {
        particles: intensity * 4,
        speedRange: { min: 10, max: 30 },
        angleRange: FULL_CIRCLE,
        size: { min: 8, max: 15 },
        endSize: { min: 20, max: 30 },
        lifeTime: { min: 1800, max: 2200 },
        alpha: 0.3,
        endAlpha: 0,
        blend: true,
        color: randomCoolColor(),
        emissionRate: intensity * 2,
        emissionDuration: 1000,
        damping: 0.98,
    },
    // White sparkles scattered around the centre.
    {
        particles: intensity * 6,
        particleOffset: {
            x: { min: -30, max: 30 },
            y: { min: -30, max: 30 },
        },
        speedRange: { min: 5, max: 20 },
        angleRange: FULL_CIRCLE,
        size: { min: 1, max: 3 },
        endSize: 0,
        lifeTime: { min: 1500, max: 2500 },
        alpha: 1,
        endAlpha: 0,
        blend: true,
        color: '#ffffff',
        angleChange: 180,
        emissionRate: intensity * 3,
        emissionDuration: 2500,
        emissionDelay: 200,
        damping: 0.96,
    },
];

export const AuraEffect = ({ intensity = 6, emojiImage, ...rest }: AuraEffectProps) => (
    <EffectBase {...rest} emitters={auraEmitters(intensity, emojiImage)} />
);

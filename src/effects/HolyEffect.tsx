import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type HolyEffectProps = EmojiEffectProps;

const RISING_EMOJI = 5;
const AURA_PARTICLES = 3;

const holyEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => [
    // The emoji (praying hands, usually) floating straight up from below.
    {
        particles: RISING_EMOJI,
        particleOffset: {
            x: { min: -50, max: 50 },
            y: { min: 60, max: 95 },
        },
        speedRange: { min: 40, max: 50 },
        angleRange: { min: -95, max: -85 },
        size: emojiImage ? { min: 8, max: 20 } : { min: 5, max: 7 },
        endSize: emojiImage ? { min: 18, max: 22 } : { min: 6, max: 9 },
        lifeTime: { min: 3500, max: 4500 },
        alpha: 0.9,
        endAlpha: 0.2,
        image: emojiImage,
        color: emojiImage ? undefined : '#b19cd9',
        damping: 0.998,
    },
    // Sky blue beams rising with them.
    {
        particles: intensity * 2,
        y: 75,
        particleOffset: { x: { min: -50, max: 50 } },
        speedRange: { min: 40, max: 50 },
        angleRange: { min: -100, max: -80 },
        size: { min: 3, max: 6 },
        endSize: { min: 8, max: 12 },
        lifeTime: { min: 2000, max: 3000 },
        alpha: 0.7,
        endAlpha: 0,
        blend: true,
        color: '#87ceeb',
        angleChange: 45,
        damping: 0.99,
    },
    // Faint plum aura spreading from the centre.
    {
        particles: AURA_PARTICLES,
        speedRange: { min: 15, max: 25 },
        angleRange: FULL_CIRCLE,
        size: { min: 6, max: 10 },
        endSize: { min: 12, max: 18 },
        lifeTime: { min: 2500, max: 3500 },
        alpha: 0.1,
        endAlpha: 0,
        blend: true,
        color: '#dda0dd',
        angleChange: 30,
        emissionDelay: 100,
        damping: 0.97,
    },
    // Small sparkles drifting up for three seconds.
    {
        particles: intensity * 2,
        y: 40,
        particleOffset: {
            x: { min: -30, max: 30 },
            y: { min: 0, max: 20 },
        },
        speedRange: { min: 40, max: 50 },
        angleRange: { min: -100, max: -80 },
        size: { min: 1, max: 2 },
        endSize: { min: 2, max: 4 },
        lifeTime: { min: 2000, max: 3000 },
        alpha: 0.9,
        endAlpha: 0,
        blend: true,
        color: '#d8bfd8',
        angleChange: 360,
        emissionRate: intensity,
        emissionDuration: 3000,
        emissionDelay: 200,
        damping: 0.995,
    },
];

export const HolyEffect = ({ intensity = 8, emojiImage, ...rest }: HolyEffectProps) => (
    <EffectBase {...rest} emitters={holyEmitters(intensity, emojiImage)} />
);

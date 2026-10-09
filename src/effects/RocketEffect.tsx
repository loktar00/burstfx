import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import type { EmojiEffectProps } from './types';

export type RocketEffectProps = EmojiEffectProps;

const ROCKETS = 3;
const ROCKET_LIFETIME_MS = { min: 2500, max: 3500 };
/** The rocket emoji points up and to the right, so turn it to face its direction of travel. */
const ROCKET_GLYPH_OFFSET_DEGREES = 40;
/** Fire particles per second, per unit of intensity. */
const TRAIL_RATE_PER_INTENSITY = 2;
const MS_PER_SECOND = 1000;

const fireTrail = (intensity: number): EffectEmitterConfig => {
    const emissionRate = intensity * TRAIL_RATE_PER_INTENSITY;
    return {
        // Enough fire to last the longest flight; the trail stops when its rocket does.
        particles: Math.ceil((emissionRate * ROCKET_LIFETIME_MS.max) / MS_PER_SECOND),
        speedRange: { min: 5, max: 15 },
        angleRange: { min: 0, max: 360 },
        size: { min: 3, max: 6 },
        endSize: { min: 0, max: 1 },
        lifeTime: { min: 400, max: 800 },
        startColor: '#ff6600',
        endColor: '#010101',
        alpha: 1,
        endAlpha: 0,
        emissionRate,
        blend: true,
        damping: 0.96,
    };
};

const rocketEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => [
    // A few rockets lifting off below the centre and curving gently, each trailing fire.
    {
        particles: ROCKETS,
        y: 50,
        particleOffset: { x: { min: -20, max: 20 } },
        speedRange: { min: 80, max: 120 },
        angleRange: { min: -100, max: -80 },
        image: emojiImage,
        size: 20,
        lifeTime: ROCKET_LIFETIME_MS,
        alpha: 1,
        endAlpha: 0.3,
        angleChange: 45,
        alignToAngle: true,
        drawAngleOffset: ROCKET_GLYPH_OFFSET_DEGREES,
        particleEmitters: [fireTrail(intensity)],
    },
];

export const RocketEffect = ({ intensity = 20, emojiImage, ...rest }: RocketEffectProps) => (
    <EffectBase {...rest} emitters={rocketEmitters(intensity, emojiImage)} />
);

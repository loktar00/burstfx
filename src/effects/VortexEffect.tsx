import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type VortexEffectProps = EmojiEffectProps;

/** When the outward explosion fires, after the spiral has formed. */
const EXPLOSION_DELAY_MS = 800;

const vortexEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => {
    const plain = !emojiImage;
    return [
        // Outer ring spiralling inward.
        {
            particles: intensity,
            circularRadius: 70,
            speedRange: { min: 25, max: 35 },
            angleRange: { min: 180, max: 270 },
            size: plain ? { min: 2, max: 4 } : { min: 12, max: 18 },
            endSize: plain ? { min: 4, max: 8 } : { min: 16, max: 24 },
            lifeTime: { min: 1500, max: 2000 },
            alpha: 0.8,
            endAlpha: 0,
            image: emojiImage,
            angleChange: 120,
            drawAngleChange: 180,
            blend: plain,
            color: plain ? '#ff6b35' : undefined,
            damping: 0.96,
        },
        // Middle ring, a faster spiral.
        {
            particles: intensity,
            circularRadius: 45,
            speedRange: { min: 45, max: 55 },
            angleRange: { min: 170, max: 280 },
            size: plain ? { min: 3, max: 6 } : { min: 14, max: 20 },
            endSize: plain ? { min: 6, max: 10 } : { min: 18, max: 26 },
            lifeTime: { min: 1800, max: 2600 },
            alpha: 0.9,
            endAlpha: 0,
            image: emojiImage,
            angleChange: 200,
            drawAngleChange: 270,
            emissionDelay: 100,
            blend: plain,
            color: plain ? '#ff8c42' : undefined,
            damping: 0.94,
        },
        // Inner core, spinning fastest.
        {
            particles: Math.floor(intensity * 0.75),
            circularRadius: 25,
            speedRange: { min: 75, max: 85 },
            angleRange: { min: 160, max: 290 },
            size: plain ? { min: 4, max: 8 } : { min: 16, max: 22 },
            endSize: plain ? { min: 8, max: 12 } : { min: 20, max: 30 },
            lifeTime: { min: 1500, max: 2000 },
            alpha: 1,
            endAlpha: 0,
            image: emojiImage,
            angleChange: 360,
            drawAngleChange: 360,
            emissionDelay: 200,
            blend: plain,
            color: plain ? '#ffd23f' : undefined,
            damping: 0.92,
        },
        // Explosion outward once the vortex has formed.
        {
            particles: Math.floor(intensity * 1.5),
            speedRange: { min: 120, max: 180 },
            angleRange: FULL_CIRCLE,
            size: plain ? { min: 6, max: 10 } : { min: 18, max: 26 },
            endSize: plain ? { min: 2, max: 4 } : { min: 10, max: 16 },
            lifeTime: { min: 1000, max: 1800 },
            alpha: 1,
            endAlpha: 0,
            image: emojiImage,
            angleChange: 180,
            emissionDelay: EXPLOSION_DELAY_MS,
            blend: plain,
            color: plain ? '#ff6b35' : undefined,
            damping: 0.98,
        },
    ];
};

export const VortexEffect = ({ intensity = 10, emojiImage, ...rest }: VortexEffectProps) => (
    <EffectBase {...rest} emitters={vortexEmitters(intensity, emojiImage)} />
);

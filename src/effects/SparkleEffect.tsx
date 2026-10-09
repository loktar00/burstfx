import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type IntensityEffectProps } from './types';

export type SparkleEffectProps = IntensityEffectProps;

const sparkleEmitters = (intensity: number): EffectEmitterConfig[] => [
    // Half a second of small, fast, twinkling sparks, yellow fading to red.
    {
        particles: intensity * 8,
        particleOffset: {
            x: { min: -25, max: 25 },
            y: { min: -25, max: 25 },
        },
        speedRange: { min: 80, max: 150 },
        angleRange: FULL_CIRCLE,
        size: { min: 1, max: 3 },
        endSize: { min: 0, max: 1 },
        lifeTime: { min: 800, max: 1200 },
        startColor: '#ffff00',
        endColor: '#ff0000',
        alpha: 1,
        endAlpha: 0,
        emissionRate: intensity * 4,
        emissionDuration: 500,
        angleChange: 180,
        damping: 0.98,
        blend: true,
    },
];

export const SparkleEffect = ({ intensity = 12, ...rest }: SparkleEffectProps) => (
    <EffectBase {...rest} emitters={sparkleEmitters(intensity)} />
);

import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import type { IntensityEffectProps } from './types';

export type FireEffectProps = IntensityEffectProps;

const fireEmitters = (intensity: number): EffectEmitterConfig[] => [
    // Embers rising from the centre, orange fading to smoke.
    {
        particles: intensity,
        speedRange: { min: 80, max: 110 },
        angleRange: { min: -135, max: -45 },
        size: { min: 4, max: 8 },
        endSize: { min: 0, max: 1 },
        lifeTime: { min: 1200, max: 1800 },
        startColor: '#ff6600',
        endColor: '#010101',
        alpha: 1,
        endAlpha: 0,
        emissionRate: intensity,
        emissionDuration: 3000,
        blend: true,
        damping: 0.97,
    },
];

export const FireEffect = ({ intensity = 20, ...rest }: FireEffectProps) => (
    <EffectBase {...rest} emitters={fireEmitters(intensity)} />
);

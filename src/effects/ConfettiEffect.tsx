import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import type { IntensityEffectProps } from './types';

export type ConfettiEffectProps = IntensityEffectProps;

const CONFETTI_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
/** Delay between each colour's stream starting. */
const COLOR_STAGGER_MS = 100;
const MIN_TURN_RATE = 180;

const confettiEmitters = (intensity: number): EffectEmitterConfig[] =>
    // One falling stream per colour, each starting a little after the last.
    CONFETTI_COLORS.map((color, index) => ({
        particles: Math.floor(intensity / 2),
        y: -20,
        particleOffset: { x: { min: -30, max: 30 } },
        speedRange: { min: 60, max: 120 },
        angleRange: { min: 45, max: 135 },
        size: { min: 1, max: 3 },
        endSize: { min: 0, max: 2 },
        lifeTime: { min: 2000, max: 3500 },
        color,
        alpha: 0.9,
        endAlpha: 0.3,
        emissionRate: intensity,
        emissionDuration: 1000,
        emissionDelay: index * COLOR_STAGGER_MS,
        angleChange: { min: MIN_TURN_RATE, max: MIN_TURN_RATE * 2 },
        damping: 0.98,
    }));

export const ConfettiEffect = ({ intensity = 15, ...rest }: ConfettiEffectProps) => (
    <EffectBase {...rest} emitters={confettiEmitters(intensity)} />
);

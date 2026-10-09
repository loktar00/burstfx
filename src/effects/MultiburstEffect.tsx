import { EffectBase } from '../core/EffectBase';
import { randomFluorescentColor, randomNeonColor } from '../core/color';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type MultiburstEffectProps = EmojiEffectProps;

/** Top left, top right, then bottom centre, each a little later than the last. */
const BURSTS = [
    { x: -50, y: -50, delay: 0, randomColor: randomFluorescentColor },
    { x: 50, y: -50, delay: 150, randomColor: randomNeonColor },
    { x: 0, y: 25, delay: 300, randomColor: randomNeonColor },
];

const multiburstEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] =>
    BURSTS.map(({ x, y, delay, randomColor }) => ({
        particles: intensity,
        x,
        y,
        speedRange: { min: 60, max: 100 },
        angleRange: FULL_CIRCLE,
        size: emojiImage ? { min: 12, max: 18 } : { min: 3, max: 6 },
        endSize: emojiImage ? { min: 6, max: 12 } : { min: 1, max: 3 },
        lifeTime: { min: 1000, max: 1500 },
        alpha: 1,
        endAlpha: 0,
        image: emojiImage,
        angleChange: 180,
        color: emojiImage ? undefined : randomColor(),
        damping: 0.98,
        emissionDelay: delay,
    }));

export const MultiburstEffect = ({ intensity = 6, emojiImage, ...rest }: MultiburstEffectProps) => (
    <EffectBase {...rest} emitters={multiburstEmitters(intensity, emojiImage)} />
);

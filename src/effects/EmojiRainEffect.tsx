import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import type { EmojiEffectProps } from './types';

export type EmojiRainEffectProps = EmojiEffectProps;

const emojiRainEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] => [
    // Two seconds of emoji falling from above the centre.
    {
        particles: intensity * 2,
        particleOffset: {
            x: { min: -40, max: 40 },
            y: { min: -75, max: -50 },
        },
        speedRange: { min: 80, max: 150 },
        angleRange: { min: 85, max: 95 },
        size: { min: 16, max: 24 },
        endSize: { min: 12, max: 20 },
        lifeTime: { min: 1500, max: 2000 },
        alpha: 1,
        endAlpha: 0,
        emissionRate: intensity * 2,
        emissionDuration: 2000,
        angleChange: 45,
        image: emojiImage,
    },
];

export const EmojiRainEffect = ({ intensity = 10, emojiImage, ...rest }: EmojiRainEffectProps) => (
    <EffectBase {...rest} emitters={emojiRainEmitters(intensity, emojiImage)} />
);

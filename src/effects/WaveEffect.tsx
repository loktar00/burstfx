import { EffectBase } from '../core/EffectBase';
import type { EffectEmitterConfig } from '../core/types';
import { FULL_CIRCLE, type EmojiEffectProps } from './types';

export type WaveEffectProps = EmojiEffectProps;

const WAVE_COUNT = 5;
const WAVE_GAP_MS = 150;
const FIRST_RADIUS = 15;
const RADIUS_STEP = 20;
const SPEED_STEP = 15;
const MIN_PARTICLES_PER_WAVE = 4;
const ALPHA_STEP = 0.15;

const waveRing = (wave: number, intensity: number, emojiImage?: string): EffectEmitterConfig => ({
    particles: Math.max(MIN_PARTICLES_PER_WAVE, intensity - wave),
    circularRadius: FIRST_RADIUS + wave * RADIUS_STEP,
    speedRange: { min: 55 + wave * SPEED_STEP, max: 65 + wave * SPEED_STEP },
    angleRange: FULL_CIRCLE,
    size: emojiImage ? { min: 14, max: 20 } : { min: 3, max: 6 },
    endSize: emojiImage ? { min: 8, max: 12 } : 0,
    lifeTime: { min: 1500 + wave * 200, max: 2000 + wave * 300 },
    alpha: 1 - wave * ALPHA_STEP,
    endAlpha: 0,
    image: emojiImage,
    emissionDelay: wave * WAVE_GAP_MS,
    angleChange: 45,
    blend: !emojiImage,
    color: emojiImage ? undefined : '#4fc3f7',
    damping: 0.985,
});

// Rings that start further out, later, faster and dimmer, one after another.
const waveEmitters = (intensity: number, emojiImage?: string): EffectEmitterConfig[] =>
    Array.from({ length: WAVE_COUNT }, (_, wave) => waveRing(wave, intensity, emojiImage));

export const WaveEffect = ({ intensity = 6, emojiImage, ...rest }: WaveEffectProps) => (
    <EffectBase {...rest} emitters={waveEmitters(intensity, emojiImage)} />
);

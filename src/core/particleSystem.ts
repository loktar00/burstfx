import { hexToRgb, type Rgb } from './color';
import {
    dampingForFrame,
    degToRad,
    lerp,
    resolveValue,
    type NumberOrRange,
    type RandomSource,
} from './math';
import type { EffectEmitterConfig } from './types';

export interface Point {
    x: number;
    y: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    /** Direction of travel in degrees. */
    angle: number;
    angleChange: number;
    drawAngle: number;
    drawAngleChange: number;
    drawAngleOffset: number;
    alignToAngle: boolean;
    life: number;
    ttl: number;
    startSize: number;
    endSize: number;
    startColor: Rgb;
    endColor: Rgb;
    startAlpha: number;
    endAlpha: number;
    damping: number;
    blend: boolean;
    image: string | undefined;
}

export interface ParticleSystem {
    /** Advances the simulation by `dtMs` milliseconds. */
    step: (dtMs: number) => void;
    /** Live particles, in spawn order. */
    readonly particles: readonly Particle[];
    /** True once every emitter has finished and the last particle has died. */
    readonly done: boolean;
}

interface EmitterState {
    config: EffectEmitterConfig;
    startAt: number;
    emitted: number;
    complete: boolean;
    /** Set for emitters attached to a particle. */
    parent?: Particle;
}

const MS_PER_SECOND = 1000;
const DEFAULT_COLOR = '#ffffff';

const valueOr = (value: NumberOrRange | undefined, fallback: number, random: RandomSource) =>
    value === undefined ? fallback : resolveValue(value, random);

const spawnAngle = (config: EffectEmitterConfig, index: number, random: RandomSource) => {
    const { angleRange, emissionRate, particles } = config;
    if (emissionRate) {
        return resolveValue(angleRange, random);
    }
    return lerp(angleRange.min, angleRange.max, index / particles);
};

const spawnPoint = (config: EffectEmitterConfig, emitterAt: Point, random: RandomSource): Point => {
    if (config.circularRadius !== undefined) {
        const angle = random() * Math.PI * 2;
        const radius = resolveValue(config.circularRadius, random);
        return {
            x: emitterAt.x + Math.cos(angle) * radius,
            y: emitterAt.y + Math.sin(angle) * radius,
        };
    }
    return {
        x: emitterAt.x + valueOr(config.particleOffset?.x, 0, random),
        y: emitterAt.y + valueOr(config.particleOffset?.y, 0, random),
    };
};

const spawnColors = (config: EffectEmitterConfig) => {
    if (config.color) {
        const color = hexToRgb(config.color);
        return { startColor: color, endColor: color };
    }
    const startColor = hexToRgb(config.startColor ?? DEFAULT_COLOR);
    return { startColor, endColor: config.endColor ? hexToRgb(config.endColor) : startColor };
};

const createParticle = (
    config: EffectEmitterConfig,
    emitterAt: Point,
    index: number,
    random: RandomSource,
): Particle => {
    const { x, y } = spawnPoint(config, emitterAt, random);
    const angle = spawnAngle(config, index, random);
    const speed = resolveValue(config.speedRange, random);
    const startSize = resolveValue(config.size, random);
    const startAlpha = valueOr(config.alpha, 1, random);
    return {
        x,
        y,
        vx: Math.cos(degToRad(angle)) * speed,
        vy: Math.sin(degToRad(angle)) * speed,
        angle,
        angleChange: valueOr(config.angleChange, 0, random),
        drawAngle: 0,
        drawAngleChange: valueOr(config.drawAngleChange, 0, random),
        drawAngleOffset: config.drawAngleOffset ?? 0,
        alignToAngle: config.alignToAngle ?? false,
        life: 0,
        ttl: resolveValue(config.lifeTime, random),
        startSize,
        endSize: valueOr(config.endSize, startSize, random),
        ...spawnColors(config),
        startAlpha,
        endAlpha: valueOr(config.endAlpha, startAlpha, random),
        damping: valueOr(config.damping, 1, random),
        blend: config.blend ?? false,
        image: config.image,
    };
};

/** Moves a live particle forward by `dtMs`. */
export const updateParticle = (particle: Particle, dtMs: number): void => {
    const p = particle;
    const dt = dtMs / MS_PER_SECOND;
    if (p.angleChange !== 0) {
        const speed = Math.hypot(p.vx, p.vy);
        p.angle += p.angleChange * dt;
        p.vx = Math.cos(degToRad(p.angle)) * speed;
        p.vy = Math.sin(degToRad(p.angle)) * speed;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const damping = dampingForFrame(p.damping, dtMs);
    p.vx *= damping;
    p.vy *= damping;
    p.drawAngle = p.alignToAngle ? p.angle : p.drawAngle + p.drawAngleChange * dt;
    p.life += dtMs;
};

/** How many particles a timed emitter should have spawned `elapsed` ms after it started. */
export const particlesDue = (config: EffectEmitterConfig, elapsed: number): number => {
    const rate = config.emissionRate ?? 0;
    const window = Math.min(elapsed, config.emissionDuration ?? Infinity);
    return Math.min(config.particles, 1 + Math.floor((window * rate) / MS_PER_SECOND));
};

const isEmissionOver = (config: EffectEmitterConfig, emitted: number, elapsed: number) =>
    emitted >= config.particles || elapsed >= (config.emissionDuration ?? Infinity);

/**
 * A pure particle simulation with no DOM access. `origin` is the centre of the effect.
 * EffectBase drives it from requestAnimationFrame and draws `particles` to a canvas.
 */
export const createParticleSystem = (
    emitters: readonly EffectEmitterConfig[],
    origin: Point,
    random: RandomSource = Math.random,
): ParticleSystem => {
    let time = 0;
    let particles: Particle[] = [];
    const states: EmitterState[] = emitters.map((config) => ({
        config,
        startAt: config.emissionDelay ?? 0,
        emitted: 0,
        complete: false,
    }));

    const emitterPosition = (state: EmitterState): Point => {
        const base = state.parent ?? origin;
        return {
            x: base.x + valueOr(state.config.x, 0, random),
            y: base.y + valueOr(state.config.y, 0, random),
        };
    };

    const attachEmitters = (particle: Particle, configs: readonly EffectEmitterConfig[]) => {
        configs.forEach((config) => {
            states.push({
                config,
                startAt: time + (config.emissionDelay ?? 0),
                emitted: 0,
                complete: false,
                parent: particle,
            });
        });
    };

    const spawn = (state: EmitterState, count: number) => {
        const { config } = state;
        for (let i = 0; i < count; i += 1) {
            const particle = createParticle(config, emitterPosition(state), state.emitted, random);
            particles.push(particle);
            attachEmitters(particle, config.particleEmitters ?? []);
            state.emitted += 1;
        }
    };

    const runEmitter = (state: EmitterState) => {
        const elapsed = time - state.startAt;
        if (state.complete || elapsed < 0) {
            return;
        }
        const { config } = state;
        const target = config.emissionRate ? particlesDue(config, elapsed) : config.particles;
        spawn(state, target - state.emitted);
        state.complete = !config.emissionRate || isEmissionOver(config, state.emitted, elapsed);
    };

    const retire = (dead: Particle) => {
        states.forEach((state) => {
            if (state.parent === dead) {
                state.complete = true;
            }
        });
    };

    const step = (dtMs: number) => {
        time += dtMs;
        // Attached emitters are appended while spawning, so iterate by index.
        for (let i = 0; i < states.length; i += 1) {
            const state = states[i];
            if (state) {
                runEmitter(state);
            }
        }
        particles.forEach((particle) => {
            updateParticle(particle, dtMs);
        });
        const dead = particles.filter((particle) => particle.life >= particle.ttl);
        if (dead.length > 0) {
            particles = particles.filter((particle) => particle.life < particle.ttl);
            dead.forEach(retire);
        }
    };

    return {
        step,
        get particles() {
            return particles;
        },
        get done() {
            return particles.length === 0 && states.every((state) => state.complete);
        },
    };
};

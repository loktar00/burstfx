import { createParticleSystem, particlesDue } from './particleSystem';
import type { EffectEmitterConfig } from './types';

const ORIGIN = { x: 100, y: 100 };
const fixedRandom = () => 0.5;

const emitter = (overrides: Partial<EffectEmitterConfig> = {}): EffectEmitterConfig => ({
    particles: 5,
    speedRange: { min: 0, max: 0 },
    angleRange: { min: 0, max: 360 },
    size: 2,
    lifeTime: 500,
    ...overrides,
});

const run = (system: ReturnType<typeof createParticleSystem>, totalMs: number, stepMs = 16) => {
    for (let t = 0; t < totalMs; t += stepMs) {
        system.step(Math.min(stepMs, totalMs - t));
    }
};

describe('createParticleSystem', () => {
    it('emits every particle of an instant emitter on the first step', () => {
        const system = createParticleSystem([emitter({ particles: 7 })], ORIGIN, fixedRandom);
        system.step(0);
        expect(system.particles).toHaveLength(7);
    });

    it('spreads instant particles evenly across the angle range', () => {
        const system = createParticleSystem(
            [emitter({ particles: 4, angleRange: { min: 0, max: 360 } })],
            ORIGIN,
            fixedRandom,
        );
        system.step(0);
        expect(system.particles.map((p) => p.angle)).toEqual([0, 90, 180, 270]);
    });

    it('holds a delayed emitter back until its delay has passed', () => {
        const system = createParticleSystem(
            [emitter({ particles: 3, emissionDelay: 100 })],
            ORIGIN,
            fixedRandom,
        );
        run(system, 96);
        expect(system.particles).toHaveLength(0);
        system.step(16);
        expect(system.particles).toHaveLength(3);
    });

    it('emits a timed emitter at its rate, whatever the frame length', () => {
        const config = emitter({ particles: 100, emissionRate: 10, lifeTime: 10_000 });
        const smallSteps = createParticleSystem([config], ORIGIN, fixedRandom);
        const oneStep = createParticleSystem([config], ORIGIN, fixedRandom);
        run(smallSteps, 1000, 4);
        oneStep.step(1000);
        // One at the start, then one every 100ms.
        expect(smallSteps.particles).toHaveLength(11);
        expect(oneStep.particles).toHaveLength(11);
    });

    it('stops a timed emitter after its duration or when it runs out of particles', () => {
        const byDuration = createParticleSystem(
            [emitter({ particles: 100, emissionRate: 10, emissionDuration: 300, lifeTime: 5000 })],
            ORIGIN,
            fixedRandom,
        );
        const byCount = createParticleSystem(
            [emitter({ particles: 3, emissionRate: 100, lifeTime: 5000 })],
            ORIGIN,
            fixedRandom,
        );
        run(byDuration, 2000);
        run(byCount, 2000);
        expect(byDuration.particles).toHaveLength(4);
        expect(byCount.particles).toHaveLength(3);
    });

    it('removes particles at the end of their lifetime and only then reports done', () => {
        const system = createParticleSystem([emitter({ lifeTime: 500 })], ORIGIN, fixedRandom);
        run(system, 496);
        expect(system.particles).toHaveLength(5);
        expect(system.done).toBe(false);
        system.step(4);
        expect(system.particles).toHaveLength(0);
        expect(system.done).toBe(true);
    });

    it('is not done while a delayed emitter is still waiting', () => {
        const system = createParticleSystem(
            [emitter({ lifeTime: 50 }), emitter({ lifeTime: 50, emissionDelay: 1000 })],
            ORIGIN,
            fixedRandom,
        );
        run(system, 500);
        expect(system.particles).toHaveLength(0);
        expect(system.done).toBe(false);
    });

    it('spawns particles on the circle when circularRadius is set', () => {
        const system = createParticleSystem(
            [emitter({ particles: 10, circularRadius: 40 })],
            ORIGIN,
            Math.random,
        );
        system.step(0);
        system.particles.forEach((p) => {
            expect(Math.hypot(p.x - ORIGIN.x, p.y - ORIGIN.y)).toBeCloseTo(40);
        });
    });

    it('moves particles at their speed and curves them with angleChange', () => {
        const straight = createParticleSystem(
            [
                emitter({
                    particles: 1,
                    speedRange: { min: 100, max: 100 },
                    angleRange: { min: 0, max: 0 },
                }),
            ],
            ORIGIN,
            fixedRandom,
        );
        const curved = createParticleSystem(
            [
                emitter({
                    particles: 1,
                    speedRange: { min: 100, max: 100 },
                    angleRange: { min: 0, max: 0 },
                    angleChange: 90,
                }),
            ],
            ORIGIN,
            fixedRandom,
        );
        straight.step(0);
        straight.step(250);
        curved.step(0);
        curved.step(250);
        expect(straight.particles[0]?.x).toBeCloseTo(125);
        expect(straight.particles[0]?.y).toBeCloseTo(100);
        expect(curved.particles[0]?.angle).toBeCloseTo(22.5);
        expect(curved.particles[0]?.y).toBeGreaterThan(100);
    });

    it('slows particles by the same amount per second at any frame rate', () => {
        const config = emitter({
            particles: 1,
            speedRange: { min: 100, max: 100 },
            angleRange: { min: 0, max: 0 },
            damping: 0.9,
            lifeTime: 5000,
        });
        const at60 = createParticleSystem([config], ORIGIN, fixedRandom);
        const at240 = createParticleSystem([config], ORIGIN, fixedRandom);
        run(at60, 1000, 1000 / 60);
        run(at240, 1000, 1000 / 240);
        expect(at240.particles[0]?.vx).toBeCloseTo(at60.particles[0]?.vx ?? NaN);
    });

    it('runs attached emitters from each parent particle until the parent dies', () => {
        const trail = emitter({ particles: 1000, emissionRate: 100, lifeTime: 100 });
        const system = createParticleSystem(
            [
                emitter({
                    particles: 2,
                    speedRange: { min: 50, max: 50 },
                    lifeTime: 300,
                    particleEmitters: [trail],
                }),
            ],
            ORIGIN,
            fixedRandom,
        );
        run(system, 288);
        expect(system.particles.length).toBeGreaterThan(2);
        run(system, 400);
        expect(system.particles).toHaveLength(0);
        expect(system.done).toBe(true);
    });
});

describe('particlesDue', () => {
    it('counts one particle at the start and one per interval, capped by particles', () => {
        const config = emitter({ particles: 4, emissionRate: 20 });
        expect(particlesDue(config, 0)).toBe(1);
        expect(particlesDue(config, 49)).toBe(1);
        expect(particlesDue(config, 50)).toBe(2);
        expect(particlesDue(config, 10_000)).toBe(4);
    });
});

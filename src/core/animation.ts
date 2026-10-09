import { clearCanvas, drawParticle } from './render';
import type { ParticleSystem } from './particleSystem';

/** Longest step the simulation takes in one frame, so a stalled tab does not jump. */
export const MAX_FRAME_MS = 32;

/**
 * Steps and draws `system` on every animation frame until it is done, then clears the
 * canvas and calls `onDone`. Returns a function that stops the animation early.
 */
export const runAnimation = (
    system: ParticleSystem,
    ctx: CanvasRenderingContext2D,
    onDone: () => void,
): (() => void) => {
    let frameId = 0;
    let last: number | undefined;

    const frame = (now: number) => {
        const dt = last === undefined ? 0 : Math.min(MAX_FRAME_MS, now - last);
        last = now;
        system.step(dt);
        clearCanvas(ctx);
        system.particles.forEach((particle) => {
            drawParticle(ctx, particle);
        });
        if (system.done) {
            onDone();
            return;
        }
        frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => {
        cancelAnimationFrame(frameId);
        clearCanvas(ctx);
    };
};

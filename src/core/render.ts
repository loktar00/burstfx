import { lerpRgb } from './color';
import { isImageReady, loadImage } from './images';
import { clamp, degToRad, lerp } from './math';
import type { Particle } from './particleSystem';

/** Shrinking particles start this much larger and settle to their real size, which reads as a pop. */
const SHRINK_POP_SCALE = 0.4;
const FULL_TURN = Math.PI * 2;

const drawnSize = (p: Particle, progress: number): number => {
    const size = lerp(p.startSize, p.endSize, progress);
    const pop = p.startSize === p.endSize ? 0 : SHRINK_POP_SCALE * (1 - progress);
    return size * (1 + pop);
};

const drawCircle = (
    ctx: CanvasRenderingContext2D,
    p: Particle,
    radius: number,
    progress: number,
) => {
    const { r, g, b } = lerpRgb(p.startColor, p.endColor, progress);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, FULL_TURN);
    ctx.fill();
};

/** Draws one particle. Images that are still loading fall back to a circle. */
export const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle): void => {
    const progress = p.life / p.ttl;
    const size = drawnSize(p, progress);
    const image = p.image === undefined ? undefined : loadImage(p.image);
    ctx.save();
    if (p.blend) {
        ctx.globalCompositeOperation = 'lighter';
    }
    ctx.globalAlpha = clamp(lerp(p.startAlpha, p.endAlpha, progress), 0, 1);
    ctx.translate(p.x, p.y);
    ctx.rotate(degToRad(p.drawAngle + p.drawAngleOffset));
    if (image && isImageReady(image)) {
        ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
        drawCircle(ctx, p, size, progress);
    }
    ctx.restore();
};

/** Clears the whole backing store, whatever transform is currently set. */
export const clearCanvas = (ctx: CanvasRenderingContext2D): void => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
};

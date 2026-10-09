import { useLayoutEffect, type RefObject } from 'react';

/** Matches the canvas backing store to its wrapper's size at the device pixel ratio. */
export const sizeCanvas = (wrap: HTMLElement, canvas: HTMLCanvasElement): void => {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
};

export const useCanvasResize = (
    wrapRef: RefObject<HTMLElement | null>,
    canvasRef: RefObject<HTMLCanvasElement | null>,
): void => {
    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) {
            return undefined;
        }
        const handleResize = () => {
            sizeCanvas(wrap, canvas);
        };
        handleResize();
        const observer =
            typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(handleResize);
        observer?.observe(wrap);
        // Zooming changes devicePixelRatio without resizing the wrapper.
        window.addEventListener('resize', handleResize);
        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [wrapRef, canvasRef]);
};

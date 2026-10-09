import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';

import { runAnimation } from './animation';
import { createParticleSystem } from './particleSystem';
import { prefersReducedMotion } from './reducedMotion';
import type { EffectEmitterConfig } from './types';
import { useCanvasResize } from './useCanvasResize';

/** Default width and height of the effect area, in CSS pixels. Override with `style`. */
export const DEFAULT_EFFECT_SIZE = 550;

export interface EffectBaseProps {
    /** Change this value to play the effect again. It also plays once on mount. */
    trigger: number;
    /** The particle streams to play. Read when the effect starts. */
    emitters: EffectEmitterConfig[];
    /** Called once the last particle is gone, or straight away under reduced motion. */
    onDone?: () => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

const wrapperStyle: CSSProperties = {
    position: 'absolute',
    display: 'inline-block',
    width: DEFAULT_EFFECT_SIZE,
    height: DEFAULT_EFFECT_SIZE,
    pointerEvents: 'none',
};

const canvasStyle: CSSProperties = { position: 'absolute', inset: 0, pointerEvents: 'none' };

/** Plays a set of emitters on a canvas, centred in the wrapper, every time `trigger` changes. */
export const EffectBase = ({
    trigger,
    emitters,
    onDone,
    className,
    style,
    children,
}: EffectBaseProps) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Parents usually pass fresh arrays and callbacks on every render; only `trigger` restarts.
    const emittersRef = useRef(emitters);
    const onDoneRef = useRef(onDone);

    useLayoutEffect(() => {
        emittersRef.current = emitters;
        onDoneRef.current = onDone;
    });

    useCanvasResize(wrapRef, canvasRef);

    useEffect(() => {
        const handleDone = () => {
            onDoneRef.current?.();
        };
        if (prefersReducedMotion()) {
            handleDone();
            return undefined;
        }
        const wrap = wrapRef.current;
        const ctx = canvasRef.current?.getContext('2d');
        if (!wrap || !ctx) {
            return undefined;
        }
        const { width, height } = wrap.getBoundingClientRect();
        const system = createParticleSystem(emittersRef.current, { x: width / 2, y: height / 2 });
        return runAnimation(system, ctx, handleDone);
    }, [trigger]);

    return (
        <div ref={wrapRef} className={className} style={{ ...wrapperStyle, ...style }}>
            {children}
            <canvas ref={canvasRef} aria-hidden="true" style={canvasStyle} />
        </div>
    );
};

import { act, render } from '@testing-library/react';

import { installFakeFrames, mockCanvasContext } from '../test/canvas';
import { EffectBase } from './EffectBase';
import type { EffectEmitterConfig } from './types';

const LIFETIME_MS = 500;
const emitters: EffectEmitterConfig[] = [
    {
        particles: 3,
        speedRange: { min: 10, max: 10 },
        angleRange: { min: 0, max: 360 },
        size: 2,
        lifeTime: LIFETIME_MS,
    },
];

const advance = (ms: number) => {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
};

beforeEach(() => {
    mockCanvasContext();
    installFakeFrames();
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe('EffectBase', () => {
    it('plays on mount and calls onDone once the last particle has lived out its lifetime', () => {
        const onDone = vi.fn();
        render(<EffectBase trigger={1} emitters={emitters} onDone={onDone} />);
        advance(LIFETIME_MS - 100);
        expect(onDone).not.toHaveBeenCalled();
        advance(200);
        expect(onDone).toHaveBeenCalledTimes(1);
        advance(1000);
        expect(onDone).toHaveBeenCalledTimes(1);
    });

    it('plays again when trigger changes', () => {
        const onDone = vi.fn();
        const { rerender } = render(<EffectBase trigger={1} emitters={emitters} onDone={onDone} />);
        advance(1000);
        rerender(<EffectBase trigger={2} emitters={emitters} onDone={onDone} />);
        advance(1000);
        expect(onDone).toHaveBeenCalledTimes(2);
    });

    it('keeps playing through re-renders with the same trigger and reports to the latest onDone', () => {
        const first = vi.fn();
        const latest = vi.fn();
        const { rerender } = render(<EffectBase trigger={1} emitters={emitters} onDone={first} />);
        advance(200);
        rerender(<EffectBase trigger={1} emitters={[...emitters]} onDone={latest} />);
        // Finishes on the original schedule; a restart would run until 200 + LIFETIME_MS.
        advance(LIFETIME_MS - 100);
        expect(first).not.toHaveBeenCalled();
        expect(latest).toHaveBeenCalledTimes(1);
    });

    it('skips the animation and calls onDone straight away under reduced motion', () => {
        vi.stubGlobal('matchMedia', (query: string) => ({
            matches: query === '(prefers-reduced-motion: reduce)',
        }));
        const onDone = vi.fn();
        render(<EffectBase trigger={1} emitters={emitters} onDone={onDone} />);
        expect(onDone).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    it('cancels the animation frame on unmount and never calls onDone', () => {
        const onDone = vi.fn();
        const { unmount } = render(<EffectBase trigger={1} emitters={emitters} onDone={onDone} />);
        advance(100);
        expect(vi.getTimerCount()).toBe(1);
        unmount();
        expect(vi.getTimerCount()).toBe(0);
        advance(1000);
        expect(onDone).not.toHaveBeenCalled();
    });

    it('sizes the canvas backing store for the device pixel ratio', () => {
        vi.stubGlobal('devicePixelRatio', 2);
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
            new DOMRect(0, 0, 120, 80),
        );
        const { container } = render(<EffectBase trigger={1} emitters={emitters} />);
        const canvas = container.querySelector('canvas');
        expect(canvas?.width).toBe(240);
        expect(canvas?.height).toBe(160);
        expect(canvas?.style.width).toBe('120px');
    });
});

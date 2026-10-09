/** jsdom has no canvas; this stands in for the 2D context at the browser boundary. */
export const mockCanvasContext = () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
        this: HTMLCanvasElement,
    ) {
        const ctx = {
            canvas: this,
            save: vi.fn(),
            restore: vi.fn(),
            setTransform: vi.fn(),
            clearRect: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            drawImage: vi.fn(),
            globalAlpha: 1,
            globalCompositeOperation: 'source-over',
            fillStyle: '',
        };
        return ctx as unknown as CanvasRenderingContext2D;
    });
};

export const installFakeFrames = () => {
    vi.useFakeTimers({
        toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'performance'],
    });
};

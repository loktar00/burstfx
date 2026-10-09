import { act, render } from '@testing-library/react';
import type { ComponentType } from 'react';

import * as burstfx from '../index';
import { installFakeFrames, mockCanvasContext } from '../test/canvas';
import type { EmojiEffectProps } from './types';

const effects = Object.entries(burstfx).filter(
    ([name]) => name.endsWith('Effect') && name !== 'EffectBase',
) as [string, ComponentType<EmojiEffectProps>][];

beforeEach(() => {
    mockCanvasContext();
    installFakeFrames();
});

afterEach(() => {
    vi.useRealTimers();
});

describe('effects', () => {
    it('exports all fourteen effects', () => {
        expect(effects).toHaveLength(14);
    });

    it.each(effects)('%s plays to the end and calls onDone once', (_, Effect) => {
        const onDone = vi.fn();
        render(<Effect trigger={1} onDone={onDone} emojiImage="data:image/png;base64," />);
        act(() => {
            vi.advanceTimersByTime(10_000);
        });
        expect(onDone).toHaveBeenCalledTimes(1);
    });
});

import type { CSSProperties, ReactNode } from 'react';

import type { Range } from '../core/math';

/** Props every effect accepts. */
export interface EffectProps {
    /** Change this value to play the effect again. It also plays once on mount. */
    trigger: number;
    /** Called once the effect has finished, or straight away under reduced motion. */
    onDone?: () => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

export interface IntensityEffectProps extends EffectProps {
    /** Scales the particle count (and for some effects the emission rate). */
    intensity?: number;
}

export interface EmojiEffectProps extends IntensityEffectProps {
    /** Image URL drawn in place of plain particles, usually an emoji. */
    emojiImage?: string;
}

export const FULL_CIRCLE: Range = { min: 0, max: 360 };

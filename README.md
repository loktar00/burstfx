# burstfx

Small canvas particle effects for React: star bursts, fire, confetti, fireworks, rockets and more. Each effect is one component. Mount it (or change its `trigger`) and it plays once, cleans up after itself and tells you when it is done.

- One canvas per effect, sized for the device pixel ratio
- Honours `prefers-reduced-motion`: the animation is skipped and `onDone` fires straight away
- Stops its animation frame when unmounted
- No runtime dependencies beyond React 18 or newer
- The engine is exported, so you can build your own effects

## Install

From GitHub:

```sh
npm i github:loktar00/burstfx#v0.1.0
```

The package builds itself on install (`prepare`), so no built files are committed.

From npm, once it is published:

```sh
npm i burstfx
```

## Usage

```tsx
import { useState } from 'react';
import { ConfettiEffect } from 'burstfx';

export const CelebrateButton = () => {
    const [trigger, setTrigger] = useState(0);
    const [playing, setPlaying] = useState(false);

    const handleClick = () => {
        setPlaying(true);
        setTrigger((count) => count + 1);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button type="button" onClick={handleClick}>
                Celebrate
            </button>
            {playing && (
                <ConfettiEffect
                    trigger={trigger}
                    onDone={() => setPlaying(false)}
                    style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                />
            )}
        </div>
    );
};
```

Every effect renders an absolutely positioned, click-through box (550 by 550 pixels by default) and plays from its centre. Position and size it with `style` or `className`. Anything you pass as `children` is rendered inside the box, under the canvas.

The effect plays once when it mounts and again whenever `trigger` changes. Re-rendering with the same `trigger` does not restart it, even if you pass a new `onDone` function; the latest `onDone` is the one that gets called.

## Effects

Every effect takes these props:

| Prop        | Type            | Description                                                             |
| ----------- | --------------- | ----------------------------------------------------------------------- |
| `trigger`   | `number`        | Required. Change it to play the effect again.                           |
| `onDone`    | `() => void`    | Called when the last particle is gone, or at once under reduced motion. |
| `className` | `string`        | Class for the effect box.                                               |
| `style`     | `CSSProperties` | Styles for the effect box, merged over the defaults.                    |
| `children`  | `ReactNode`     | Rendered inside the box.                                                |

Effect specific props:

| Effect               | Props (default)                                       | What it looks like                                        |
| -------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| `StarBurstEffect`    | `particles` (8), `speed` (120), `color` (`'#ffd54f'`) | A quick bright burst with a sparkle ring and glowing core |
| `FireEffect`         | `intensity` (20)                                      | Three seconds of embers rising and fading to smoke        |
| `SparkleEffect`      | `intensity` (12)                                      | Half a second of fast twinkling sparks                    |
| `ConfettiEffect`     | `intensity` (15)                                      | Six colours of confetti tumbling down                     |
| `EmojiRainEffect`    | `intensity` (10), `emojiImage`                        | Two seconds of falling emoji                              |
| `WaveEffect`         | `intensity` (6), `emojiImage`                         | Five rings expanding outward                              |
| `VortexEffect`       | `intensity` (10), `emojiImage`                        | Three spiralling rings, then an outward explosion         |
| `FireworksEffect`    | `intensity` (8)                                       | Four shells bursting at random spots and times            |
| `AuraEffect`         | `intensity` (6), `emojiImage`                         | Orbiting particles with a soft glow and sparkles          |
| `ElectricEffect`     | `intensity` (8), `emojiImage`                         | A spinning core with lightning, crackle and afterglow     |
| `RainbowCycleEffect` | `intensity` (10), `emojiImage`                        | Colour-shifting bursts in several rings                   |
| `MultiburstEffect`   | `intensity` (6), `emojiImage`                         | Three bursts around the centre, one after another         |
| `HolyEffect`         | `intensity` (8), `emojiImage`                         | The emoji floating upward with soft light and sparkles    |
| `RocketEffect`       | `intensity` (20), `emojiImage`                        | Three rockets lifting off, each with a fire trail         |

`intensity` scales the particle count. `emojiImage` is an image URL (a data URL works) drawn in place of plain particles; without it those effects draw coloured dots. `RocketEffect` is meant to be given a rocket emoji: the image is turned to face the direction of travel.

## Authoring your own effect

An effect is a list of emitters handed to `EffectBase`. Each emitter describes one stream of particles; positions are in pixels from the centre of the box, angles are in degrees (0 points right, 90 points down) and times are in milliseconds.

```tsx
import { EffectBase, type EffectEmitterConfig } from 'burstfx';

interface HeartsEffectProps {
    trigger: number;
    onDone?: () => void;
}

const hearts: EffectEmitterConfig[] = [
    // A ring of pink dots, all at once.
    {
        particles: 24,
        speedRange: { min: 60, max: 90 },
        angleRange: { min: 0, max: 360 },
        size: 4,
        endSize: 0,
        lifeTime: { min: 600, max: 900 },
        startColor: '#ff4d8d',
        endColor: '#ffffff',
        endAlpha: 0,
        blend: true,
        damping: 0.97,
    },
    // Then a stream of drifting hearts for one second.
    {
        particles: 20,
        emissionRate: 20,
        emissionDuration: 1000,
        emissionDelay: 150,
        speedRange: { min: 20, max: 40 },
        angleRange: { min: -120, max: -60 },
        size: { min: 14, max: 20 },
        lifeTime: 1500,
        endAlpha: 0,
        image: '/heart.png',
        drawAngleChange: { min: -45, max: 45 },
    },
];

export const HeartsEffect = ({ trigger, onDone }: HeartsEffectProps) => (
    <EffectBase trigger={trigger} emitters={hearts} onDone={onDone} />
);
```

Any numeric option written as `number | Range` can be a fixed value or `{ min, max }`, picked at random per particle.

| Option                           | Description                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `particles`                      | Total particles the emitter spawns.                                                         |
| `x`, `y`                         | Emitter position, offset from the centre.                                                   |
| `particleOffset.x`, `.y`         | Extra random offset per particle.                                                           |
| `circularRadius`                 | Spawn particles on a circle of this radius instead of at the emitter.                       |
| `speedRange`                     | Initial speed in pixels per second.                                                         |
| `angleRange`                     | Direction. Instant emitters spread particles evenly; timed emitters pick at random.         |
| `size`, `endSize`                | Radius (or image size) at birth and death. `endSize` defaults to `size`.                    |
| `lifeTime`                       | How long each particle lives.                                                               |
| `color` or `startColor/endColor` | `#rrggbb`. Ignored for particles drawn as an image once it has loaded.                      |
| `alpha`, `endAlpha`              | Opacity at birth (default 1) and death (default `alpha`).                                   |
| `image`                          | Image URL to draw instead of a circle.                                                      |
| `emissionRate`                   | Particles per second. Leave it out to emit everything at once.                              |
| `emissionDuration`               | Stop a timed emitter after this long.                                                       |
| `emissionDelay`                  | Wait before starting.                                                                       |
| `angleChange`                    | Degrees per second the direction of travel turns, which curves the path.                    |
| `drawAngleChange`                | Degrees per second the drawn particle spins.                                                |
| `alignToAngle`                   | Rotate the drawn particle to face its direction of travel.                                  |
| `drawAngleOffset`                | Fixed rotation added when drawing, for sprites that do not point right.                     |
| `blend`                          | Additive blending, so overlapping particles glow.                                           |
| `damping`                        | Velocity multiplier per 60fps frame (default 1). Scaled so it behaves the same at any rate. |
| `particleEmitters`               | Emitters attached to every particle; they follow it and stop when it dies.                  |

Particles that change size are drawn up to 40% larger at birth and settle to their real size, which reads as a pop. Particles with a fixed size are drawn as is.

## Development

```sh
npm install
npm run dev     # demo page with a button per effect
npm run lint    # ESLint and Prettier
npm test        # Vitest
npm run build   # dist/index.js and type declarations
```

## License

MIT, copyright 2026 Jason Brown.

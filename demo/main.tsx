import { StrictMode, useMemo, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

import {
    AuraEffect,
    ConfettiEffect,
    ElectricEffect,
    EmojiRainEffect,
    FireEffect,
    FireworksEffect,
    HolyEffect,
    MultiburstEffect,
    RainbowCycleEffect,
    RocketEffect,
    SparkleEffect,
    StarBurstEffect,
    VortexEffect,
    WaveEffect,
    type EmojiEffectProps,
} from '../src';
import { emojiToDataUrl } from './emoji';

interface DemoEffect {
    name: string;
    component: ComponentType<EmojiEffectProps>;
    /** Emoji handed to effects that draw an image. */
    emoji?: string;
}

const DEMO_EFFECTS: DemoEffect[] = [
    { name: 'StarBurst', component: StarBurstEffect },
    { name: 'Fire', component: FireEffect },
    { name: 'Sparkle', component: SparkleEffect },
    { name: 'Confetti', component: ConfettiEffect },
    { name: 'EmojiRain', component: EmojiRainEffect, emoji: '😂' },
    { name: 'Wave', component: WaveEffect, emoji: '👋' },
    { name: 'Vortex', component: VortexEffect, emoji: '🌀' },
    { name: 'Fireworks', component: FireworksEffect },
    { name: 'Aura', component: AuraEffect, emoji: '✨' },
    { name: 'Electric', component: ElectricEffect, emoji: '⚡' },
    { name: 'RainbowCycle', component: RainbowCycleEffect },
    { name: 'Multiburst', component: MultiburstEffect, emoji: '🎉' },
    { name: 'Holy', component: HolyEffect, emoji: '🙏' },
    { name: 'Rocket', component: RocketEffect, emoji: '🚀' },
];

interface Playing {
    effect: DemoEffect;
    trigger: number;
}

const Demo = () => {
    const [playing, setPlaying] = useState<Playing | undefined>();
    const [status, setStatus] = useState('Pick an effect.');

    const emoji = playing?.effect.emoji;
    const emojiImage = useMemo(() => (emoji ? emojiToDataUrl(emoji) : undefined), [emoji]);

    const handlePlay = (effect: DemoEffect) => {
        setPlaying((current) => ({ effect, trigger: (current?.trigger ?? 0) + 1 }));
        setStatus(`Playing ${effect.name}...`);
    };

    const handleDone = () => {
        setStatus(`${playing?.effect.name ?? 'Effect'} finished.`);
    };

    return (
        <main className="page">
            <h1>burstfx</h1>
            <p>Canvas particle effects for React. Click an effect to play it.</p>
            <div className="controls" role="toolbar" aria-label="Effects">
                {DEMO_EFFECTS.map((effect) => (
                    <button
                        key={effect.name}
                        type="button"
                        onClick={() => {
                            handlePlay(effect);
                        }}
                    >
                        {effect.emoji ? `${effect.emoji} ` : ''}
                        {effect.name}
                    </button>
                ))}
            </div>
            <div className="stage">
                <span className="stage_label" aria-hidden="true">
                    {playing?.effect.emoji ?? '⭐'}
                </span>
                {playing && (
                    <playing.effect.component
                        key={playing.effect.name}
                        className="effect"
                        trigger={playing.trigger}
                        emojiImage={emojiImage}
                        onDone={handleDone}
                    />
                )}
            </div>
            <p role="status">{status}</p>
        </main>
    );
};

const root = document.getElementById('root');
if (root) {
    createRoot(root).render(
        <StrictMode>
            <Demo />
        </StrictMode>,
    );
}

const EMOJI_PX = 64;

/** Draws an emoji to an offscreen canvas so the effects have an image to use. */
export const emojiToDataUrl = (emoji: string): string => {
    const canvas = document.createElement('canvas');
    canvas.width = EMOJI_PX;
    canvas.height = EMOJI_PX;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return '';
    }
    ctx.font = `${EMOJI_PX * 0.8}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, EMOJI_PX / 2, EMOJI_PX / 2 + EMOJI_PX * 0.05);
    return canvas.toDataURL();
};

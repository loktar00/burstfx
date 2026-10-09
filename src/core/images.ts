const cache = new Map<string, HTMLImageElement>();

/** Starts loading `src` once and returns the shared image element for it. */
export const loadImage = (src: string): HTMLImageElement => {
    const cached = cache.get(src);
    if (cached) {
        return cached;
    }
    const image = new Image();
    image.src = src;
    cache.set(src, image);
    return image;
};

export const isImageReady = (image: HTMLImageElement): boolean =>
    image.complete && image.naturalWidth > 0;

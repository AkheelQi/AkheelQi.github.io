import { useEffect, useRef } from "react";

/**
 * Renders a photo as chunky pixel art: downsample to a tiny canvas, then
 * upscale with nearest-neighbour (image-rendering: pixelated).
 */
export function PixelPhoto({
  src,
  alt,
  pixels = 56,
  className = "",
}: {
  src: string;
  alt: string;
  pixels?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const ratio = img.naturalHeight / Math.max(1, img.naturalWidth);
      const w = pixels;
      const h = Math.max(1, Math.round(pixels * ratio));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
    };
  }, [src, pixels]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={alt}
      className={`pixel-sprite block h-auto w-full ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
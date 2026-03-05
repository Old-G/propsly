const noiseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="300" height="300" filter="url(#n)" opacity="1"/></svg>`;

const noiseDataUrl = `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`;

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        opacity: 0.03,
        backgroundImage: noiseDataUrl,
        backgroundRepeat: "repeat",
        pointerEvents: "none",
      }}
    />
  );
}

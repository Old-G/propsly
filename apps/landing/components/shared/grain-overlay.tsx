const dotSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="0.8" fill="white"/></svg>`;

const dotDataUrl = `url("data:image/svg+xml,${encodeURIComponent(dotSvg)}")`;

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity: 0.15,
        backgroundImage: dotDataUrl,
        backgroundRepeat: "repeat",
        pointerEvents: "none",
      }}
    />
  );
}

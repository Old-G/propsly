const sizes = {
  sm: { dimension: 200, blur: 40 },
  md: { dimension: 400, blur: 80 },
  lg: { dimension: 600, blur: 120 },
} as const;

interface GlowProps {
  size?: keyof typeof sizes;
  className?: string;
}

export function Glow({ size = "md", className }: GlowProps) {
  const { dimension, blur } = sizes[size];

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        width: dimension,
        height: dimension,
        maxWidth: "100vw",
        borderRadius: "9999px",
        background: "var(--accent-glow)",
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

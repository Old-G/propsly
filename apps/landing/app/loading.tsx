export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <span className="heading-display text-3xl italic opacity-0 animate-pulse">
            Propsly<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <span className="heading-display text-3xl italic absolute inset-0 animate-pulse">
            Propsly<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </div>

        {/* Spinner bar */}
        <div
          className="w-48 h-0.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--border-default)" }}
        >
          <div
            className="h-full w-1/3 rounded-full animate-[shimmer_1.2s_ease-in-out_infinite]"
            style={{ background: "var(--accent)" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(450%); }
        }
      `}</style>
    </div>
  );
}

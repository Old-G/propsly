export default function LoginLoading() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% 40%, var(--accent-glow), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-[420px] p-8">
        {/* Logo skeleton */}
        <div
          className="h-8 w-24 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        {/* Heading skeleton */}
        <div
          className="mt-8 mb-6 h-7 w-40 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        {/* Button skeletons */}
        <div className="space-y-3">
          <div
            className="h-12 w-full rounded-lg animate-pulse"
            style={{ backgroundColor: "var(--bg-surface)" }}
          />
          <div
            className="h-12 w-full rounded-lg animate-pulse"
            style={{ backgroundColor: "var(--bg-surface)", animationDelay: "0.1s" }}
          />
        </div>

        {/* Link skeleton */}
        <div className="mt-6 flex justify-center">
          <div
            className="h-4 w-48 rounded-md animate-pulse"
            style={{ backgroundColor: "var(--bg-surface)" }}
          />
        </div>
      </div>
    </div>
  );
}

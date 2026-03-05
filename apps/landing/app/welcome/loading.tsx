export default function WelcomeLoading() {
  return (
    <main className="mx-auto max-w-[600px] px-6 py-20">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div
          className="w-16 h-16 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />
      </div>

      {/* Heading */}
      <div className="flex justify-center mb-2">
        <div
          className="h-8 w-64 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />
      </div>
      <div className="flex justify-center mb-8">
        <div
          className="h-5 w-48 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />
      </div>

      {/* Form card */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
        }}
      >
        <div
          className="h-4 w-48 rounded-md animate-pulse mb-4"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        />
        <div
          className="h-24 w-full rounded-lg animate-pulse mb-4"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        />
        <div
          className="h-10 w-full rounded-lg animate-pulse"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        />
      </div>
    </main>
  );
}

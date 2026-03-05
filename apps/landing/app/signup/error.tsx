"use client";

import Link from "next/link";

export default function SignupError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% 40%, var(--accent-glow), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-[420px] p-8 text-center">
        <p className="heading-display text-2xl italic">
          Propsly<span className="text-[var(--accent)]">.</span>
        </p>

        <div
          className="mt-8 w-12 h-12 mx-auto rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--error)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="mt-4 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
          Sign up error
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Something went wrong. Please try again.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button onClick={reset} className="btn-primary w-full justify-center text-sm">
            Try Again
          </button>
          <Link href="/" className="text-sm transition-colors" style={{ color: "var(--text-secondary)" }}>
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

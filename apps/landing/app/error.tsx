"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Glitch-style error icon */}
        <div className="relative inline-block mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            <svg
              width="28"
              height="28"
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
        </div>

        <h1 className="heading-display text-3xl sm:text-4xl mb-3">
          Something went wrong
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          An unexpected error occurred. This has been logged and we&apos;ll look into it.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary text-sm">
            Try Again
          </button>
          <a href="/" className="btn-secondary text-sm">
            Go Home
          </a>
        </div>

        {error.digest && (
          <p
            className="mt-6 font-mono text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

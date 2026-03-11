import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[var(--text-tertiary)]">404</p>
      <h1 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)]"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}

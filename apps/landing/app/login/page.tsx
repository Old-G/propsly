import Link from "next/link";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata = {
  title: "Log In — Propsly",
  description: "Log in to your Propsly account.",
  robots: { index: false, follow: false },
};

function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="mb-4 rounded-md border border-[var(--error)]/30 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
      Authentication failed. Please try again.
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorParam = params.error ?? null;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      {/* Radial glow behind card */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% 40%, var(--accent-glow), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[420px] p-8">
        {/* Logo */}
        <p className="heading-display text-2xl italic">
          Propsly<span className="text-[var(--accent)]">.</span>
        </p>

        {/* Heading */}
        <h1 className="mt-8 mb-6 text-xl font-medium text-[var(--text-primary)]">
          Welcome back
        </h1>

        {/* Server-side error from query param */}
        <ErrorBanner error={errorParam} />

        {/* OAuth buttons */}
        <OAuthButtons />

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Sign up &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}

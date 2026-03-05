import Link from "next/link";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata = {
  title: "Sign Up — Propsly",
  description: "Create your Propsly account to start building beautiful proposals.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
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
          Create your account
        </h1>

        {/* OAuth buttons */}
        <OAuthButtons />

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Log in &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}

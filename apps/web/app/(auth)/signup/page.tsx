import Link from "next/link"
import { OAuthButtons } from "@/components/auth/oauth-buttons"

export const metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-[420px] p-8">
      <p className="heading-display text-2xl italic">
        Propsly<span className="text-[var(--accent)]">.</span>
      </p>
      <h1 className="mt-8 mb-6 text-xl font-medium">Create your account</h1>
      <OAuthButtons />
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
  )
}

"use client";

import { ArrowUpRight } from "lucide-react";
import { signOut } from "@/app/welcome/actions";
import { useRouter } from "next/navigation";

interface WelcomeHeroProps {
  user: {
    email: string;
    full_name?: string;
  };
}

const links = [
  {
    label: "Star us on GitHub",
    href: "https://github.com/propsly/propsly",
    external: true,
  },
  {
    label: "Join our Discord",
    href: "https://discord.gg/propsly",
    external: true,
  },
  {
    label: "Follow us on X",
    href: "https://x.com/propsly",
    external: true,
  },
  {
    label: "Read our blog",
    href: "/blog",
    external: false,
  },
];

export function WelcomeHero({ user }: WelcomeHeroProps) {
  const router = useRouter();
  const firstName = user.full_name?.split(" ")[0] || "there";

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="heading-display text-3xl sm:text-4xl">
          Welcome to Propsly, {firstName}!
        </h1>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Thanks for believing in us. We&apos;re building something special and
          you&apos;re one of the first people on board. Your account is ready.
          When we launch, you&apos;ll get full access — no extra steps.
          We&apos;ll email you at{" "}
          <span className="text-[var(--text-primary)] font-medium">
            {user.email}
          </span>
          .
        </p>
      </div>

      <div
        className="rounded-xl border border-[var(--border-default)] p-6"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <h2 className="text-sm font-medium mb-4 text-[var(--text-primary)]">
          While you wait:
        </h2>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSignOut}
        className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] underline transition-colors cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}

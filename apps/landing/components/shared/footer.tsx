import Link from "next/link";

const productLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/open-source", label: "Open Source" },
  { href: "/contact", label: "Contact" },
];

const communityLinks = [
  { href: "https://github.com/Old-G/propsly", label: "GitHub", external: true },
  { href: "https://x.com/oldg9516", label: "Twitter/X", external: true },
];

export function Footer() {
  return (
    <footer
      className="px-[var(--content-padding-x)] py-16"
      style={{ borderTop: "1px solid var(--border-default)" }}
    >
      <div className="mx-auto max-w-[var(--content-max-width)]">
        <div className="grid gap-8 sm:gap-12 sm:grid-cols-3 mb-12">
          {/* Brand */}
          <div>
            <div className="heading-display text-xl italic mb-3">
              Propsly<span style={{ color: "var(--accent)" }}>.</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Open-source proposal platform. Create beautiful interactive
              proposals as web pages.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-medium mb-4">Community</h4>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div
          className="pt-8 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            &copy; 2026 Propsly. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/terms" className="hover:text-[var(--text-secondary)] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</Link>
            <span>Cooked with ☕ &amp; late nights</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

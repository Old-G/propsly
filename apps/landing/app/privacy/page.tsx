import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Propsly — how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 max-w-[800px] mx-auto pt-32 pb-20 px-6">
        <h1 className="heading-display text-4xl sm:text-5xl mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
          Last updated: March 5, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              1. Overview
            </h2>
            <p>
              Propsly (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This
              policy explains how we collect, use, and safeguard your information when you use our
              cloud-hosted service at propsly.org. If you self-host Propsly, your data stays
              entirely on your infrastructure and this policy does not apply.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              2. Information We Collect
            </h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Account information:</strong> Name,
                email address, and profile picture provided through OAuth (Google, GitHub).
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Proposal content:</strong> The
                proposals, templates, and documents you create within the Service.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Usage data:</strong> Analytics on
                how you interact with the Service (page views, feature usage) via Vercel Analytics.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Proposal tracking data:</strong>{" "}
                When recipients view proposals, we collect view timestamps, approximate location,
                device type, and time spent on sections.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain the Service</li>
              <li>To authenticate your identity and secure your account</li>
              <li>To send transactional emails (welcome, proposal notifications)</li>
              <li>To provide proposal tracking and analytics to proposal senders</li>
              <li>To improve the Service based on usage patterns</li>
              <li>To communicate important updates about the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              4. Data Storage and Security
            </h2>
            <p>
              Your data is stored securely on Supabase (PostgreSQL) with row-level security
              policies. All data is encrypted in transit (TLS) and at rest. We do not sell, rent,
              or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              5. Third-Party Services
            </h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Supabase</strong> — authentication
                and database hosting
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Vercel</strong> — application hosting
                and analytics
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Resend</strong> — transactional email
                delivery
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Sentry</strong> — error monitoring
              </li>
            </ul>
            <p className="mt-3">
              Each service has its own privacy policy. We only share the minimum data necessary for
              each service to function.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access and export your data at any time</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Self-host Propsly to maintain full control over your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              7. Cookies
            </h2>
            <p>
              We use essential cookies for authentication and session management. We do not use
              third-party tracking cookies. Vercel Analytics is privacy-focused and does not use
              cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              8. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account,
              we will delete your personal data and proposal content within 30 days. Anonymized
              analytics data may be retained indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              9. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not intended for children under 16. We do not knowingly collect
              information from children under 16.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify users of material
              changes via email. The &quot;Last updated&quot; date at the top indicates the latest revision.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              11. Contact
            </h2>
            <p>
              For privacy-related inquiries,{" "}
              <a href="/contact" className="text-[var(--accent)] hover:underline">
                contact us here
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

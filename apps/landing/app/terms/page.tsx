import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Propsly — the open-source proposal platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto pt-32 pb-20 px-6">
        <h1 className="heading-display text-4xl sm:text-5xl mb-8">
          Terms of Service
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
          Last updated: March 5, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Propsly (&quot;Service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              2. Description of Service
            </h2>
            <p>
              Propsly is an open-source proposal platform that allows users to create interactive
              proposals as web pages. The Service is available as a cloud-hosted solution and as
              self-hosted software under the AGPL-3.0 license.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              3. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You must provide accurate and
              complete information when creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Use the Service to send spam or unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              5. Intellectual Property
            </h2>
            <p>
              The Propsly software is licensed under AGPL-3.0. You retain all rights to the content
              you create using the Service, including proposals, templates, and associated data.
              We claim no ownership over your content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              6. Data and Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <a href="/privacy" className="text-[var(--accent)] hover:underline">
                Privacy Policy
              </a>
              . By using the Service, you consent to the collection and use of information as
              described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              7. Service Availability
            </h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access to
              the Service. We may modify, suspend, or discontinue any part of the Service at any
              time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Propsly and its contributors shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages
              arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              9. Termination
            </h2>
            <p>
              We may terminate or suspend your access to the Service at any time for violation of
              these terms. Upon termination, you may export your data. For self-hosted instances,
              you retain full control of your data at all times.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              10. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify users of material changes
              via email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: "var(--text-primary)" }}>
              11. Contact
            </h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:hello@propsly.org" className="text-[var(--accent)] hover:underline">
                hello@propsly.org
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

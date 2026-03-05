import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "Open Source — Propsly",
  description:
    "Propsly is open-source under AGPL-3.0. View the source, self-host, or contribute to the project.",
};

export default function OpenSourcePage() {
  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto pt-32 pb-20 px-6">
        <span className="section-label">OPEN SOURCE</span>
        <h1 className="heading-display text-4xl sm:text-5xl mt-4">
          Built in the open
        </h1>
        <p
          className="mt-4 text-lg max-w-xl"
          style={{ color: "var(--text-secondary)" }}
        >
          Propsly is licensed under AGPL-3.0. View the source, self-host, or
          contribute.
        </p>

        {/* Why open source */}
        <section className="mt-16">
          <h2 className="heading-display text-2xl mb-4">Why open source</h2>
          <div
            className="space-y-4 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <p>
              Proposals contain sensitive business data -- pricing, strategy,
              client details. You deserve full transparency into the software
              that handles it. Open source means you can audit every line of
              code that touches your data.
            </p>
            <p>
              We believe the best tools are built with their users, not just for
              them. By developing in the open, we get direct feedback, catch
              issues faster, and build trust through accountability.
            </p>
            <p>
              Open source also means freedom. You are never locked in. If
              Propsly Cloud does not fit your needs, self-host it. If we
              disappear tomorrow, the code lives on. Your workflows and data are
              always yours.
            </p>
          </div>
        </section>

        {/* Self-hosting */}
        <section className="mt-16">
          <h2 className="heading-display text-2xl mb-4">Self-hosting</h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Run Propsly on your own infrastructure with Docker. Full control,
            no usage limits, no data leaving your network.
          </p>
          <div
            className="rounded-xl p-4 overflow-x-auto"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            <pre className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
              <code>{`# Clone the repository
git clone https://github.com/propsly/propsly.git
cd propsly

# Start with Docker Compose
docker compose up -d

# Propsly is now running at http://localhost:3000`}</code>
            </pre>
          </div>
        </section>

        {/* Contributing */}
        <section className="mt-16">
          <h2 className="heading-display text-2xl mb-4">Contributing</h2>
          <div
            className="space-y-4 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <p>
              We welcome contributions of all kinds -- bug reports, feature
              requests, documentation improvements, and code. Here is how to get
              started:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Issues:</strong>{" "}
                Found a bug or have a feature idea? Open an issue on GitHub.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Pull Requests:</strong>{" "}
                Fork the repo, create a branch, and submit a PR. We review
                everything.
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Discussions:</strong>{" "}
                Join our GitHub Discussions or Discord to chat with the team and
                community.
              </li>
            </ul>
          </div>
        </section>

        {/* License */}
        <section className="mt-16">
          <h2 className="heading-display text-2xl mb-4">License</h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Propsly is licensed under the{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              GNU Affero General Public License v3.0 (AGPL-3.0)
            </strong>
            . This means you can use, modify, and distribute the software
            freely, as long as any modified version you deploy over a network is
            also open-sourced under the same license. This ensures the project
            and its derivatives remain open and accessible to everyone.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="https://github.com/propsly/propsly"
            className="btn-secondary inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star us on GitHub
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

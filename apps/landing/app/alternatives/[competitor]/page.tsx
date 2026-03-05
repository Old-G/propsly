import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ComparisonTable } from "@/components/alternatives/comparison-table";
import { getCompetitor, getAllCompetitorSlugs } from "@/lib/competitors";

interface PageProps {
  params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
  return getAllCompetitorSlugs().map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitor: slug } = await params;
  const competitor = getCompetitor(slug);

  if (!competitor) {
    return { title: "Not Found" };
  }

  return {
    title: `Propsly vs ${competitor.name} \u2014 Open-Source Alternative`,
    description: `Switch from ${competitor.name} (${competitor.price}) to Propsly \u2014 a free, open-source, and self-hostable proposal platform with interactive pricing, e-signatures, and tracking.`,
    openGraph: {
      title: `Propsly vs ${competitor.name} \u2014 Open-Source Alternative`,
      description: `Switch from ${competitor.name} to Propsly. Free, open-source, self-hostable.`,
    },
  };
}

export default async function CompetitorPage({ params }: PageProps) {
  const { competitor: slug } = await params;
  const competitor = getCompetitor(slug);

  if (!competitor) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto pt-32 pb-20 px-6" style={{ maxWidth: "var(--content-max-width)" }}>
        {/* Section 1: Hero */}
        <section className="mb-20">
          <p className="section-label">Alternative</p>
          <h1 className="heading-display text-4xl sm:text-5xl mb-6">
            {competitor.tagline}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Switch from {competitor.name} ({competitor.price}) to Propsly &mdash; free,
            open-source, and self-hostable.
          </p>
        </section>

        {/* Section 2: Problems */}
        <section className="mb-20">
          <h2 className="heading-display text-2xl sm:text-3xl mb-8">
            Why teams are switching from {competitor.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {competitor.problems.map((problem) => (
              <div
                key={problem}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "var(--error)" }}
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {problem}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Comparison table */}
        <section className="mb-20">
          <h2 className="heading-display text-2xl sm:text-3xl mb-8">
            {competitor.name} vs Propsly
          </h2>
          <ComparisonTable features={competitor.features} competitorName={competitor.name} />
        </section>

        {/* Section 4: CTA */}
        <section className="text-center">
          <h2 className="heading-display text-2xl sm:text-3xl mb-4">
            Ready to switch?
          </h2>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            Get started with Propsly for free. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary">
              Get Started Free &rarr;
            </Link>
            <a
              href="https://github.com/Old-G/propsly"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Star on GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

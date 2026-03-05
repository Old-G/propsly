import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Big 404 */}
          <div className="mb-6">
            <span
              className="font-mono text-8xl sm:text-9xl font-bold"
              style={{ color: "var(--accent)", opacity: 0.2 }}
            >
              404
            </span>
          </div>

          <h1 className="heading-display text-3xl sm:text-4xl mb-3">
            Page not found
          </h1>
          <p
            className="text-sm mb-8 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn-primary text-sm">
              Go Home
            </Link>
            <Link href="/contact" className="btn-secondary text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function BlogPostLoading() {
  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto pt-32 pb-20 px-6">
        {/* Back link */}
        <div
          className="h-4 w-28 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        {/* Date */}
        <div
          className="mt-8 mb-4 h-3 w-40 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        {/* Title */}
        <div
          className="h-10 w-3/4 rounded-md animate-pulse mb-6"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        {/* Content lines */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-5 rounded-md animate-pulse"
              style={{
                backgroundColor: "var(--bg-surface)",
                width: `${70 + Math.random() * 30}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

function CardSkeleton() {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div
        className="h-4 w-20 rounded-md animate-pulse mb-4"
        style={{ backgroundColor: "var(--bg-elevated)" }}
      />
      <div
        className="h-6 w-3/4 rounded-md animate-pulse mb-3"
        style={{ backgroundColor: "var(--bg-elevated)" }}
      />
      <div className="space-y-2">
        <div
          className="h-4 w-full rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        />
        <div
          className="h-4 w-2/3 rounded-md animate-pulse"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[var(--content-max-width)] pt-32 pb-20 px-6">
        <div
          className="h-12 w-24 rounded-md animate-pulse mb-4"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />
        <div
          className="h-6 w-80 rounded-md animate-pulse mb-12"
          style={{ backgroundColor: "var(--bg-surface)" }}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

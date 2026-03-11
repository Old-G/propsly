import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="border-b border-[var(--border-default)]">
        <div className="mx-auto max-w-[var(--content-narrow)] px-[var(--content-padding-x)] py-6 sm:py-8">
          <Skeleton className="h-9 w-72 sm:h-10" />
          <Skeleton className="mt-3 h-4 w-48" />
          <Skeleton className="mt-3 h-6 w-24" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1">
        <div className="mx-auto max-w-[var(--content-narrow)] px-[var(--content-padding-x)] py-8 sm:py-12 space-y-6">
          {/* Paragraph block */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Heading */}
          <Skeleton className="h-7 w-56" />

          {/* Paragraph block */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Image placeholder */}
          <Skeleton className="h-64 w-full rounded-xl sm:h-80" />

          {/* Paragraph block */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Another heading */}
          <Skeleton className="h-7 w-40" />

          {/* List items */}
          <div className="space-y-3 pl-4">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="border-t border-[var(--border-default)]">
        <div className="mx-auto max-w-[var(--content-narrow)] px-[var(--content-padding-x)] py-6">
          <Skeleton className="mx-auto h-3 w-32" />
        </div>
      </div>
    </div>
  )
}

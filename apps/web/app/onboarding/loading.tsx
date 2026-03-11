import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-1 flex-1 rounded-full" />
          <Skeleton className="h-1 flex-1 rounded-full" />
          <Skeleton className="h-1 flex-1 rounded-full" />
          <Skeleton className="h-1 flex-1 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full max-w-[420px] p-8 space-y-6">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-6 w-36" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <Skeleton className="h-10 w-full" />
      <div className="flex flex-1">
        <div className="flex-1 p-8 space-y-4">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="w-80 h-full" />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useCallback } from "react"

export function useInfiniteScroll(onLoadMore: () => void, hasMore: boolean, loading: boolean) {
  const observerRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [onLoadMore, hasMore, loading]
  )

  useEffect(() => {
    const element = observerRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: "200px",
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [handleObserver])

  return observerRef
}

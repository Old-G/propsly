"use client"

import { useState, useCallback } from "react"

interface UseInfiniteListOptions<T> {
  initialItems: T[]
  totalCount: number
  fetchMore: (offset: number) => Promise<{ items: T[]; totalCount: number }>
}

export function useInfiniteList<T>({
  initialItems,
  totalCount,
  fetchMore,
}: UseInfiniteListOptions<T>) {
  const [state, setState] = useState({
    items: initialItems,
    source: initialItems,
    loadingMore: false,
    hasMore: initialItems.length < totalCount,
  })

  // Sync when server data changes (render-time state derivation)
  if (state.source !== initialItems) {
    setState({
      items: initialItems,
      source: initialItems,
      loadingMore: false,
      hasMore: initialItems.length < totalCount,
    })
  }

  const loadMore = useCallback(async () => {
    setState((prev) => {
      if (prev.loadingMore || !prev.hasMore) return prev
      return { ...prev, loadingMore: true }
    })

    const currentLength = state.items.length
    const result = await fetchMore(currentLength)

    setState((prev) => ({
      ...prev,
      items: [...prev.items, ...result.items],
      loadingMore: false,
      hasMore: prev.items.length + result.items.length < result.totalCount,
    }))
  }, [state.items.length, fetchMore])

  return {
    items: state.items,
    loadMore,
    loadingMore: state.loadingMore,
    hasMore: state.hasMore,
  }
}

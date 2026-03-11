"use client"

import { useEffect, useRef, useCallback } from "react"

interface SectionTiming {
  nodeIndex: number
  blockId: string
  blockType: string
  timeMs: number
}

interface ProposalTrackerProps {
  proposalId: string
}

const BATCH_INTERVAL_MS = 10_000
const TRACKED_SELECTORS = "h1, h2, h3, h4, h5, h6, p, figure, blockquote, ul, ol, table, pre, hr, [data-type]"

function fireAndForget(url: string, body: Record<string, unknown>) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Silently ignore tracking errors
  })
}

function sendBeaconJson(url: string, body: Record<string, unknown>) {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: "application/json" })
    navigator.sendBeacon(url, blob)
  } else {
    fireAndForget(url, body)
  }
}

export function ProposalTracker({ proposalId }: ProposalTrackerProps) {
  const viewIdRef = useRef<string | null>(null)
  const timingsRef = useRef<Map<number, SectionTiming>>(new Map())
  const activeTimersRef = useRef<Map<number, number>>(new Map())
  const batchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const flushSections = useCallback(
    (useSendBeacon = false) => {
      const sections = Array.from(timingsRef.current.values()).filter(
        (s) => s.timeMs > 0
      )
      if (sections.length === 0 || !viewIdRef.current) return

      const payload = {
        event: "sections" as const,
        proposalId,
        viewId: viewIdRef.current,
        sections: sections.map((s) => ({
          nodeIndex: s.nodeIndex,
          blockId: s.blockId,
          blockType: s.blockType,
          timeMs: s.timeMs,
        })),
      }

      if (useSendBeacon) {
        sendBeaconJson("/api/tracking", payload)
      } else {
        fireAndForget("/api/tracking", payload)
      }

      // Reset accumulated times after sending
      for (const section of timingsRef.current.values()) {
        section.timeMs = 0
      }
    },
    [proposalId]
  )

  useEffect(() => {
    // Record the view and get a viewId for section tracking
    // The server-side page already records a view directly to Supabase,
    // so the API rate-limit will return the existing viewId if within 1 minute
    fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "view", proposalId }),
      keepalive: true,
    })
      .then((res) => res.json())
      .then((data: { viewId?: string }) => {
        if (data.viewId) {
          viewIdRef.current = data.viewId
        }
      })
      .catch(() => {
        // Silently ignore tracking errors
      })

    // Set up Intersection Observer for content blocks
    const contentContainer = document.querySelector("main")
    if (!contentContainer) return

    const blocks = contentContainer.querySelectorAll(TRACKED_SELECTORS)
    if (blocks.length === 0) return

    // Initialize timings for each block
    blocks.forEach((block, index) => {
      const blockType =
        (block as HTMLElement).dataset?.type ||
        block.tagName.toLowerCase()
      const blockId =
        block.id || `block-${index}`

      timingsRef.current.set(index, {
        nodeIndex: index,
        blockId,
        blockType,
        timeMs: 0,
      })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now()
        for (const entry of entries) {
          const index = Array.from(blocks).indexOf(entry.target as Element)
          if (index === -1) continue

          if (entry.isIntersecting) {
            // Start timing
            activeTimersRef.current.set(index, now)
          } else {
            // Stop timing — accumulate
            const startTime = activeTimersRef.current.get(index)
            if (startTime !== undefined) {
              const elapsed = now - startTime
              const timing = timingsRef.current.get(index)
              if (timing) {
                timing.timeMs += elapsed
              }
              activeTimersRef.current.delete(index)
            }
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    )

    blocks.forEach((block) => observer.observe(block))

    // Batch send every 10 seconds
    batchIntervalRef.current = setInterval(() => {
      // Snapshot active timers
      const now = Date.now()
      for (const [index, startTime] of activeTimersRef.current.entries()) {
        const timing = timingsRef.current.get(index)
        if (timing) {
          timing.timeMs += now - startTime
        }
        // Reset the start time to now
        activeTimersRef.current.set(index, now)
      }
      flushSections(false)
    }, BATCH_INTERVAL_MS)

    // Flush on visibility change and beforeunload
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        // Snapshot active timers before flushing
        const now = Date.now()
        for (const [index, startTime] of activeTimersRef.current.entries()) {
          const timing = timingsRef.current.get(index)
          if (timing) {
            timing.timeMs += now - startTime
          }
          activeTimersRef.current.set(index, now)
        }
        flushSections(true)
      }
    }

    function handleBeforeUnload() {
      const now = Date.now()
      for (const [index, startTime] of activeTimersRef.current.entries()) {
        const timing = timingsRef.current.get(index)
        if (timing) {
          timing.timeMs += now - startTime
        }
      }
      flushSections(true)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      observer.disconnect()
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [proposalId, flushSections])

  // This component renders nothing — it's purely a side-effect tracker
  return null
}

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { SignatureType } from "../extensions/signature-block"

interface SignatureBlockViewerProps {
  proposalId: string
  signedBy?: string
  signedAt?: string
  signatureData?: string
  signatureType?: SignatureType
}

type TabId = "type" | "draw"

export function SignatureBlockViewer({
  proposalId,
  signedBy,
  signedAt,
  signatureData,
  signatureType,
}: SignatureBlockViewerProps) {
  const isSigned = signatureType && signatureType !== "none" && signedBy

  const [activeTab, setActiveTab] = useState<TabId>("type")
  const [typedName, setTypedName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(!!isSigned)
  const [completedName, setCompletedName] = useState(signedBy ?? "")
  const [completedAt, setCompletedAt] = useState(signedAt ?? "")
  const [completedData, setCompletedData] = useState(signatureData ?? "")
  const [completedType, setCompletedType] = useState<SignatureType>(
    signatureType ?? "none"
  )

  // Canvas refs and state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const pathsRef = useRef<Array<Array<{ x: number; y: number }>>>([])
  const currentPathRef = useRef<Array<{ x: number; y: number }>>([])

  const getCanvasPoint = useCallback(
    (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      if ("touches" in e) {
        const touch = e.touches[0]
        if (!touch) return null
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    },
    []
  )

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "var(--text-primary, #fff)"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Compute the style to get CSS variable resolved
    const computed = getComputedStyle(canvas)
    const color = computed.getPropertyValue("color").trim() || "#ffffff"
    ctx.strokeStyle = color

    const allPaths = [...pathsRef.current]
    if (currentPathRef.current.length > 0) {
      allPaths.push(currentPathRef.current)
    }

    for (const path of allPaths) {
      if (path.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.stroke()
    }
  }, [])

  const handlePointerStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      isDrawingRef.current = true
      const point = getCanvasPoint(e)
      if (point) {
        currentPathRef.current = [point]
      }
    },
    [getCanvasPoint]
  )

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return
      e.preventDefault()
      const point = getCanvasPoint(e)
      if (point) {
        currentPathRef.current.push(point)
        redrawCanvas()
      }
    },
    [getCanvasPoint, redrawCanvas]
  )

  const handlePointerEnd = useCallback(() => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    if (currentPathRef.current.length > 1) {
      pathsRef.current.push([...currentPathRef.current])
      setHasDrawn(true)
    }
    currentPathRef.current = []
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Mouse events
    canvas.addEventListener("mousedown", handlePointerStart)
    canvas.addEventListener("mousemove", handlePointerMove)
    canvas.addEventListener("mouseup", handlePointerEnd)
    canvas.addEventListener("mouseleave", handlePointerEnd)

    // Touch events
    canvas.addEventListener("touchstart", handlePointerStart, {
      passive: false,
    })
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false })
    canvas.addEventListener("touchend", handlePointerEnd)
    canvas.addEventListener("touchcancel", handlePointerEnd)

    return () => {
      canvas.removeEventListener("mousedown", handlePointerStart)
      canvas.removeEventListener("mousemove", handlePointerMove)
      canvas.removeEventListener("mouseup", handlePointerEnd)
      canvas.removeEventListener("mouseleave", handlePointerEnd)
      canvas.removeEventListener("touchstart", handlePointerStart)
      canvas.removeEventListener("touchmove", handlePointerMove)
      canvas.removeEventListener("touchend", handlePointerEnd)
      canvas.removeEventListener("touchcancel", handlePointerEnd)
    }
  }, [handlePointerStart, handlePointerMove, handlePointerEnd])

  const clearCanvas = useCallback(() => {
    pathsRef.current = []
    currentPathRef.current = []
    setHasDrawn(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const canvasToSvg = useCallback((): string => {
    const canvas = canvasRef.current
    if (!canvas) return ""

    const paths = pathsRef.current
    if (paths.length === 0) return ""

    const svgPaths = paths
      .map((path) => {
        if (path.length < 2) return ""
        const d = path
          .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
          .join(" ")
        return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      })
      .filter(Boolean)
      .join("")

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" style="width:100%;height:auto;color:var(--text-primary,#fff)">${svgPaths}</svg>`
  }, [])

  const handleSign = useCallback(async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      let name: string
      let sigType: SignatureType
      let sigData: string | undefined

      if (activeTab === "type") {
        if (!typedName.trim()) {
          setError("Please enter your name")
          setIsSubmitting(false)
          return
        }
        name = typedName.trim()
        sigType = "typed"
      } else {
        if (!hasDrawn) {
          setError("Please draw your signature")
          setIsSubmitting(false)
          return
        }
        // Use typed name if provided, otherwise "Signed"
        name = typedName.trim() || "Signed"
        sigType = "drawn"
        sigData = canvasToSvg()
      }

      const response = await fetch(`/api/proposals/${proposalId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          signatureType: sigType,
          signatureData: sigData,
        }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error ?? "Failed to sign proposal")
      }

      const data = (await response.json()) as { signedAt: string }

      setCompleted(true)
      setCompletedName(name)
      setCompletedAt(data.signedAt)
      setCompletedData(sigData ?? "")
      setCompletedType(sigType)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign proposal")
    } finally {
      setIsSubmitting(false)
    }
  }, [activeTab, typedName, hasDrawn, proposalId, canvasToSvg])

  if (completed) {
    return (
      <div
        style={{
          border: "1px solid var(--accent, #34d399)",
          borderRadius: "8px",
          padding: "32px",
          background: "var(--bg-surface, #1a1a1a)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "16px",
            color: "var(--accent, #34d399)",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Signed
        </div>
        {completedType === "drawn" && completedData ? (
          <div
            style={{
              maxWidth: "300px",
              margin: "0 auto 12px",
            }}
            dangerouslySetInnerHTML={{ __html: completedData }}
          />
        ) : (
          <div
            style={{
              fontFamily: "var(--font-instrument-serif, Georgia, serif)",
              fontSize: "32px",
              fontStyle: "italic",
              color: "var(--text-primary, #fff)",
              marginBottom: "12px",
            }}
          >
            {completedName}
          </div>
        )}
        {completedAt && (
          <div style={{ fontSize: "13px", color: "var(--text-tertiary, #666)" }}>
            {completedName} signed on{" "}
            {new Date(completedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        border: "1px solid var(--border-default, #333)",
        borderRadius: "8px",
        padding: "24px",
        background: "var(--bg-surface, #1a1a1a)",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-primary, #fff)",
            marginBottom: "4px",
          }}
        >
          Sign this proposal
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary, #888)",
          }}
        >
          By signing, you agree to the terms outlined in this proposal.
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginBottom: "20px",
          borderBottom: "1px solid var(--border-default, #333)",
        }}
      >
        {(["type", "draw"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--accent, #34d399)"
                  : "2px solid transparent",
              color:
                activeTab === tab
                  ? "var(--text-primary, #fff)"
                  : "var(--text-secondary, #888)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {tab === "type" ? "Type" : "Draw"}
          </button>
        ))}
      </div>

      {/* Type tab */}
      {activeTab === "type" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              htmlFor="signature-name"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-secondary, #888)",
                marginBottom: "6px",
              }}
            >
              Full name
            </label>
            <input
              id="signature-name"
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value)
                setError(null)
              }}
              placeholder="Enter your full name"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border-default, #333)",
                borderRadius: "6px",
                background: "transparent",
                color: "var(--text-primary, #fff)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          {typedName.trim() && (
            <div
              style={{
                padding: "20px",
                border: "1px solid var(--border-default, #333)",
                borderRadius: "6px",
                textAlign: "center",
                background: "var(--bg-primary, #0a0a0a)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  color: "var(--text-tertiary, #666)",
                  marginBottom: "8px",
                }}
              >
                Preview
              </div>
              <div
                style={{
                  fontFamily:
                    "var(--font-instrument-serif, Georgia, serif)",
                  fontSize: "32px",
                  fontStyle: "italic",
                  color: "var(--text-primary, #fff)",
                }}
              >
                {typedName.trim()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Draw tab */}
      {activeTab === "draw" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              position: "relative",
              border: "1px solid var(--border-default, #333)",
              borderRadius: "6px",
              overflow: "hidden",
              background: "transparent",
            }}
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              style={{
                width: "100%",
                height: "200px",
                cursor: "crosshair",
                touchAction: "none",
                display: "block",
                color: "var(--text-primary, #fff)",
              }}
            />
            {!hasDrawn && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "13px",
                  color: "var(--text-tertiary, #666)",
                  pointerEvents: "none",
                }}
              >
                Draw your signature here
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={clearCanvas}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-default, #333)",
                background: "transparent",
                color: "var(--text-secondary, #888)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
          <div>
            <label
              htmlFor="signature-draw-name"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-secondary, #888)",
                marginBottom: "6px",
              }}
            >
              Full name (optional)
            </label>
            <input
              id="signature-draw-name"
              type="text"
              value={typedName}
              onChange={(e) => {
                setTypedName(e.target.value)
                setError(null)
              }}
              placeholder="Enter your full name"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border-default, #333)",
                borderRadius: "6px",
                background: "transparent",
                color: "var(--text-primary, #fff)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "13px",
            color: "#ef4444",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Sign button */}
      <button
        type="button"
        onClick={handleSign}
        disabled={isSubmitting}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          background: isSubmitting
            ? "var(--text-tertiary, #666)"
            : "var(--accent, #34d399)",
          color: "#000",
          fontSize: "15px",
          fontWeight: 600,
          cursor: isSubmitting ? "not-allowed" : "pointer",
          transition: "background 0.15s",
        }}
      >
        {isSubmitting ? "Signing..." : "Sign proposal"}
      </button>
    </div>
  )
}

"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { useCallback, useRef, useState } from "react"
import {
  parseVideoUrl,
  type VideoProvider,
} from "../extensions/video-block"

const PROVIDER_LABELS: Record<VideoProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom",
  unknown: "Video",
}

export function VideoBlockView({ node, updateAttributes, selected }: NodeViewProps) {
  const src = node.attrs.src as string | null
  const provider = node.attrs.provider as VideoProvider
  const originalUrl = node.attrs.originalUrl as string | null
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(() => {
    const result = parseVideoUrl(inputValue)
    if (!result) {
      setError("Unsupported URL. Please paste a YouTube, Vimeo, or Loom link.")
      return
    }
    setError(null)
    updateAttributes({
      src: result.embedSrc,
      provider: result.provider,
      originalUrl: inputValue.trim(),
    })
    setInputValue("")
  }, [inputValue, updateAttributes])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text/plain")
      if (pasted) {
        const result = parseVideoUrl(pasted)
        if (result) {
          e.preventDefault()
          setError(null)
          updateAttributes({
            src: result.embedSrc,
            provider: result.provider,
            originalUrl: pasted.trim(),
          })
          setInputValue("")
        }
      }
    },
    [updateAttributes]
  )

  const handleClear = useCallback(() => {
    updateAttributes({
      src: null,
      provider: "unknown",
      originalUrl: null,
    })
    setError(null)
    setInputValue("")
  }, [updateAttributes])

  if (!src) {
    return (
      <NodeViewWrapper
        data-type="videoBlock"
        style={{
          border: `1px ${selected ? "solid" : "dashed"} var(--border-default, #333)`,
          borderRadius: "8px",
          padding: "24px",
          background: "var(--bg-surface, #1a1a1a)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "8px", color: "var(--text-secondary, #888)" }}>
          Embed a video
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Paste YouTube, Vimeo, or Loom URL..."
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "8px 12px",
            border: `1px solid ${error ? "#ef4444" : "var(--border-default, #333)"}`,
            borderRadius: "6px",
            background: "transparent",
            color: "var(--text-primary, #fff)",
            fontSize: "14px",
            outline: "none",
          }}
        />
        {error && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}
        {inputValue.trim() && !error && (
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              marginTop: "8px",
              padding: "6px 16px",
              borderRadius: "6px",
              border: "none",
              background: "var(--accent, #34d399)",
              color: "#000",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Embed
          </button>
        )}
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      data-type="videoBlock"
      style={{
        border: selected
          ? "2px solid var(--accent, #34d399)"
          : "1px solid var(--border-default, #333)",
        borderRadius: "8px",
        overflow: "hidden",
        background: "var(--bg-surface, #1a1a1a)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9
        }}
      >
        <iframe
          src={src}
          title={`${PROVIDER_LABELS[provider]} video`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          fontSize: "12px",
          color: "var(--text-secondary, #888)",
        }}
      >
        <span>
          {PROVIDER_LABELS[provider]}
          {originalUrl ? ` — ${originalUrl}` : ""}
        </span>
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: "2px 8px",
            borderRadius: "4px",
            border: "1px solid var(--border-default, #333)",
            background: "transparent",
            color: "var(--text-secondary, #888)",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </NodeViewWrapper>
  )
}

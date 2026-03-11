"use client"

import { useCallback, useRef, useState } from "react"
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import type { ImageBlockAlignment } from "../extensions/image-block"

interface ResizeState {
  startX: number
  startWidth: number
}

export function ImageBlockView({ node, updateAttributes, selected, editor }: NodeViewProps) {
  const { src, alt, title, width, alignment } = node.attrs as {
    src: string | null
    alt: string
    title: string
    width: number
    alignment: ImageBlockAlignment
  }

  const [isEditingAlt, setIsEditingAlt] = useState(false)
  const [altValue, setAltValue] = useState(alt)
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const resizeRef = useRef<ResizeState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isEditable = editor.isEditable

  const handleResize = useCallback(
    (direction: "left" | "right") => (event: React.MouseEvent) => {
      event.preventDefault()

      const container = containerRef.current
      if (!container) return

      const containerWidth = container.parentElement?.clientWidth ?? container.clientWidth
      const startX = event.clientX
      const startWidthPx = (width / 100) * containerWidth

      resizeRef.current = { startX, startWidth: startWidthPx }
      setIsDragging(true)

      const onMouseMove = (e: MouseEvent) => {
        if (!resizeRef.current) return

        const diff = direction === "right"
          ? e.clientX - resizeRef.current.startX
          : resizeRef.current.startX - e.clientX

        const newWidthPx = resizeRef.current.startWidth + diff * (alignment === "center" ? 2 : 1)
        const newWidthPercent = Math.round(
          Math.min(100, Math.max(25, (newWidthPx / containerWidth) * 100))
        )

        updateAttributes({ width: newWidthPercent })
      }

      const onMouseUp = () => {
        resizeRef.current = null
        setIsDragging(false)
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    },
    [width, alignment, updateAttributes]
  )

  const handleSetAlignment = useCallback(
    (newAlignment: ImageBlockAlignment) => {
      updateAttributes({ alignment: newAlignment })
    },
    [updateAttributes]
  )

  const handleDoubleClick = useCallback(() => {
    if (!isEditable) return
    setAltValue(alt)
    setIsEditingAlt(true)
  }, [alt, isEditable])

  const handleAltSubmit = useCallback(() => {
    updateAttributes({ alt: altValue })
    setIsEditingAlt(false)
  }, [altValue, updateAttributes])

  const handleAltKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAltSubmit()
      }
      if (e.key === "Escape") {
        setIsEditingAlt(false)
      }
    },
    [handleAltSubmit]
  )

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const file = e.dataTransfer.files[0]
      if (!file || !file.type.startsWith("image/")) return

      uploadFile(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      uploadFile(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const uploadFile = useCallback(
    (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        console.error("Image must be under 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        console.error("File must be an image")
        return
      }

      // Dispatch a custom event that the host app can listen to for upload handling
      const uploadEvent = new CustomEvent("imageblock:upload", {
        detail: {
          file,
          onSuccess: (url: string) => {
            updateAttributes({ src: url })
          },
          onError: (error: string) => {
            console.error("Upload failed:", error)
          },
        },
        bubbles: true,
      })

      containerRef.current?.dispatchEvent(uploadEvent)
    },
    [updateAttributes]
  )

  const alignmentClass =
    alignment === "left"
      ? "mr-auto"
      : alignment === "full-width"
        ? "w-full"
        : "mx-auto"

  // Upload placeholder when no src
  if (!src) {
    return (
      <NodeViewWrapper data-drag-handle="">
        <div
          ref={containerRef}
          className={`my-4 ${alignmentClass}`}
          style={{ width: alignment === "full-width" ? "100%" : `${width}%` }}
        >
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
              isDragOver
                ? "border-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border-default)] bg-[var(--bg-surface)]"
            }`}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--text-secondary)]"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm text-[var(--text-secondary)]">
              Drag and drop an image, or{" "}
              <label className="cursor-pointer text-[var(--accent)] underline">
                browse
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Max 5MB
            </p>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper data-drag-handle="">
      <figure
        ref={containerRef}
        className={`group relative my-4 ${alignmentClass}`}
        style={{ width: alignment === "full-width" ? "100%" : `${width}%` }}
      >
        {/* Image */}
        <div className="relative" onDoubleClick={handleDoubleClick}>
          <img
            src={src}
            alt={alt}
            title={title}
            className={`w-full rounded-md ${
              selected ? "ring-2 ring-[var(--accent)]" : ""
            }`}
            draggable={false}
          />

          {/* Resize handles (visible on hover or when selected) */}
          {isEditable && (
            <>
              <div
                role="separator"
                aria-orientation="vertical"
                className={`absolute left-0 top-0 flex h-full w-3 cursor-col-resize items-center justify-center ${
                  selected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
                onMouseDown={handleResize("left")}
              >
                <div className="h-8 w-1 rounded-full bg-[var(--accent)]" />
              </div>
              <div
                role="separator"
                aria-orientation="vertical"
                className={`absolute right-0 top-0 flex h-full w-3 cursor-col-resize items-center justify-center ${
                  selected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
                onMouseDown={handleResize("right")}
              >
                <div className="h-8 w-1 rounded-full bg-[var(--accent)]" />
              </div>
            </>
          )}
        </div>

        {/* Alignment controls (visible when selected and editable) */}
        {isEditable && selected && (
          <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-1 py-1 shadow-lg">
            <button
              type="button"
              title="Align left"
              onClick={() => handleSetAlignment("left")}
              className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
                alignment === "left"
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="15" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="15" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              title="Align center"
              onClick={() => handleSetAlignment("center")}
              className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
                alignment === "center"
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="6" y1="18" x2="18" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              title="Full width"
              onClick={() => handleSetAlignment("full-width")}
              className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
                alignment === "full-width"
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Alt text editor */}
        {isEditingAlt && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 shadow-lg">
            <label className="shrink-0 text-xs text-[var(--text-secondary)]">
              Alt:
            </label>
            <input
              type="text"
              value={altValue}
              onChange={(e) => setAltValue(e.target.value)}
              onKeyDown={handleAltKeyDown}
              onBlur={handleAltSubmit}
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
              placeholder="Describe this image..."
              autoFocus
            />
          </div>
        )}

        {/* Width indicator while resizing */}
        {isDragging && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-secondary)] shadow-lg">
            {width}%
          </div>
        )}
      </figure>
    </NodeViewWrapper>
  )
}

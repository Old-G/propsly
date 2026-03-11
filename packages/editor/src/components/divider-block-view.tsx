"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { useCallback, useState } from "react"
import type { DividerStyle, DividerSpacing } from "../extensions/divider-block"

const SPACING_MAP: Record<DividerSpacing, number> = {
  sm: 16,
  md: 32,
  lg: 48,
}

const STYLE_OPTIONS: { value: DividerStyle; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "gradient", label: "Gradient" },
]

const SPACING_OPTIONS: { value: DividerSpacing; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
]

export function DividerBlockView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const dividerStyle = (node.attrs.style as DividerStyle) ?? "solid"
  const spacing = (node.attrs.spacing as DividerSpacing) ?? "md"
  const [showToolbar, setShowToolbar] = useState(false)

  const paddingY = SPACING_MAP[spacing]

  const handleStyleChange = useCallback(
    (newStyle: DividerStyle) => {
      updateAttributes({ style: newStyle })
    },
    [updateAttributes]
  )

  const handleSpacingChange = useCallback(
    (newSpacing: DividerSpacing) => {
      updateAttributes({ spacing: newSpacing })
    },
    [updateAttributes]
  )

  const hrStyles: React.CSSProperties =
    dividerStyle === "gradient"
      ? {
          border: "none",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, var(--border-default, #333), transparent)",
          margin: 0,
        }
      : {
          border: "none",
          borderTop: `1px ${dividerStyle} var(--border-default, #333)`,
          margin: 0,
        }

  return (
    <NodeViewWrapper
      data-type="dividerBlock"
      style={{
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => setShowToolbar((prev) => !prev)}
    >
      <hr style={hrStyles} />

      {(selected || showToolbar) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px",
            borderRadius: "6px",
            border: "1px solid var(--border-default, #333)",
            background: "var(--bg-surface, #1a1a1a)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 10,
            fontSize: "11px",
            whiteSpace: "nowrap",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStyleChange(opt.value)}
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                border:
                  dividerStyle === opt.value
                    ? "1px solid var(--accent, #34d399)"
                    : "1px solid transparent",
                background:
                  dividerStyle === opt.value
                    ? "rgba(52, 211, 153, 0.1)"
                    : "transparent",
                color:
                  dividerStyle === opt.value
                    ? "var(--accent, #34d399)"
                    : "var(--text-secondary, #888)",
                cursor: "pointer",
                fontSize: "11px",
              }}
            >
              {opt.label}
            </button>
          ))}

          <div
            style={{
              width: "1px",
              height: "16px",
              background: "var(--border-default, #333)",
              margin: "0 2px",
            }}
          />

          {SPACING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSpacingChange(opt.value)}
              style={{
                padding: "3px 6px",
                borderRadius: "4px",
                border:
                  spacing === opt.value
                    ? "1px solid var(--accent, #34d399)"
                    : "1px solid transparent",
                background:
                  spacing === opt.value
                    ? "rgba(52, 211, 153, 0.1)"
                    : "transparent",
                color:
                  spacing === opt.value
                    ? "var(--accent, #34d399)"
                    : "var(--text-secondary, #888)",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </NodeViewWrapper>
  )
}

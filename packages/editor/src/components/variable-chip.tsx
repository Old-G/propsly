"use client"

import { getVariableLabel } from "../extensions/variable"

interface VariableChipProps {
  name: string
  resolved?: string
}

export function VariableChip({ name, resolved }: VariableChipProps) {
  const label = resolved ?? getVariableLabel(name)
  const isEmpty = resolved === ""

  return (
    <span
      className={`variable-chip-inline ${isEmpty ? "variable-chip-empty" : ""}`}
      style={{
        display: "inline",
        backgroundColor: isEmpty
          ? "var(--bg-surface)"
          : "var(--accent-muted, rgba(52, 211, 153, 0.1))",
        color: isEmpty
          ? "var(--text-tertiary)"
          : "var(--accent, #34d399)",
        borderRadius: "4px",
        padding: "1px 6px",
        fontSize: "0.875em",
        fontWeight: 500,
        lineHeight: "inherit",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
      contentEditable={false}
      data-variable={name}
    >
      {label}
    </span>
  )
}

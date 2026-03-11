"use client"

import { useState, useCallback, useRef } from "react"
import { AVAILABLE_VARIABLES, type VariableInfo } from "../extensions/variable"
import type { Editor } from "@tiptap/core"

interface VariablePickerProps {
  editor: Editor
  onClose: () => void
  clientRect: (() => DOMRect | null) | null
}

export function VariablePicker({
  editor,
  onClose,
  clientRect,
}: VariablePickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const insertVariable = useCallback(
    (variable: VariableInfo) => {
      editor.chain().focus().insertVariable(variable.name).run()
      onClose()
    },
    [editor, onClose]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(
          (prev) => (prev + 1) % AVAILABLE_VARIABLES.length
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(
          (prev) =>
            (prev - 1 + AVAILABLE_VARIABLES.length) %
            AVAILABLE_VARIABLES.length
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        const variable = AVAILABLE_VARIABLES[selectedIndex]
        if (variable) {
          insertVariable(variable)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    },
    [selectedIndex, insertVariable, onClose]
  )

  const rect = clientRect?.()
  const style = rect
    ? {
        position: "fixed" as const,
        top: rect.bottom + 8,
        left: rect.left,
      }
    : {}

  return (
    <div
      ref={menuRef}
      style={style}
      className="z-50 w-72 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-lg"
      onKeyDown={handleKeyDown}
    >
      <div className="border-b border-[var(--border-default)] px-3 py-2">
        <p className="text-xs font-medium text-[var(--text-tertiary)]">
          Insert Variable
        </p>
      </div>
      <div className="p-1">
        {AVAILABLE_VARIABLES.map((variable, index) => (
          <button
            key={variable.name}
            onClick={() => insertVariable(variable)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
              index === selectedIndex
                ? "bg-[var(--bg-surface-hover)]"
                : "hover:bg-[var(--bg-surface-hover)]"
            }`}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium"
              style={{
                backgroundColor:
                  "var(--accent-muted, rgba(52, 211, 153, 0.1))",
                color: "var(--accent, #34d399)",
              }}
            >
              {"{ }"}
            </span>
            <div>
              <p className="text-sm font-medium">{variable.label}</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {variable.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

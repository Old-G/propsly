"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SlashCommandMenuProps {
  items: Array<{
    title: string
    description: string
    icon: string
    command: (props: any) => void
  }>
  command: (item: any) => void
  clientRect: (() => DOMRect | null) | null
}

export function SlashCommandMenu({
  items,
  command,
  clientRect,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    },
    [items, command]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % items.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        selectItem(selectedIndex)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [items, selectedIndex, selectItem])

  if (!items.length) return null

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
    >
      <div className="p-1">
        {items.map((item, index) => (
          <button
            key={item.title}
            onClick={() => selectItem(index)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
              index === selectedIndex
                ? "bg-[var(--bg-surface-hover)]"
                : "hover:bg-[var(--bg-surface-hover)]"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--bg-surface)] text-xs font-medium">
              {item.icon}
            </span>
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

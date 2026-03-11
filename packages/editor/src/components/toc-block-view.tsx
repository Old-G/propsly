"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { useSyncExternalStore, useCallback, useRef } from "react"

interface TocHeading {
  level: number
  text: string
  pos: number
}

function extractHeadings(editor: NodeViewProps["editor"]): TocHeading[] {
  const headings: TocHeading[] = []

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      headings.push({
        level: node.attrs.level as number,
        text: node.textContent,
        pos,
      })
    }
  })

  return headings
}

const INDENT: Record<number, string> = {
  1: "pl-0",
  2: "pl-4",
  3: "pl-8",
}

export function TocBlockView({ editor }: NodeViewProps) {
  // Use useSyncExternalStore to subscribe to editor transactions
  // without useEffect + setState (React 19 lint rule)
  const headingsRef = useRef<TocHeading[]>([])
  const versionRef = useRef(0)

  const subscribe = useCallback(
    (callback: () => void) => {
      const handler = () => {
        const next = extractHeadings(editor)
        const prev = headingsRef.current

        // Only notify if headings actually changed
        const changed =
          next.length !== prev.length ||
          next.some(
            (h, i) =>
              h.text !== prev[i]?.text ||
              h.level !== prev[i]?.level ||
              h.pos !== prev[i]?.pos
          )

        if (changed) {
          headingsRef.current = next
          versionRef.current += 1
          callback()
        }
      }

      // Get initial headings
      headingsRef.current = extractHeadings(editor)

      editor.on("update", handler)
      return () => {
        editor.off("update", handler)
      }
    },
    [editor]
  )

  const getSnapshot = useCallback(() => versionRef.current, [])

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const headings = headingsRef.current

  return (
    <NodeViewWrapper
      data-type="table-of-contents"
      className="my-4"
    >
      <div
        className="rounded-xl border p-5"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
      >
        <h4
          className="mb-3 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Table of Contents
        </h4>

        {headings.length === 0 ? (
          <p
            className="text-sm italic"
            style={{ color: "var(--text-secondary)" }}
          >
            Add headings to your document to generate a table of contents.
          </p>
        ) : (
          <nav>
            <ul className="flex flex-col gap-1">
              {headings.map((heading) => (
                <li key={heading.pos} className={INDENT[heading.level] ?? "pl-0"}>
                  <button
                    type="button"
                    onClick={() => {
                      // Scroll the editor to the heading position
                      editor.chain().focus().setTextSelection(heading.pos + 1).run()
                    }}
                    className="w-full rounded px-2 py-1 text-left text-sm transition-colors"
                    style={{
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--bg-surface-hover)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    {heading.text || "Untitled"}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </NodeViewWrapper>
  )
}

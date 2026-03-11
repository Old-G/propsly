"use client"

import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react"
import { useCallback, useRef } from "react"

function AuthorAvatar({
  avatarUrl,
  authorName,
}: {
  avatarUrl: string
  authorName: string
}) {
  const initials = authorName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={authorName}
        className="h-10 w-10 rounded-full object-cover"
      />
    )
  }

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
      style={{
        backgroundColor: "var(--accent-muted)",
        color: "var(--accent)",
      }}
    >
      {initials}
    </div>
  )
}

function EditableField({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  const handleBlur = useCallback(() => {
    if (ref.current) {
      const text = ref.current.textContent ?? ""
      if (text !== value) {
        onChange(text)
      }
    }
  }, [onChange, value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        ref.current?.blur()
      }
    },
    []
  )

  return (
    <span
      ref={ref}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      data-placeholder={placeholder}
      style={{ outline: "none", minWidth: "1ch" }}
    >
      {value}
    </span>
  )
}

export function TestimonialBlockView({ node, updateAttributes }: NodeViewProps) {
  const { authorName, authorTitle, company, avatarUrl } = node.attrs as {
    authorName: string
    authorTitle: string
    company: string
    avatarUrl: string
  }

  const handleAuthorNameChange = useCallback(
    (value: string) => updateAttributes({ authorName: value }),
    [updateAttributes]
  )

  const handleAuthorTitleChange = useCallback(
    (value: string) => updateAttributes({ authorTitle: value }),
    [updateAttributes]
  )

  const handleCompanyChange = useCallback(
    (value: string) => updateAttributes({ company: value }),
    [updateAttributes]
  )

  return (
    <NodeViewWrapper
      data-type="testimonial-block"
      className="my-4"
      draggable
      data-drag-handle=""
    >
      <div
        className="relative overflow-hidden rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderLeft: "3px solid var(--accent)",
        }}
      >
        {/* Decorative quote mark */}
        <span
          className="pointer-events-none absolute top-3 left-4 select-none text-6xl font-serif leading-none opacity-15"
          style={{ color: "var(--accent)" }}
          aria-hidden="true"
        >
          {"\u201C"}
        </span>

        {/* Editable quote text */}
        <div className="relative z-[1]">
          <NodeViewContent
            as="blockquote"
            className="text-lg italic leading-relaxed"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Author info */}
        <div className="relative z-[1] mt-4 flex items-center gap-3">
          <AuthorAvatar avatarUrl={avatarUrl} authorName={authorName} />
          <div className="flex flex-col text-sm leading-snug">
            <EditableField
              value={authorName}
              onChange={handleAuthorNameChange}
              className="font-semibold"
              placeholder="Author name"
            />
            <span style={{ color: "var(--text-secondary)" }}>
              <EditableField
                value={authorTitle}
                onChange={handleAuthorTitleChange}
                placeholder="Title"
              />
              {" at "}
              <EditableField
                value={company}
                onChange={handleCompanyChange}
                placeholder="Company"
              />
            </span>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

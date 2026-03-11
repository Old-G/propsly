"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { type JSONContent } from "@tiptap/core"
import { useCallback, useEffect, useRef, useState } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { SlashCommand, slashCommandSuggestion } from "../extensions/slash-command"
import { SlashCommandMenu } from "./slash-command-menu"

export interface ProposalEditorProps {
  content?: JSONContent
  onUpdate?: (content: JSONContent) => void
  editable?: boolean
}

export function ProposalEditor({
  content,
  onUpdate,
  editable = true,
}: ProposalEditorProps) {
  const [slashCommandState, setSlashCommandState] = useState<{
    items: any[]
    command: (item: any) => void
    clientRect: (() => DOMRect | null) | null
  } | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[var(--accent)] underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing or press "/" for commands...',
      }),
      SlashCommand.configure({
        suggestion: {
          ...slashCommandSuggestion(),
          render: () => {
            return {
              onStart: (props: any) => {
                setSlashCommandState({
                  items: props.items,
                  command: props.command,
                  clientRect: props.clientRect,
                })
              },
              onUpdate: (props: any) => {
                setSlashCommandState({
                  items: props.items,
                  command: props.command,
                  clientRect: props.clientRect,
                })
              },
              onExit: () => {
                setSlashCommandState(null)
              },
              onKeyDown: (props: any) => {
                if (props.event.key === "Escape") {
                  setSlashCommandState(null)
                  return true
                }
                return false
              },
            }
          },
        },
      }),
    ],
    content: content ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    editable,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[500px] focus:outline-none px-12 py-8",
      },
    },
  })

  return (
    <div className="relative">
      {editable && editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
      {slashCommandState && (
        <SlashCommandMenu
          items={slashCommandState.items}
          command={slashCommandState.command}
          clientRect={slashCommandState.clientRect}
        />
      )}
    </div>
  )
}

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
import { VariablePicker } from "./variable-picker"
import { VideoBlockWithView } from "../extensions/video-block-with-view"
import { DividerBlockWithView } from "../extensions/divider-block-with-view"
import { TestimonialBlock } from "../extensions/testimonial-block"
import { TableOfContents } from "../extensions/toc-block"
import { ImageBlockWithView } from "../extensions/image-block"
import { ImageBlockView } from "./image-block-view"
import { PricingTableWithView } from "../extensions/pricing-table-with-view"
import { Variable } from "../extensions/variable"
import { SignatureBlockWithView } from "../extensions/signature-block-with-view"

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
    items: Array<{ title: string; description: string; icon: string; command: (props: { editor: unknown; range: unknown }) => void }>
    command: (item: { title: string; description: string; icon: string; command: (props: { editor: unknown; range: unknown }) => void }) => void
    clientRect: (() => DOMRect | null) | null
  } | null>(null)
  const [showVariablePicker, setShowVariablePicker] = useState(false)
  const variablePickerRectRef = useRef<(() => DOMRect | null) | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        horizontalRule: false,
      }),
      VideoBlockWithView,
      DividerBlockWithView,
      TestimonialBlock,
      TableOfContents,
      ImageBlockWithView(ImageBlockView),
      PricingTableWithView,
      Variable,
      SignatureBlockWithView,
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

  // Listen for the custom event to open the variable picker
  useEffect(() => {
    const handleOpenVariablePicker = () => {
      if (!editor) return
      // Get cursor position for menu placement
      const { view } = editor
      const { from } = view.state.selection
      const coords = view.coordsAtPos(from)
      variablePickerRectRef.current = () => ({
        top: coords.top,
        bottom: coords.bottom,
        left: coords.left,
        right: coords.left,
        width: 0,
        height: coords.bottom - coords.top,
        x: coords.left,
        y: coords.top,
        toJSON: () => ({}),
      })
      setShowVariablePicker(true)
    }

    document.addEventListener(
      "propsly:open-variable-picker",
      handleOpenVariablePicker
    )
    return () => {
      document.removeEventListener(
        "propsly:open-variable-picker",
        handleOpenVariablePicker
      )
    }
  }, [editor])

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
      {showVariablePicker && editor && (
        <VariablePicker
          editor={editor}
          onClose={() => setShowVariablePicker(false)}
          clientRect={variablePickerRectRef.current}
        />
      )}
    </div>
  )
}

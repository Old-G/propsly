"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { type JSONContent } from "@tiptap/core"
import { VideoBlockWithView } from "../extensions/video-block-with-view"
import { DividerBlockWithView } from "../extensions/divider-block-with-view"
import { TestimonialBlock } from "../extensions/testimonial-block"
import { TableOfContents } from "../extensions/toc-block"
import { ImageBlockWithView } from "../extensions/image-block"
import { ImageBlockView } from "./image-block-view"

export interface ProposalViewerProps {
  content: JSONContent
}

export function ProposalViewer({ content }: ProposalViewerProps) {
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
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-[var(--accent)] underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none",
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="proposal-viewer">
      <EditorContent editor={editor} />
    </div>
  )
}

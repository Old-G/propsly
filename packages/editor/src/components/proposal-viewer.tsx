"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { type JSONContent } from "@tiptap/core"
import { useMemo } from "react"
import { VideoBlockWithView } from "../extensions/video-block-with-view"
import { DividerBlockWithView } from "../extensions/divider-block-with-view"
import { TestimonialBlock } from "../extensions/testimonial-block"
import { TableOfContents } from "../extensions/toc-block"
import { ImageBlockWithView } from "../extensions/image-block"
import { ImageBlockView } from "./image-block-view"
import { Variable, getVariableLabel } from "../extensions/variable"
import { SignatureBlock } from "../extensions/signature-block"

export interface ProposalViewerProps {
  content: JSONContent
  variables?: Record<string, string>
}

/**
 * Recursively walk through TipTap JSON content and resolve variable marks.
 * Replaces `{{variable_name}}` text with actual values from the variables map.
 */
function resolveVariablesInContent(
  content: JSONContent,
  variables: Record<string, string>
): JSONContent {
  if (!content) return content

  const resolved = { ...content }

  // If this node has marks with a variable type, resolve the text
  if (resolved.marks) {
    const variableMark = resolved.marks.find(
      (mark) => mark.type === "variable"
    )
    if (variableMark && typeof variableMark.attrs?.name === "string") {
      const varName = variableMark.attrs.name
      const value = variables[varName]
      if (value !== undefined && value !== "") {
        // Replace with the resolved value, keeping the mark for styling
        resolved.text = value
      } else if (value === "") {
        // Empty value — show the label as placeholder
        resolved.text = getVariableLabel(varName)
      }
      // If value is undefined, keep original {{name}} text
    }
  }

  // Recurse into children
  if (resolved.content) {
    resolved.content = resolved.content.map((child) =>
      resolveVariablesInContent(child, variables)
    )
  }

  return resolved
}

export function ProposalViewer({ content, variables }: ProposalViewerProps) {
  const resolvedContent = useMemo(() => {
    if (!variables || Object.keys(variables).length === 0) return content
    return resolveVariablesInContent(content, variables)
  }, [content, variables])

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
      Variable,
      SignatureBlock,
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
    content: resolvedContent,
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
      <style>{`
        .variable-chip {
          display: inline;
          background-color: var(--accent-muted, rgba(52, 211, 153, 0.1));
          color: var(--accent, #34d399);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 0.875em;
          font-weight: 500;
          white-space: nowrap;
        }
        .variable-chip-resolved {
          background-color: transparent;
          color: inherit;
          padding: 0;
          font-weight: inherit;
        }
        .variable-chip-empty {
          background-color: var(--bg-surface, #1a1a1a);
          color: var(--text-tertiary, #666);
          font-style: italic;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  )
}

import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { TocBlockView } from "../components/toc-block-view"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tableOfContents: {
      insertTableOfContents: () => ReturnType
    }
  }
}

export const TableOfContents = Node.create({
  name: "tableOfContents",

  group: "block",

  atom: true,

  selectable: true,

  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="table-of-contents"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "table-of-contents" }),
      "Table of Contents",
    ]
  },

  addCommands() {
    return {
      insertTableOfContents:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(TocBlockView)
  },
})

import { Node, mergeAttributes } from "@tiptap/core"

export type DividerStyle = "solid" | "dashed" | "dotted" | "gradient"
export type DividerSpacing = "sm" | "md" | "lg"

export interface DividerBlockAttributes {
  style: DividerStyle
  spacing: DividerSpacing
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dividerBlock: {
      setDividerBlock: (attrs?: Partial<DividerBlockAttributes>) => ReturnType
    }
  }
}

export const DividerBlock = Node.create({
  name: "dividerBlock",

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      style: {
        default: "solid" as DividerStyle,
        parseHTML: (element) =>
          (element.getAttribute("data-style") as DividerStyle) ?? "solid",
        renderHTML: (attributes) => ({
          "data-style": attributes.style as string,
        }),
      },
      spacing: {
        default: "md" as DividerSpacing,
        parseHTML: (element) =>
          (element.getAttribute("data-spacing") as DividerSpacing) ?? "md",
        renderHTML: (attributes) => ({
          "data-spacing": attributes.spacing as string,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="dividerBlock"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "dividerBlock" }),
      ["hr"],
    ]
  },

  addCommands() {
    return {
      setDividerBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attrs ?? {},
          })
        },
    }
  },
})

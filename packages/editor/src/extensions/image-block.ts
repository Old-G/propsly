import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

export type ImageBlockAlignment = "left" | "center" | "full-width"

export interface ImageBlockAttributes {
  src: string | null
  alt: string
  title: string
  width: number
  alignment: ImageBlockAlignment
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (attrs?: Partial<ImageBlockAttributes>) => ReturnType
      updateImageBlock: (attrs: Partial<ImageBlockAttributes>) => ReturnType
    }
  }
}

export const ImageBlock = Node.create({
  name: "imageBlock",
  group: "block",
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("src") ?? null,
      },
      alt: {
        default: "",
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("alt") ?? "",
      },
      title: {
        default: "",
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("title") ?? "",
      },
      width: {
        default: 100,
        parseHTML: (element) => {
          const widthAttr = element.getAttribute("data-width")
          return widthAttr ? parseInt(widthAttr, 10) : 100
        },
        renderHTML: (attributes) => ({
          "data-width": attributes.width as number,
        }),
      },
      alignment: {
        default: "center" as ImageBlockAlignment,
        parseHTML: (element) =>
          (element.getAttribute("data-alignment") as ImageBlockAlignment) ??
          "center",
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment as string,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, ...rest } = HTMLAttributes as Record<
      string,
      string
    >
    return [
      "figure",
      mergeAttributes(rest, { "data-type": "image-block" }),
      ["img", { src, alt, title }],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      // Lazy-loaded in the component registration — the React component
      // is imported dynamically by the consumer (apps/web) and passed
      // via the `component` option on the extension or set up separately.
      // We use a placeholder here; the real component is set in addNodeView.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      (() => {
        // This will be replaced at runtime via the static `component` field
        // set by the configure method. We dynamically import to avoid
        // bundling React in the extension file directly.
        throw new Error(
          "ImageBlock: React component not configured. Use ImageBlock.configure({ component }) or register ImageBlockView separately."
        )
      }) as never,
      {
        className: "image-block-wrapper",
      }
    )
  },

  addCommands() {
    return {
      setImageBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attrs ?? {},
          })
        },
      updateImageBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs)
        },
    }
  },
})

/**
 * Creates an ImageBlock extension configured with the given React component.
 * Usage: `ImageBlockWithView(ImageBlockView)` in your editor setup.
 */
export function ImageBlockWithView(
  component: Parameters<typeof ReactNodeViewRenderer>[0]
) {
  return ImageBlock.extend({
    addNodeView() {
      return ReactNodeViewRenderer(component, {
        className: "image-block-wrapper",
      })
    },
  })
}

import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { TestimonialBlockView } from "../components/testimonial-block-view"

export interface TestimonialBlockAttributes {
  authorName: string
  authorTitle: string
  company: string
  avatarUrl: string
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    testimonialBlock: {
      insertTestimonialBlock: (attrs?: Partial<TestimonialBlockAttributes>) => ReturnType
    }
  }
}

export const TestimonialBlock = Node.create({
  name: "testimonialBlock",

  group: "block",

  draggable: true,

  content: "inline*",

  addAttributes() {
    return {
      authorName: {
        default: "Author Name",
        parseHTML: (element) => element.getAttribute("data-author-name"),
        renderHTML: (attributes) => ({
          "data-author-name": attributes.authorName as string,
        }),
      },
      authorTitle: {
        default: "Title",
        parseHTML: (element) => element.getAttribute("data-author-title"),
        renderHTML: (attributes) => ({
          "data-author-title": attributes.authorTitle as string,
        }),
      },
      company: {
        default: "Company",
        parseHTML: (element) => element.getAttribute("data-company"),
        renderHTML: (attributes) => ({
          "data-company": attributes.company as string,
        }),
      },
      avatarUrl: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-avatar-url"),
        renderHTML: (attributes) => ({
          "data-avatar-url": attributes.avatarUrl as string,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="testimonial-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "testimonial-block" }),
      0,
    ]
  },

  addCommands() {
    return {
      insertTestimonialBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              authorName: attrs?.authorName ?? "Author Name",
              authorTitle: attrs?.authorTitle ?? "Title",
              company: attrs?.company ?? "Company",
              avatarUrl: attrs?.avatarUrl ?? "",
            },
            content: [{ type: "text", text: "Enter testimonial quote here..." }],
          })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(TestimonialBlockView)
  },
})

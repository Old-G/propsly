import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion"

export interface SlashCommandItem {
  title: string
  description: string
  icon: string
  command: (props: { editor: any; range: any }) => void
}

export const slashCommandItems: SlashCommandItem[] = [
  {
    title: "Text",
    description: "Plain text block",
    icon: "T",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    },
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: "\u2022",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "Numbered List",
    description: "Ordered list",
    icon: "1.",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: "Quote",
    description: "Block quote",
    icon: "\u201C",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run()
    },
  },
  {
    title: "Video",
    description: "Embed YouTube, Vimeo, or Loom",
    icon: "\u25B6",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setVideoBlock().run()
    },
  },
  {
    title: "Divider",
    description: "Visual separator with styles",
    icon: "\u2014",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setDividerBlock().run()
    },
  },
  {
    title: "Code Block",
    description: "Code snippet",
    icon: "<>",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run()
    },
  },
  {
    title: "Image",
    description: "Upload or embed an image",
    icon: "\u{25A3}",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setImageBlock().run()
    },
  },
  {
    title: "Testimonial",
    description: "Quote with author attribution",
    icon: "\u2606",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTestimonialBlock().run()
    },
  },
  {
    title: "Table of Contents",
    description: "Auto-generated from headings",
    icon: "\u2261",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTableOfContents().run()
    },
  },
  {
    title: "Pricing Table",
    description: "Interactive pricing with totals",
    icon: "$",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertPricingTable().run()
    },
  },
  {
    title: "Variable",
    description: "Insert a dynamic content variable",
    icon: "{ }",
    command: ({ editor, range }) => {
      // Delete the slash command range, then signal to open the variable picker
      editor.chain().focus().deleteRange(range).run()
      // Dispatch a custom event so the editor component can open the variable picker
      const event = new CustomEvent("propsly:open-variable-picker")
      document.dispatchEvent(event)
    },
  },
  {
    title: "Signature",
    description: "Signature block for client signing",
    icon: "\u270D",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertSignatureBlock().run()
    },
  },
]

export const SlashCommandPluginKey = new PluginKey("slashCommand")

export type SlashCommandOptions = {
  suggestion: Omit<SuggestionOptions, "editor">
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        pluginKey: SlashCommandPluginKey,
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export function slashCommandSuggestion() {
  return {
    items: ({ query }: { query: string }) => {
      return slashCommandItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    },
    // render is handled by the React component in apps/web
  }
}

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
    title: "Divider",
    description: "Horizontal rule",
    icon: "\u2014",
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
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

import { Node, mergeAttributes } from "@tiptap/core"

export type VideoProvider = "youtube" | "vimeo" | "loom" | "unknown"

export interface VideoBlockAttributes {
  src: string | null
  provider: VideoProvider
  originalUrl: string | null
  width: number
}

function extractYouTubeId(url: string): string | null {
  const watchMatch = url.match(
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/
  )
  if (watchMatch) return watchMatch[1]

  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]

  const embedMatch = url.match(
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  if (embedMatch) return embedMatch[1]

  return null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

function extractLoomId(url: string): string | null {
  const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

export function parseVideoUrl(url: string): {
  provider: VideoProvider
  embedSrc: string
} | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  const youtubeId = extractYouTubeId(trimmed)
  if (youtubeId) {
    return {
      provider: "youtube",
      embedSrc: `https://www.youtube.com/embed/${youtubeId}`,
    }
  }

  const vimeoId = extractVimeoId(trimmed)
  if (vimeoId) {
    return {
      provider: "vimeo",
      embedSrc: `https://player.vimeo.com/video/${vimeoId}`,
    }
  }

  const loomId = extractLoomId(trimmed)
  if (loomId) {
    return {
      provider: "loom",
      embedSrc: `https://www.loom.com/embed/${loomId}`,
    }
  }

  return null
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoBlock: {
      setVideoBlock: (attrs?: Partial<VideoBlockAttributes>) => ReturnType
    }
  }
}

/**
 * VideoBlock node extension.
 *
 * Usage: supply the React node view component via `addNodeView` override when
 * configuring extensions in your editor setup, or use the pre-configured
 * `VideoBlockWithView` export from the components barrel.
 */
export const VideoBlock = Node.create({
  name: "videoBlock",

  group: "block",

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-src"),
        renderHTML: (attributes) => ({ "data-src": attributes.src as string }),
      },
      provider: {
        default: "unknown" as VideoProvider,
        parseHTML: (element) =>
          (element.getAttribute("data-provider") as VideoProvider) ?? "unknown",
        renderHTML: (attributes) => ({
          "data-provider": attributes.provider as string,
        }),
      },
      originalUrl: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-original-url"),
        renderHTML: (attributes) => ({
          "data-original-url": attributes.originalUrl as string,
        }),
      },
      width: {
        default: 100,
        parseHTML: (element) => {
          const w = element.getAttribute("data-width")
          return w ? Number(w) : 100
        },
        renderHTML: (attributes) => ({
          "data-width": String(attributes.width),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="videoBlock"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "videoBlock" }),
    ]
  },

  addCommands() {
    return {
      setVideoBlock:
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

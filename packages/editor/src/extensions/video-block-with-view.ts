import { ReactNodeViewRenderer } from "@tiptap/react"
import { VideoBlock } from "./video-block"
import { VideoBlockView } from "../components/video-block-view"

/**
 * VideoBlock extension pre-configured with its React NodeView.
 * Use this in your editor setup instead of the bare `VideoBlock`.
 */
export const VideoBlockWithView = VideoBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(VideoBlockView)
  },
})

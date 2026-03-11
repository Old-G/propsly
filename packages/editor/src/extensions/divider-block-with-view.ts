import { ReactNodeViewRenderer } from "@tiptap/react"
import { DividerBlock } from "./divider-block"
import { DividerBlockView } from "../components/divider-block-view"

/**
 * DividerBlock extension pre-configured with its React NodeView.
 * Use this in your editor setup instead of the bare `DividerBlock`.
 */
export const DividerBlockWithView = DividerBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(DividerBlockView)
  },
})

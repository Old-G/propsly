import { ReactNodeViewRenderer } from "@tiptap/react"
import { SignatureBlock } from "./signature-block"
import { SignatureBlockEditorView } from "../components/signature-block-editor-view"

/**
 * SignatureBlock extension pre-configured with its React NodeView for the editor.
 * Use this in your editor setup instead of the bare `SignatureBlock`.
 */
export const SignatureBlockWithView = SignatureBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(SignatureBlockEditorView)
  },
})

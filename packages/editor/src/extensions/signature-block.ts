import { Node, mergeAttributes } from "@tiptap/core"

export type SignatureType = "typed" | "drawn" | "none"

export interface SignatureBlockAttributes {
  signedBy: string
  signedAt: string
  signatureData: string
  signatureType: SignatureType
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    signatureBlock: {
      insertSignatureBlock: (
        attrs?: Partial<SignatureBlockAttributes>
      ) => ReturnType
    }
  }
}

export const SignatureBlock = Node.create({
  name: "signatureBlock",

  group: "block",

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      signedBy: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-signed-by") ?? "",
        renderHTML: (attributes) => ({
          "data-signed-by": attributes.signedBy as string,
        }),
      },
      signedAt: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-signed-at") ?? "",
        renderHTML: (attributes) => ({
          "data-signed-at": attributes.signedAt as string,
        }),
      },
      signatureData: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-signature-data") ?? "",
        renderHTML: (attributes) => ({
          "data-signature-data": attributes.signatureData as string,
        }),
      },
      signatureType: {
        default: "none" as SignatureType,
        parseHTML: (element) =>
          (element.getAttribute("data-signature-type") as SignatureType) ??
          "none",
        renderHTML: (attributes) => ({
          "data-signature-type": attributes.signatureType as string,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="signatureBlock"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "signatureBlock" }),
    ]
  },

  addCommands() {
    return {
      insertSignatureBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              signedBy: attrs?.signedBy ?? "",
              signedAt: attrs?.signedAt ?? "",
              signatureData: attrs?.signatureData ?? "",
              signatureType: attrs?.signatureType ?? "none",
            },
          })
        },
    }
  },
})

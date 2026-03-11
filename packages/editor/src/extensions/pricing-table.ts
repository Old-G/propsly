import { Node, mergeAttributes } from "@tiptap/core"

export interface PricingTableRow {
  id: string
  description: string
  quantity: number
  unitPrice: number
  optional: boolean
  checked: boolean
}

export type DiscountType = "percentage" | "fixed" | "none"

export interface PricingTableAttributes {
  rows: PricingTableRow[]
  discountType: DiscountType
  discountValue: number
  taxRate: number
  currency: string
  showQuantity: boolean
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pricingTable: {
      insertPricingTable: (
        attrs?: Partial<PricingTableAttributes>
      ) => ReturnType
      updatePricingTable: (
        attrs: Partial<PricingTableAttributes>
      ) => ReturnType
    }
  }
}

function parseJsonAttr<T>(element: Element, attr: string, fallback: T): T {
  const raw = element.getAttribute(attr)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const defaultRows: PricingTableRow[] = [
  {
    id: "initial",
    description: "Item 1",
    quantity: 1,
    unitPrice: 0,
    optional: false,
    checked: true,
  },
]

export const PricingTable = Node.create({
  name: "pricingTable",

  group: "block",

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      rows: {
        default: defaultRows,
        parseHTML: (element) =>
          parseJsonAttr<PricingTableRow[]>(element, "data-rows", defaultRows),
        renderHTML: (attributes) => ({
          "data-rows": JSON.stringify(attributes.rows),
        }),
      },
      discountType: {
        default: "none" as DiscountType,
        parseHTML: (element) =>
          (element.getAttribute("data-discount-type") as DiscountType) ??
          "none",
        renderHTML: (attributes) => ({
          "data-discount-type": attributes.discountType as string,
        }),
      },
      discountValue: {
        default: 0,
        parseHTML: (element) => {
          const v = element.getAttribute("data-discount-value")
          return v ? Number(v) : 0
        },
        renderHTML: (attributes) => ({
          "data-discount-value": String(attributes.discountValue),
        }),
      },
      taxRate: {
        default: 0,
        parseHTML: (element) => {
          const v = element.getAttribute("data-tax-rate")
          return v ? Number(v) : 0
        },
        renderHTML: (attributes) => ({
          "data-tax-rate": String(attributes.taxRate),
        }),
      },
      currency: {
        default: "USD",
        parseHTML: (element) =>
          element.getAttribute("data-currency") ?? "USD",
        renderHTML: (attributes) => ({
          "data-currency": attributes.currency as string,
        }),
      },
      showQuantity: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute("data-show-quantity") !== "false",
        renderHTML: (attributes) => ({
          "data-show-quantity": String(attributes.showQuantity),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pricingTable"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "pricingTable" }),
    ]
  },

  addCommands() {
    return {
      insertPricingTable:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              rows: attrs?.rows ?? [
                {
                  id: crypto.randomUUID(),
                  description: "Item 1",
                  quantity: 1,
                  unitPrice: 0,
                  optional: false,
                  checked: true,
                },
              ],
              discountType: attrs?.discountType ?? "none",
              discountValue: attrs?.discountValue ?? 0,
              taxRate: attrs?.taxRate ?? 0,
              currency: attrs?.currency ?? "USD",
              showQuantity: attrs?.showQuantity ?? true,
            },
          })
        },
      updatePricingTable:
        (attrs) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = tr.doc.nodeAt(selection.from)
          if (!node || node.type.name !== "pricingTable") return false
          if (dispatch) {
            const pos = selection.from
            const newAttrs = { ...node.attrs, ...attrs }
            tr.setNodeMarkup(pos, undefined, newAttrs)
          }
          return true
        },
    }
  },
})

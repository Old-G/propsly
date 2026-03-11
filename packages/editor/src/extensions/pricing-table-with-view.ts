import { ReactNodeViewRenderer } from "@tiptap/react"
import { PricingTable } from "./pricing-table"
import { PricingTableView } from "../components/pricing-table-view"

/**
 * PricingTable extension pre-configured with its React NodeView.
 * Use this in your editor setup instead of the bare `PricingTable`.
 */
export const PricingTableWithView = PricingTable.extend({
  addNodeView() {
    return ReactNodeViewRenderer(PricingTableView)
  },
})

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core"
import { proposals } from "./proposals"
import { proposalViews } from "./proposal-views"

export const sectionViews = pgTable(
  "section_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proposalId: uuid("proposal_id").notNull().references(() => proposals.id, { onDelete: "cascade" }),
    viewId: uuid("view_id").notNull().references(() => proposalViews.id, { onDelete: "cascade" }),
    blockId: text("block_id"),
    blockType: text("block_type"),
    timeSpentMs: integer("time_spent_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("section_views_proposal_id_idx").on(t.proposalId)]
)

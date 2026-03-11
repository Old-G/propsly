import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core"
import { proposals } from "./proposals"

export const proposalViews = pgTable(
  "proposal_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    proposalId: uuid("proposal_id").notNull().references(() => proposals.id, { onDelete: "cascade" }),
    viewerIp: text("viewer_ip"),
    viewerLocation: text("viewer_location"),
    viewerDevice: text("viewer_device"),
    viewerUa: text("viewer_ua"),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("proposal_views_proposal_id_idx").on(t.proposalId)]
)

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core"
import { proposals } from "./proposals"

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    type: text("type").notNull(),
    proposalId: uuid("proposal_id").references(() => proposals.id, { onDelete: "cascade" }),
    message: text("message"),
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("notifications_user_id_idx").on(t.userId),
    index("notifications_read_idx").on(t.userId, t.read),
  ]
)

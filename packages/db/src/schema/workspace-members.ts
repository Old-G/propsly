import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core"
import { workspaces } from "./workspaces"

export const memberRoleEnum = ["owner", "admin", "member", "viewer"] as const
export type MemberRole = (typeof memberRoleEnum)[number]

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    role: text("role", { enum: memberRoleEnum }).notNull().default("member"),
    invitedAt: timestamp("invited_at", { withTimezone: true }).defaultNow(),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
  },
  (t) => [unique().on(t.workspaceId, t.userId)]
)

import { pgTable, uuid, text, jsonb, timestamp, boolean } from "drizzle-orm/pg-core"
import { workspaces } from "./workspaces"

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  content: jsonb("content").$type<Record<string, unknown>>(),
  previewImageUrl: text("preview_image_url"),
  isSystem: boolean("is_system").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

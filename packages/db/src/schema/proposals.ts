import { pgTable, uuid, text, jsonb, timestamp, numeric, index } from "drizzle-orm/pg-core"
import { workspaces } from "./workspaces"
import { contacts } from "./contacts"

export const proposalStatusEnum = ["draft", "sent", "viewed", "signed", "expired", "declined"] as const
export type ProposalStatus = (typeof proposalStatusEnum)[number]

export const proposals = pgTable(
  "proposals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: jsonb("content").$type<Record<string, unknown>>(),
    clientName: text("client_name"),
    clientEmail: text("client_email"),
    clientCompany: text("client_company"),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
    status: text("status", { enum: proposalStatusEnum }).notNull().default("draft"),
    currency: text("currency").default("USD"),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }),
    passwordHash: text("password_hash"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    viewedAt: timestamp("viewed_at", { withTimezone: true }),
    signedAt: timestamp("signed_at", { withTimezone: true }),
    signedPdfUrl: text("signed_pdf_url"),
    signatureData: jsonb("signature_data").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("proposals_workspace_id_idx").on(t.workspaceId),
    index("proposals_slug_idx").on(t.slug),
    index("proposals_status_idx").on(t.status),
    index("proposals_created_by_idx").on(t.createdBy),
  ]
)

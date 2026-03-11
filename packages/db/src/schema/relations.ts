import { relations } from "drizzle-orm"
import { workspaces } from "./workspaces"
import { workspaceMembers } from "./workspace-members"
import { proposals } from "./proposals"
import { proposalViews } from "./proposal-views"
import { sectionViews } from "./section-views"
import { templates } from "./templates"
import { contacts } from "./contacts"
import { notifications } from "./notifications"

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  proposals: many(proposals),
  templates: many(templates),
  contacts: many(contacts),
}))

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
}))

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [proposals.workspaceId],
    references: [workspaces.id],
  }),
  contact: one(contacts, {
    fields: [proposals.contactId],
    references: [contacts.id],
  }),
  views: many(proposalViews),
  sectionViews: many(sectionViews),
  notifications: many(notifications),
}))

export const proposalViewsRelations = relations(proposalViews, ({ one, many }) => ({
  proposal: one(proposals, {
    fields: [proposalViews.proposalId],
    references: [proposals.id],
  }),
  sectionViews: many(sectionViews),
}))

export const sectionViewsRelations = relations(sectionViews, ({ one }) => ({
  proposal: one(proposals, {
    fields: [sectionViews.proposalId],
    references: [proposals.id],
  }),
  view: one(proposalViews, {
    fields: [sectionViews.viewId],
    references: [proposalViews.id],
  }),
}))

export const templatesRelations = relations(templates, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [templates.workspaceId],
    references: [workspaces.id],
  }),
}))

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [contacts.workspaceId],
    references: [workspaces.id],
  }),
  proposals: many(proposals),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  proposal: one(proposals, {
    fields: [notifications.proposalId],
    references: [proposals.id],
  }),
}))

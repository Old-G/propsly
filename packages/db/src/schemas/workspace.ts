import { z } from "zod"

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  logoUrl: z.string().url().optional(),
  brandPrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  brandSecondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  companyAddress: z.string().max(500).optional(),
  companyPhone: z.string().max(50).optional(),
  companyWebsite: z.string().url().optional(),
  industry: z.string().max(100).optional(),
})

export const updateWorkspaceSchema = createWorkspaceSchema.partial()

export type CreateWorkspace = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspace = z.infer<typeof updateWorkspaceSchema>

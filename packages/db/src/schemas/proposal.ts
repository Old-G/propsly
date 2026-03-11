import { z } from "zod"

export const proposalStatusEnum = z.enum(["draft", "sent", "viewed", "signed", "expired", "declined"])

export const createProposalSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  content: z.record(z.unknown()).optional(),
  clientName: z.string().max(200).optional(),
  clientEmail: z.string().email().optional(),
  clientCompany: z.string().max(200).optional(),
  contactId: z.string().uuid().optional(),
  currency: z.string().length(3).default("USD"),
  totalAmount: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
})

export const updateProposalSchema = createProposalSchema.partial().extend({
  status: proposalStatusEnum.optional(),
})

export type CreateProposal = z.infer<typeof createProposalSchema>
export type UpdateProposal = z.infer<typeof updateProposalSchema>

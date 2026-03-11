import { z } from "zod"

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  content: z.record(z.unknown()).optional(),
  previewImageUrl: z.string().url().optional(),
})

export const updateTemplateSchema = createTemplateSchema.partial()

export type CreateTemplate = z.infer<typeof createTemplateSchema>
export type UpdateTemplate = z.infer<typeof updateTemplateSchema>

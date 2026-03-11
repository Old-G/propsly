import { z } from "zod"

export const createContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  company: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
})

export const updateContactSchema = createContactSchema.partial()

export type CreateContact = z.infer<typeof createContactSchema>
export type UpdateContact = z.infer<typeof updateContactSchema>

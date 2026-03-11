import { z } from "zod"

export const trackViewSchema = z.object({
  proposalId: z.string().uuid(),
  viewerIp: z.string().optional(),
  viewerLocation: z.string().optional(),
  viewerDevice: z.string().optional(),
  viewerUa: z.string().optional(),
})

export const trackSectionViewSchema = z.object({
  proposalId: z.string().uuid(),
  viewId: z.string().uuid(),
  blockId: z.string(),
  blockType: z.string(),
  timeSpentMs: z.number().int().positive(),
})

export type TrackView = z.infer<typeof trackViewSchema>
export type TrackSectionView = z.infer<typeof trackSectionViewSchema>

export const PLAN_LIMITS = {
  free: {
    proposals: 3,
    label: "Free",
  },
  pro: {
    proposals: Infinity,
    label: "Pro",
  },
  team: {
    proposals: Infinity,
    label: "Team",
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS

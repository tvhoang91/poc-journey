import z from 'zod'

export const actionSchema = z.object({
  type: z.enum(['navigate', 'click', 'type', 'wait', 'scroll', 'screenshot']),
  target: z.string().optional(),
  value: z.string().optional(),
  selector: z.string().optional(),
  actionReasoning: z.string(),
})

export const actionPlanSchema = z.object({
  steps: z.array(actionSchema),
  planReasoning: z.string(),
  fallbackStrategies: z.array(z.string()),
  expectedOutcome: z.string(),
  riskAssessment: z.string(),
  confidence: z.number(),
})

export type ActionPlan = z.infer<typeof actionPlanSchema>
export type Action = z.infer<typeof actionSchema>

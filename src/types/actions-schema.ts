import z from 'zod'

export const actionSchema = z.object({
  type: z.enum(['navigate', 'click', 'type', 'wait', 'scroll', 'screenshot', 'hover', 'select']),
  target: z.string().optional(),
  value: z.string().optional(),
  selector: z.string().optional(),
  actionReasoning: z.string().min(10).max(500),
  timeout: z.number().positive().max(30000).default(5000),
  waitCondition: z.string().optional(),
  waitAfter: z.number().min(0).max(10000).default(0),
})

export const actionPlanSchema = z.object({
  steps: z.array(actionSchema).min(1).max(50),
  planReasoning: z.string().min(20).max(1000),
})

export type ActionPlan = z.infer<typeof actionPlanSchema>
export type Action = z.infer<typeof actionSchema>

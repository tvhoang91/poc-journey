import z from 'zod'

export const locatorSchema = z.object({
  getBy: z.enum(['role', 'label', 'text']),
  selector: z.string(),
  name: z.string().optional(),
})

export const actionSchema = z.object({
  action: z.enum(['navigate', 'click', 'fill', 'check']),
  targetLocator: locatorSchema.optional(),
  value: z.string().optional(),
  waitForLocator: locatorSchema.optional(),
  actionReasoning: z.string().min(10).max(500),
})

export const actionPlanSchema = z.object({
  steps: z.array(actionSchema).min(1).max(50),
  planReasoning: z.string().min(20).max(1000),
})

export type ActionPlan = z.infer<typeof actionPlanSchema>
export type Action = z.infer<typeof actionSchema>
export type Locator = z.infer<typeof locatorSchema>

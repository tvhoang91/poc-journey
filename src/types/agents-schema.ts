import z from 'zod'
import { journeySpecSchema } from './journey-schema'
import { actionPlanSchema } from './actions-schema'

export const intentExecutionSchema = z.object({
  intent: z.string(),
  actionPlan: actionPlanSchema.optional(),
  state: z.enum(['planning', 'executing', 'completed', 'failed']),
  currentStep: z.number(),
  errorMessage: z.string().optional(),
})

export const coordinatorContextSchema = z.object({
  journeySpec: journeySpecSchema,
  intentExecutions: z.array(intentExecutionSchema),
})

export const coordinatorLogSchema = z.object({
  type: z.enum(['info', 'success', 'failure']),
  message: z.string(),
  data: z.any().optional(),
  timestamp: z.date(),
})

export type IntentExecution = z.infer<typeof intentExecutionSchema>
export type CoordinatorLog = z.infer<typeof coordinatorLogSchema>
export type CoordinatorContext = z.infer<typeof coordinatorContextSchema>

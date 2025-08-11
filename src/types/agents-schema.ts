import z from 'zod'
import { journeySpecSchema } from './journey-schema'
import { actionPlanSchema } from './actions-schema'

export const intentExecutionSchema = z.object({
  intent: z.string().min(5).max(200),
  actionPlan: actionPlanSchema.optional(),
  state: z.enum(['planning', 'executing', 'completed', 'failed']),
  currentStep: z.number().min(0),
  errorMessage: z.string().optional(),
})

export const coordinatorContextSchema = z.object({
  journeySpec: journeySpecSchema,
  intentExecutions: z.array(intentExecutionSchema).min(1),
})

export const coordinatorLogSchema = z.object({
  type: z.enum(['info', 'success', 'failure']),
  message: z.string().min(1).max(1000),
  data: z.any().optional(),
  timestamp: z.date(),
})

export type IntentExecution = z.infer<typeof intentExecutionSchema>
export type CoordinatorLog = z.infer<typeof coordinatorLogSchema>
export type CoordinatorContext = z.infer<typeof coordinatorContextSchema>

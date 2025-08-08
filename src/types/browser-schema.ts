import { z } from 'zod'

export const simulateStepSchema = z.object({
  action: z.string(),
  selector: z.string().optional(),
  text: z.string().optional(),
  timeout: z.number().optional(),
})

export type SimulateStep = z.infer<typeof simulateStepSchema>

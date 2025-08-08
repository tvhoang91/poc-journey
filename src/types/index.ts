import { z } from 'zod'

export const JourneyStepSchema = z.object({
  action: z.enum(['navigate', 'click', 'type', 'wait', 'screenshot']),
  selector: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional(),
  timeout: z.number().optional(),
})

export const JourneySpecSchema = z.object({
  name: z.string(),
  description: z.string(),
  baseUrl: z.string().url(),
  credentials: z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .optional(),
  steps: z.array(JourneyStepSchema),
})

export type JourneyStep = z.infer<typeof JourneyStepSchema>
export type JourneySpec = z.infer<typeof JourneySpecSchema>

export interface UXMetrics {
  loadTime: number
  interactionTime: number
  errorCount: number
  screenshotPaths: string[]
  timestamp: Date
}

export interface UXReport {
  journeyName: string
  metrics: UXMetrics
  analysis: {
    score: number
    insights: string[]
    recommendations: string[]
  }
  generatedAt: Date
}

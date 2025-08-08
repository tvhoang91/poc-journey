import { z } from 'zod'

export const userProfileSchema = z.object({
  role: z.string(),
  experienceLevel: z.string(),
  newTo: z.array(z.string()).optional(),
})

export const userSimulationSchema = z.object({
  userProfile: userProfileSchema,
  goals: z.array(z.string()),
  context: z.array(z.string()),
})

export const journeySpecSchema = z.object({
  name: z.string(),
  description: z.string(),
  baseUrl: z.string(),
  credentials: z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .optional(),
  userSimulation: userSimulationSchema,
  successCriteria: z.array(z.string()).optional(),
})

export type UserProfile = z.infer<typeof userProfileSchema>
export type UserSimulation = z.infer<typeof userSimulationSchema>
export type JourneySpec = z.infer<typeof journeySpecSchema>

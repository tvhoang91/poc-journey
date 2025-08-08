import { z } from 'zod'

export const domElementSchema = z.object({
  tagName: z.string(),
  selector: z.string(),
  text: z.string(),
  insights: z.array(z.string()),
})

export const interactiveElementSchema = domElementSchema.extend({
  interactiveRole: z.enum(['submit', 'fill', 'select', 'open', 'hover']),
})

export const domAnalysisSchema = z.object({
  interestElements: z.array(domElementSchema),
  interactiveElements: z.array(interactiveElementSchema),

  // What changed from the previous analysis,
  uiChanges: z.array(z.string()),
  // meaningful insights about the app feedback
  appFeedback: z.array(z.string()),
})

export type DOMAnalysis = z.infer<typeof domAnalysisSchema>
export type DOMElement = z.infer<typeof domElementSchema>
export type InteractiveElement = z.infer<typeof interactiveElementSchema>

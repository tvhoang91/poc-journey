// Strategic action plan from cloud AI
export interface ActionPlan {
  steps: PlannedAction[]
  reasoning: string
  fallbackStrategies: string[]
  expectedOutcome: string
  riskAssessment: string
}

// Individual planned action
export interface PlannedAction {
  type: 'navigate' | 'click' | 'type' | 'wait' | 'scroll' | 'screenshot'
  target?: string
  value?: string
  selector?: string
  reasoning: string
  confidence: number
  timeout: number
}

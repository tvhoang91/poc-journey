// Core agent interface that all specialized agents implement
export interface Agent {
  name: string
  type: 'local' | 'cloud'
  isReady(): Promise<boolean>
  process(input: AgentMessage): Promise<AgentResponse>
  handleError(error: Error): Promise<AgentResponse>
}

// Message structure for inter-agent communication
export interface AgentMessage {
  id: string
  type: 'dom_analysis' | 'strategy_planning' | 'action_execution' | 'coordination'
  payload: any
  context: AgentContext
  timestamp: Date
}

// Agent response with results and next steps
export interface AgentResponse {
  success: boolean
  data?: any
  error?: string
  nextAgent?: string
  confidence: number
  executionTime: number
}

// Shared context across all agents
export interface AgentContext {
  journeySpec: any // Will import from journey-schema
  currentStep: number
  pageState: PageState
  userIntent: string
  errorHistory: string[]
  screenshots: string[]
}

// Current page state information
export interface PageState {
  url: string
  title: string
  loadState: 'loading' | 'domcontentloaded' | 'networkidle'
  viewport: { width: number; height: number }
  errors: string[]
}

// Coordination event types
export interface CoordinationEvent {
  type: 'agent_started' | 'agent_completed' | 'agent_failed' | 'workflow_complete'
  agent: string
  data?: any
  timestamp: Date
}
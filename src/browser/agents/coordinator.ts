import { BaseAgent } from './base'
import { DOMAnalyzerAgent } from './dom-analyzer'
import { StrategyPlannerAgent } from './strategy-planner'
import { ActionExecutorAgent } from './action-executor'
import { AgentMessage, AgentResponse, CoordinationEvent, AgentContext } from '../../types'

export class AgentCoordinator extends BaseAgent {
  name = 'AgentCoordinator'
  type = 'local' as const

  private domAnalyzer: DOMAnalyzerAgent
  private strategyPlanner: StrategyPlannerAgent
  private actionExecutor: ActionExecutorAgent
  private events: CoordinationEvent[] = []

  constructor(config?: any) {
    super(config)

    this.domAnalyzer = new DOMAnalyzerAgent(config?.domAnalyzer)
    this.strategyPlanner = new StrategyPlannerAgent(config?.strategyPlanner)
    this.actionExecutor = new ActionExecutorAgent(config?.actionExecutor)
  }

  async process(input: AgentMessage): Promise<AgentResponse> {
    console.log(`🎯 ${this.name}: Orchestrating multi-agent workflow...`)
    const startTime = Date.now()

    try {
      const results = await this.mockCoordinateWorkflow(input.context)

      return {
        success: true,
        data: results,
        confidence: 0.91,
        executionTime: Date.now() - startTime,
      }
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  private async mockCoordinateWorkflow(context: AgentContext): Promise<any> {
    console.log(`  🚀 Starting workflow for intent: ${context.userIntent}`)

    // STEP 1: Verify all agents are ready
    await this.initializeAgents()

    // STEP 2: DOM Analysis (Local Model)
    const domAnalysis = await this.performDOMAnalysis(context)

    // STEP 3: Strategy Planning (Cloud AI)
    const actionPlan = await this.planActions(context, domAnalysis)

    // STEP 4: Action Execution (Playwright)
    const executionResults = await this.executeActions(context, actionPlan)

    // STEP 5: Workflow completion
    this.emitEvent('workflow_complete', 'coordinator', {
      domAnalysis,
      actionPlan,
      executionResults,
    })

    console.log('  🎉 Multi-agent workflow completed successfully')

    return {
      domAnalysis,
      actionPlan,
      executionResults,
      events: this.events,
      metrics: await this.getWorkflowMetrics(),
    }
  }

  private async initializeAgents(): Promise<void> {
    console.log('  🤖 Initializing agent system...')

    const agents = [
      { name: 'DOMAnalyzer', agent: this.domAnalyzer },
      { name: 'StrategyPlanner', agent: this.strategyPlanner },
      { name: 'ActionExecutor', agent: this.actionExecutor },
    ]

    for (const { name, agent } of agents) {
      const isReady = await agent.isReady()
      if (isReady) {
        console.log(`    ✅ ${name}: Ready`)
      } else {
        throw new Error(`${name} agent failed to initialize`)
      }
    }

    this.emitEvent('agent_started', 'coordinator', {
      message: 'All agents initialized successfully',
    })
  }

  private async performDOMAnalysis(context: AgentContext): Promise<any> {
    this.emitEvent('agent_started', 'dom-analyzer', { context })

    const message: AgentMessage = {
      id: this.generateMessageId(),
      type: 'dom_analysis',
      payload: { pageUrl: context.pageState.url },
      context,
      timestamp: new Date(),
    }

    const response = await this.domAnalyzer.process(message)

    if (response.success) {
      this.emitEvent('agent_completed', 'dom-analyzer', response.data)
    } else {
      this.emitEvent('agent_failed', 'dom-analyzer', response.error)
    }

    return response.data
  }

  private async planActions(context: AgentContext, domAnalysis: any): Promise<any> {
    this.emitEvent('agent_started', 'strategy-planner', { context, domAnalysis })

    const message: AgentMessage = {
      id: this.generateMessageId(),
      type: 'strategy_planning',
      payload: domAnalysis,
      context,
      timestamp: new Date(),
    }

    const response = await this.strategyPlanner.process(message)

    if (response.success) {
      this.emitEvent('agent_completed', 'strategy-planner', response.data)
    } else {
      this.emitEvent('agent_failed', 'strategy-planner', response.error)
    }

    return response.data
  }

  private async executeActions(context: AgentContext, actionPlan: any): Promise<any> {
    this.emitEvent('agent_started', 'action-executor', { context, actionPlan })

    const message: AgentMessage = {
      id: this.generateMessageId(),
      type: 'action_execution',
      payload: actionPlan,
      context,
      timestamp: new Date(),
    }

    const response = await this.actionExecutor.process(message)

    if (response.success) {
      this.emitEvent('agent_completed', 'action-executor', response.data)
    } else {
      this.emitEvent('agent_failed', 'action-executor', response.error)
    }

    return response.data
  }

  private emitEvent(type: CoordinationEvent['type'], agent: string, data?: any): void {
    const event: CoordinationEvent = {
      type,
      agent,
      data,
      timestamp: new Date(),
    }

    this.events.push(event)
    console.log(`  📡 Event: ${type} from ${agent}`)
  }

  async executeUserIntent(userIntent: string, context: AgentContext): Promise<any> {
    console.log(`🎯 Coordinating execution of: ${userIntent}`)

    context.userIntent = userIntent

    const message: AgentMessage = {
      id: this.generateMessageId(),
      type: 'coordination',
      payload: { userIntent },
      context,
      timestamp: new Date(),
    }

    return this.process(message)
  }

  private async getWorkflowMetrics(): Promise<any> {
    const actionMetrics = await this.actionExecutor.getMetrics()

    return {
      totalEvents: this.events.length,
      agentExecutions: this.events.filter((e) => e.type === 'agent_completed').length,
      agentFailures: this.events.filter((e) => e.type === 'agent_failed').length,
      workflowDuration: this.calculateWorkflowDuration(),
      actionMetrics,
    }
  }

  private calculateWorkflowDuration(): number {
    if (this.events.length < 2) return 0

    const start = this.events[0].timestamp
    const end = this.events[this.events.length - 1].timestamp
    return end.getTime() - start.getTime()
  }

  async getEvents(): Promise<CoordinationEvent[]> {
    return [...this.events]
  }

  async reset(): Promise<void> {
    console.log('🔄 Resetting coordinator state...')
    this.events = []

    // Reset agent states if needed
    // await this.domAnalyzer.reset()
    // await this.strategyPlanner.reset()
    // await this.actionExecutor.reset()
  }

  async handleAgentFailure(agentName: string, error: Error, context: AgentContext): Promise<void> {
    console.error(`💥 Agent failure detected: ${agentName} - ${error.message}`)

    this.emitEvent('agent_failed', agentName, {
      error: error.message,
      context: context.userIntent,
    })

    // Implement recovery strategies
    if (agentName === 'strategy-planner') {
      console.log('🔄 Attempting fallback planning strategy...')
      // Could retry with simplified planning or use cached plans
    } else if (agentName === 'action-executor') {
      console.log('🔄 Attempting action execution recovery...')
      // Could retry with different selectors or reduced timeouts
    }
  }
}

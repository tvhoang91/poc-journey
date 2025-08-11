import { DOMAnalyzerAgent } from './agents/dom-analyzer'
import { ActionPlannerAgent } from './agents/action-planner'
import { ActionExecutorAgent } from './agents/action-executor'
import { UXMetrics, CoordinatorLog, JourneySpec, CoordinatorContext } from '../types'

export class AgentCoordinator {
  private coordinatorContext: CoordinatorContext

  logs: CoordinatorLog[] = []
  metrics: UXMetrics = {
    errorCount: 0,
    screenshotPaths: [],
  }

  private domAnalyzer: DOMAnalyzerAgent
  private actionPlanner: ActionPlannerAgent
  private actionExecutor: ActionExecutorAgent

  constructor(journeySpec: JourneySpec) {
    this.coordinatorContext = { journeySpec, intentExecutions: [] }
    this.domAnalyzer = new DOMAnalyzerAgent(journeySpec)
    this.actionPlanner = new ActionPlannerAgent(journeySpec)
    this.actionExecutor = new ActionExecutorAgent(journeySpec)
  }

  async run() {
    await this.init()
    let loopCount = 0

    do {
      loopCount++
      // Come up with a plan and execute it repeatedly until journey is completed or max plan loop is reached
      await this.planAndExecute()
    } while (loopCount < MAX_PLAN_LOOP && !this.isJourneyCompleted())

    return this.logs
  }

  private async init() {
    await Promise.all([this.domAnalyzer.init(), this.actionPlanner.init(), this.actionExecutor.init()])
    const userIntents = [
      'Logged in to WordPress Admin',
      'Navigate to Coupons page',
      // 'Open Create Coupon Form',
      // 'Create first coupon',
    ]
    this.coordinatorContext.intentExecutions = userIntents.map((intent) => ({
      intent,
      actionPlan: undefined,
      state: 'planning',
      currentStep: 0,
    }))

    this.log('Coordinator: Initializing agents DONE')
  }

  private async planAndExecute() {
    await this.mockPlanNextAction()

    let executedActionConfidence = 0
    do {
      // Execute action until plan is completed or something is not working, then stop to come up with a new plan
      executedActionConfidence = await this.executeAction()
    } while (!this.isPlanCompleted() && executedActionConfidence > 0.5)
  }

  private async mockPlanNextAction() {
    await this.mockAnalyzeDom()

    this.coordinatorContext.intentExecutions = await this.actionPlanner.planNextAction(
      this.coordinatorContext.intentExecutions,
    )
  }

  private async executeAction() {
    // Execute one action step.
    // Heuristically check if the action is successful.
    // For example, check the plan success selector, if it take too long, too many error logs

    return 0.8
  }

  private async mockAnalyzeDom() {
    // Load the DOM, anlyze the diff
    // Use Local Model to check if it match the executed action plan
    // Return the summary for the Reasoning Models to plan next action, or replan undone steps
    this.log('Coordinator: Analyzing DOM DONE')
  }

  private isJourneyCompleted() {
    return this.coordinatorContext.intentExecutions.every((execution) => execution.state === 'completed')
  }
  private isPlanCompleted() {
    for (const execution of this.coordinatorContext.intentExecutions) {
      if (execution.state === 'completed') {
        continue // check next intent
      } else if (execution.state === 'planning') {
        return true
      } else if (execution.state === 'failed') {
        return true
      } else if (execution.state === 'executing') {
        const planedSteps = execution.actionPlan?.steps.length ?? 0
        const executedSteps = execution.currentStep

        return planedSteps === executedSteps
      }
    }

    // journey is completed if all intents are completed
    return true
  }

  log(message: string) {
    this.logs.push({
      type: 'info',
      message,
      timestamp: new Date(),
    })
  }
}

const MAX_PLAN_LOOP = 10

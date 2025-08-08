import { DOMAnalyzerAgent } from './agents/dom-analyzer'
import { StrategyPlannerAgent } from './agents/strategy-planner'
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
  private strategyPlanner: StrategyPlannerAgent
  private actionExecutor: ActionExecutorAgent

  constructor(journeySpec: JourneySpec) {
    this.coordinatorContext = { journeySpec, intentExecutions: [] }
    this.domAnalyzer = new DOMAnalyzerAgent()
    this.strategyPlanner = new StrategyPlannerAgent()
    this.actionExecutor = new ActionExecutorAgent()
  }

  async run() {
    await this.mockInit()
    let loopCount = 0

    do {
      loopCount++
      // Come up with a plan and execute it repeatedly until journey is completed or max plan loop is reached
      await this.mockPlanAndExecute()
    } while (loopCount < MAX_PLAN_LOOP && !this.isJourneyCompleted())

    return this.logs
  }

  private async mockInit() {
    // await Promise.all([this.domAnalyzer.init(), this.strategyPlanner.init(), this.actionExecutor.init()])
    const userGoals = this.coordinatorContext.journeySpec.userSimulation.goals
    this.coordinatorContext.intentExecutions = userGoals.map((goal) => ({
      intent: goal,
      actionPlan: undefined,
      state: 'planning',
      currentStep: 0,
    }))

    this.log('Coordinator: Initializing agents DONE')
  }

  private async mockPlanAndExecute() {
    await this.mockPlanNextAction()

    let executedActionConfidence = 0
    do {
      // Execute action until plan is completed or something is not working, then stop to come up with a new plan
      executedActionConfidence = await this.mockExecuteAction()
    } while (!this.isPlanCompleted() && executedActionConfidence > 0.5)
  }

  private async mockPlanNextAction() {
    // if some action is done
    const domAnalysis = await this.mockAnalyzeDom()

    // come up with a plan
    // this.coordinatorContext.intentExecutions = await this.strategyPlanner.planNextAction(
    // this.coordinatorContext.intentExecutions, domAnalysis)
  }

  private async mockExecuteAction() {
    // Execute one action step.
    // Heuristically check if the action is successful.
    // For example, it take too long, or too many error logs

    return 0.8
  }

  private async mockAnalyzeDom() {
    // Load the DOM, anlyze the diff
    // Use Local Model to check if it match the executed action plan
    // Return the summary for the Reasoning Models to plan next action, or replan undone steps
    this.log('Coordinator: Analyzing DOM DONE')
  }

  private isJourneyCompleted() {
    // journey complete after all plan executed
    return true
  }
  private isPlanCompleted() {
    // plan complete then need to analyze the DOM and come up with a next plan
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

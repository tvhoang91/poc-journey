import { BaseAgent } from './base'
import { AgentMessage, AgentResponse } from '../../types'
import { ActionPlan } from '../../types/actions-type'
import { DOMAnalysis } from '../../types/dom-type'

export class StrategyPlannerAgent extends BaseAgent {
  name = 'StrategyPlanner'
  type = 'cloud' as const

  constructor(config?: { apiKey?: string; model?: string }) {
    super(config)
  }

  async process(input: AgentMessage): Promise<AgentResponse> {
    console.log(`🧠 ${this.name}: Creating action plan...`)
    const startTime = Date.now()

    try {
      const domAnalysis = input.payload as DOMAnalysis
      const userIntent = input.context.userIntent

      console.log(`   Intent: ${userIntent}`)
      console.log(`   Available elements: ${domAnalysis?.elements?.length || 0}`)

      await this.wait(800) // Simulate AI processing time

      const actionPlan: ActionPlan = await this.mockPlanActions(domAnalysis, userIntent)

      return {
        success: true,
        data: actionPlan,
        confidence: 0.87,
        executionTime: Date.now() - startTime,
      }
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  private async mockPlanActions(domAnalysis: DOMAnalysis, userIntent: string): Promise<ActionPlan> {
    // Mock implementation - real version would:
    // 1. Send DOM analysis + intent to cloud AI (Hugging Face/OpenAI)
    // 2. Use chain-of-thought prompting for reasoning
    // 3. Generate structured action plan
    // 4. Include confidence scores and fallbacks

    console.log('  🌐 Connecting to cloud AI (Hugging Face)...')
    console.log('  ⚡ Processing with chain-of-thought reasoning...')

    const isLoginIntent = userIntent.toLowerCase().includes('login') || userIntent.toLowerCase().includes('auth')

    if (isLoginIntent) {
      return {
        steps: [
          {
            type: 'click',
            selector: 'input[type="email"]',
            reasoning: 'Focus email input field to begin authentication flow',
            confidence: 0.95,
            timeout: 5000,
          },
          {
            type: 'type',
            selector: 'input[type="email"]',
            value: 'user@example.com',
            reasoning: 'Enter email address for login',
            confidence: 0.98,
            timeout: 3000,
          },
          {
            type: 'click',
            selector: 'button[data-testid="login-button"]',
            reasoning: 'Submit login form to authenticate user',
            confidence: 0.92,
            timeout: 10000,
          },
        ],
        reasoning: `Based on DOM analysis, detected standard login form with email input and submit button. 
                    Plan follows typical authentication flow with progressive enhancement.`,
        fallbackStrategies: [
          'If email field not found, try alternative selectors: input[name="email"], #email',
          'If login button fails, try form submission via Enter key',
          'If authentication fails, capture error messages for debugging',
        ],
        expectedOutcome: 'User successfully authenticated and redirected to dashboard',
        riskAssessment: 'Low risk - standard form elements detected with high confidence selectors',
      }
    }

    // Default navigation plan
    return {
      steps: [
        {
          type: 'navigate',
          target: 'https://example.com',
          reasoning: 'Navigate to target URL as specified in user intent',
          confidence: 0.99,
          timeout: 15000,
        },
        {
          type: 'screenshot',
          reasoning: 'Capture initial page state for analysis',
          confidence: 1.0,
          timeout: 2000,
        },
        {
          type: 'wait',
          reasoning: 'Allow page to fully load before proceeding',
          confidence: 0.9,
          timeout: 3000,
        },
      ],
      reasoning: 'Basic navigation plan with page load verification',
      fallbackStrategies: [
        'If navigation fails, retry with different user agent',
        'If page load is slow, increase timeout threshold',
      ],
      expectedOutcome: 'Successfully navigate to target page and capture state',
      riskAssessment: 'Very low risk - standard navigation pattern',
    }
  }

  async planForIntent(intent: string, domAnalysis?: DOMAnalysis): Promise<ActionPlan> {
    console.log(`🎯 Planning for intent: ${intent}`)

    const message: AgentMessage = {
      id: this.generateMessageId(),
      type: 'strategy_planning',
      payload: domAnalysis,
      context: {
        journeySpec: null,
        currentStep: 0,
        pageState: {
          url: '',
          title: '',
          loadState: 'loading',
          viewport: { width: 1920, height: 1080 },
          errors: [],
        },
        userIntent: intent,
        errorHistory: [],
        screenshots: [],
      },
      timestamp: new Date(),
    }

    const response = await this.process(message)
    return response.data as ActionPlan
  }

  async generateFallbackPlan(originalPlan: ActionPlan, error: string): Promise<ActionPlan> {
    console.log(`🔄 Generating fallback plan due to: ${error}`)
    await this.wait(400)

    return {
      ...originalPlan,
      steps: originalPlan.steps.map((step) => ({
        ...step,
        confidence: step.confidence * 0.8, // Lower confidence for fallback
        timeout: step.timeout * 1.5, // Increase timeout
      })),
      reasoning: `Fallback plan generated due to: ${error}. ${originalPlan.reasoning}`,
      riskAssessment: 'Higher risk - using fallback strategy',
    }
  }
}

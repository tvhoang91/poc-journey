import { BaseAgent } from './base'
import { AgentMessage, AgentResponse } from '../../types'
import { ActionPlan, PlannedAction } from '../../types/actions-type'

export class ActionExecutorAgent extends BaseAgent {
  name = 'ActionExecutor'
  type = 'local' as const

  private screenshotPaths: string[] = []
  private metrics = {
    totalInteractionTime: 0,
    errorCount: 0,
  }

  constructor(config?: { headless?: boolean; viewport?: { width: number; height: number } }) {
    super(config)
  }

  async process(input: AgentMessage): Promise<AgentResponse> {
    console.log(`🎭 ${this.name}: Executing action plan...`)
    const startTime = Date.now()

    try {
      const actionPlan = input.payload as ActionPlan
      const results = await this.mockExecuteActionPlan(actionPlan)

      return {
        success: true,
        data: {
          results,
          metrics: this.metrics,
          screenshots: this.screenshotPaths,
        },
        confidence: 0.94,
        executionTime: Date.now() - startTime,
      }
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  private async mockExecuteActionPlan(plan: ActionPlan): Promise<any[]> {
    // Mock implementation - real version would use Playwright:
    console.log(`  📋 Executing ${plan.steps.length} planned actions...`)

    const results = []

    for (const [index, action] of plan.steps.entries()) {
      console.log(`   Step ${index + 1}: ${action.type} - ${action.reasoning}`)

      try {
        const stepStart = Date.now()
        const result = await this.mockExecuteAction(action)
        const stepTime = Date.now() - stepStart

        this.metrics.totalInteractionTime += stepTime
        results.push({
          action,
          result,
          executionTime: stepTime,
          success: true,
        })

        console.log(`   ✅ Step completed in ${stepTime}ms (confidence: ${action.confidence})`)
      } catch (error) {
        console.error(`   ❌ Step failed: ${error}`)
        this.metrics.errorCount++
        results.push({
          action,
          error: (error as Error).message,
          success: false,
        })
      }
    }

    console.log('🎭 Action plan execution completed')
    return results
  }

  private async mockExecuteAction(action: PlannedAction): Promise<any> {
    // Mock implementations for different action types
    switch (action.type) {
      case 'navigate':
        return this.mockNavigate(action.target!)
      case 'click':
        return this.mockClick(action.selector!)
      case 'type':
        return this.mockType(action.value!, action.selector!)
      case 'wait':
        return this.mockWait(action.timeout)
      case 'screenshot':
        return this.mockScreenshot()
      case 'scroll':
        return this.mockScroll()
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

  private async mockNavigate(url: string): Promise<any> {
    console.log(`🔗 Navigating to: ${url}`)
    await this.wait(1000)

    // Real implementation would:
    // await this.page.goto(url)
    // await this.page.waitForLoadState('networkidle')

    return {
      url,
      loadTime: 1000,
      status: 'success',
    }
  }

  private async mockClick(selector: string): Promise<any> {
    console.log(`🖱️  Clicking: ${selector}`)
    await this.wait(500)

    // Real implementation would:
    // await this.page.locator(selector).click()
    // await this.page.waitForTimeout(100)

    return {
      selector,
      clicked: true,
      elementFound: true,
    }
  }

  private async mockType(text: string, selector: string): Promise<any> {
    console.log(`⌨️  Typing "${text}" in: ${selector}`)
    await this.wait(text.length * 50)

    // Real implementation would:
    // const input = this.page.locator(selector)
    // await input.clear()
    // await input.type(text, { delay: 50 })

    return {
      selector,
      text,
      typed: true,
      elementFound: true,
    }
  }

  private async mockWait(timeout: number): Promise<any> {
    console.log(`⏰ Waiting ${timeout}ms...`)
    await this.wait(timeout)

    return {
      waited: timeout,
      status: 'completed',
    }
  }

  private async mockScreenshot(): Promise<any> {
    const screenshotPath = `data/screenshots/action_screenshot_${Date.now()}.png`
    console.log(`📸 Taking screenshot: ${screenshotPath}`)
    this.screenshotPaths.push(screenshotPath)
    await this.wait(200)

    // Real implementation would:
    // const screenshot = await this.page.screenshot()
    // await fs.writeFile(screenshotPath, screenshot)

    return {
      path: screenshotPath,
      timestamp: new Date(),
      captured: true,
    }
  }

  private async mockScroll(): Promise<any> {
    console.log('📜 Scrolling page...')
    await this.wait(200)

    // Real implementation would:
    // await this.page.evaluate(() => window.scrollBy(0, 300))

    return {
      scrolled: true,
      direction: 'down',
      amount: 300,
    }
  }

  async executeAction(action: PlannedAction): Promise<any> {
    console.log(`🎯 Executing single action: ${action.type}`)
    return this.mockExecuteAction(action)
  }

  async getMetrics(): Promise<any> {
    return {
      ...this.metrics,
      screenshots: this.screenshotPaths.length,
      screenshotPaths: this.screenshotPaths,
    }
  }

  async isPageReady(): Promise<boolean> {
    console.log('🔍 Checking if page is ready...')
    await this.wait(100)

    // Real implementation would check:
    // - Page load state
    // - No pending network requests
    // - Document ready state
    // - No loading spinners

    return true
  }
}

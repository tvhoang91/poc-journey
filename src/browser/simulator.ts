import { JourneySpec, JourneyStep, UXMetrics } from '../types'

export class BrowserSimulator {
  private metrics: UXMetrics = {
    loadTime: 0,
    interactionTime: 0,
    errorCount: 0,
    screenshotPaths: [],
    timestamp: new Date(),
  }

  async simulateJourney(journey: JourneySpec): Promise<UXMetrics> {
    console.log(`Starting journey simulation: ${journey.name}`)
    
    this.metrics.timestamp = new Date()
    const startTime = Date.now()

    try {
      for (const step of journey.steps) {
        await this.executeStep(step)
      }
    } catch (error) {
      console.error('Journey simulation failed:', error)
      this.metrics.errorCount++
    }

    this.metrics.loadTime = Date.now() - startTime
    return this.metrics
  }

  private async executeStep(step: JourneyStep): Promise<void> {
    const stepStart = Date.now()
    
    console.log(`Executing step: ${step.action}`)
    
    switch (step.action) {
      case 'navigate':
        await this.navigate(step.url!)
        break
      case 'click':
        await this.click(step.selector!)
        break
      case 'type':
        await this.type(step.text!, step.selector!)
        break
      case 'wait':
        await this.wait(step.timeout || 1000)
        break
      case 'screenshot':
        await this.screenshot()
        break
    }

    this.metrics.interactionTime += Date.now() - stepStart
  }

  private async navigate(url: string): Promise<void> {
    console.log(`Navigating to: ${url}`)
    await this.wait(1000)
  }

  private async click(selector: string): Promise<void> {
    console.log(`Clicking: ${selector}`)
    await this.wait(500)
  }

  private async type(text: string, selector: string): Promise<void> {
    console.log(`Typing "${text}" in: ${selector}`)
    await this.wait(text.length * 50)
  }

  private async wait(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  private async screenshot(): Promise<void> {
    const screenshotPath = `data/screenshots/screenshot_${Date.now()}.png`
    console.log(`Taking screenshot: ${screenshotPath}`)
    this.metrics.screenshotPaths.push(screenshotPath)
    await this.wait(200)
  }
}
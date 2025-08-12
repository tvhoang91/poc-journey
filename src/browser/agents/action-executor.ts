import { Action, JourneySpec, Locator } from '../../types'
import { chromium, Browser, Page } from 'playwright'

export class ActionExecutorAgent {
  journeySpec: JourneySpec
  browser?: Browser
  page?: Page

  constructor(journeySpec: JourneySpec) {
    this.journeySpec = journeySpec
  }

  async init() {
    this.browser = await chromium.launch({ headless: false })
    this.page = await this.browser.newPage()
  }

  async executeAction(action: Action) {
    switch (action.action) {
      case 'navigate':
        await this.navigate(action)
        break
      case 'click':
        await this.click(action)
        break
      case 'fill':
        await this.fill(action)
        break
      case 'check':
        await this.check(action)
        break
      case 'uncheck':
        await this.uncheck(action)
        break
    }

    // Execute one action step.
    // Heuristically check if the action is successful.
    // For example, check the plan success selector, if it take too long, too many error logs
    // > 0.5 means the action is successful, <= 0.5 means the action is not successful
    return 0.8
  }

  async navigate(action: Action) {
    await this.page?.goto(action.value!)
    await this.page?.waitForLoadState('networkidle', { timeout: 10000 })
    await this.waitFor(action.waitForLocator)
  }

  async click(action: Action) {
    const button = await this.locateElement(action.targetLocator!)
    await button?.click()
    await this.waitFor(action.waitForLocator)
  }

  async fill(action: Action) {
    const input = await this.locateElement(action.targetLocator!)
    await input?.fill(action.value!)
    await this.waitFor(action.waitForLocator)
  }

  async check(action: Action) {
    const checkbox = await this.locateElement(action.targetLocator!)
    await checkbox?.check()
    await this.waitFor(action.waitForLocator)
  }

  async uncheck(action: Action) {
    const checkbox = await this.locateElement(action.targetLocator!)
    await checkbox?.uncheck()
    await this.waitFor(action.waitForLocator)
  }

  async locateElement(locator: Locator) {
    switch (locator.getBy) {
      case 'role':
        return this.page?.getByRole(locator.selector as any, { name: locator.name, includeHidden: true })
      case 'label':
        return this.page?.getByLabel(locator.selector)
      case 'text':
        return this.page?.getByText(locator.selector)
      case 'css':
        return this.page?.locator(locator.selector)
    }
  }

  /** User waiting for feedback after an action */
  async waitFor(locator?: Locator, timeout = 2000) {
    if (locator) {
      console.log('Waiting for locator:', locator)
      const waitFor = await this.locateElement(locator)
      await waitFor?.waitFor({ timeout })
      console.log('Found locator:', locator)
    } else {
      if (timeout > 0) {
        await this.page?.waitForTimeout(timeout)
      }
    }
  }

  async destroy() {
    this.browser?.close()
  }
}

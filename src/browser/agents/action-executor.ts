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
    }
  }

  async navigate(action: Action) {
    await this.page?.goto(action.value!)
    await this.page?.waitForLoadState('networkidle', { timeout: 10000 })

    if (action.waitForLocator) {
      const waitFor = await this.locateElement(action.waitForLocator)
      await waitFor?.waitFor({ timeout: 5000 })
    }
  }

  async click(action: Action) {
    const button = await this.locateElement(action.targetLocator!)
    await button?.click()

    if (action.waitForLocator) {
      const waitFor = await this.locateElement(action.waitForLocator)
      await waitFor?.waitFor({ timeout: 5000 })
    } else {
      await this.page?.waitForTimeout(2000)
    }
  }

  async fill(action: Action) {
    const input = await this.locateElement(action.targetLocator!)
    await input?.fill(action.value!)
  }

  async check(action: Action) {
    const checkbox = await this.locateElement(action.targetLocator!)
    if (action.value === 'unchecked') {
      await checkbox?.uncheck()
    } else {
      await checkbox?.check()
    }
  }

  async locateElement(locator: Locator) {
    switch (locator.getBy) {
      case 'role':
        return this.page?.getByRole(locator.selector as any, { name: locator.name })
      case 'label':
        return this.page?.getByLabel(locator.selector)
      case 'text':
        return this.page?.getByText(locator.selector)
    }
  }
}

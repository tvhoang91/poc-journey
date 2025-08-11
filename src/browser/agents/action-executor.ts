import { JourneySpec } from '../../types'

export class ActionExecutorAgent {
  journeySpec: JourneySpec

  constructor(journeySpec: JourneySpec) {
    this.journeySpec = journeySpec
  }

  async init() {}

  async executeAction() {}
}

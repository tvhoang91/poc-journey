import { JourneySpec } from '../../types'

export class DOMAnalyzerAgent {
  journeySpec: JourneySpec

  constructor(journeySpec: JourneySpec) {
    this.journeySpec = journeySpec
  }

  async init() {}

  async analyzeDom() {}
}

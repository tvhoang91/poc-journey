import { Agent, AgentMessage, AgentResponse } from '../../types'

export abstract class BaseAgent implements Agent {
  abstract name: string
  abstract type: 'local' | 'cloud'

  constructor(protected config?: any) {}

  abstract process(input: AgentMessage): Promise<AgentResponse>

  async isReady(): Promise<boolean> {
    return true
  }

  async handleError(error: Error): Promise<AgentResponse> {
    console.error(`${this.name} error:`, error.message)
    return {
      success: false,
      error: error.message,
      confidence: 0,
      executionTime: 0,
    }
  }

  protected async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected generateMessageId(): string {
    return `${this.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

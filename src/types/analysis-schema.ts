export interface UXMetrics {
  loadTime: number
  interactionTime: number
  errorCount: number
  screenshotPaths: string[]
  timestamp: Date
}

export interface UXReport {
  journeyName: string
  metrics: UXMetrics
  analysis: {
    score: number
    insights: string[]
    recommendations: string[]
  }
  generatedAt: Date
}

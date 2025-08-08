export interface UXMetrics {
  errorCount: number
  screenshotPaths: string[]
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

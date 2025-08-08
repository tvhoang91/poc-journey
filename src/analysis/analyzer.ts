import { UXMetrics, UXReport } from '../types'

export class UXAnalyzer {
  async analyzeJourney(journeyName: string, metrics: UXMetrics): Promise<UXReport> {
    console.log(`Analyzing UX metrics for: ${journeyName}`)

    const score = this.calculateUXScore(metrics)
    const insights = this.generateInsights(metrics)
    const recommendations = this.generateRecommendations(metrics)

    return {
      journeyName,
      metrics,
      analysis: {
        score,
        insights,
        recommendations,
      },
      generatedAt: new Date(),
    }
  }

  private calculateUXScore(metrics: UXMetrics): number {
    let score = 100

    if (metrics.loadTime > 5000) score -= 30
    else if (metrics.loadTime > 3000) score -= 20
    else if (metrics.loadTime > 2000) score -= 10

    if (metrics.interactionTime > 2000) score -= 20
    else if (metrics.interactionTime > 1000) score -= 10

    score -= metrics.errorCount * 25

    if (metrics.screenshotPaths.length === 0) score -= 10

    return Math.max(0, score)
  }

  private generateInsights(metrics: UXMetrics): string[] {
    const insights: string[] = []

    if (metrics.loadTime > 3000) {
      insights.push(`Page load time is ${metrics.loadTime}ms, which may impact user experience`)
    }

    if (metrics.interactionTime > 1000) {
      insights.push(`Interaction time is ${metrics.interactionTime}ms, indicating potential responsiveness issues`)
    }

    if (metrics.errorCount > 0) {
      insights.push(`${metrics.errorCount} errors occurred during the journey`)
    }

    if (metrics.screenshotPaths.length > 0) {
      insights.push(`${metrics.screenshotPaths.length} screenshots captured for visual analysis`)
    }

    if (insights.length === 0) {
      insights.push('Journey completed successfully with good performance metrics')
    }

    return insights
  }

  private generateRecommendations(metrics: UXMetrics): string[] {
    const recommendations: string[] = []

    if (metrics.loadTime > 3000) {
      recommendations.push('Optimize page load times by reducing bundle size and enabling caching')
    }

    if (metrics.interactionTime > 1000) {
      recommendations.push('Improve UI responsiveness by optimizing JavaScript execution and reducing DOM manipulation')
    }

    if (metrics.errorCount > 0) {
      recommendations.push('Fix identified errors to improve user journey completion rate')
    }

    if (metrics.screenshotPaths.length === 0) {
      recommendations.push('Add screenshot steps to capture visual state for better analysis')
    }

    return recommendations
  }
}
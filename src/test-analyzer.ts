import { UXAnalyzer } from './analysis/analyzer'
import { UXMetrics } from './types'

async function testAnalyzer() {
  console.log('🧠 Testing UX Analyzer')

  try {
    const analyzer = new UXAnalyzer()
    
    // Create test metrics scenarios
    const testScenarios = [
      {
        name: 'Fast Performance',
        metrics: {
          loadTime: 1500,
          interactionTime: 800,
          errorCount: 0,
          screenshotPaths: ['screenshot1.png', 'screenshot2.png'],
          timestamp: new Date(),
        } as UXMetrics,
      },
      {
        name: 'Slow Performance',
        metrics: {
          loadTime: 6000,
          interactionTime: 2500,
          errorCount: 1,
          screenshotPaths: ['screenshot1.png'],
          timestamp: new Date(),
        } as UXMetrics,
      },
      {
        name: 'Average Performance',
        metrics: {
          loadTime: 3000,
          interactionTime: 1200,
          errorCount: 0,
          screenshotPaths: ['screenshot1.png', 'screenshot2.png', 'screenshot3.png'],
          timestamp: new Date(),
        } as UXMetrics,
      },
      {
        name: 'Poor Performance with Errors',
        metrics: {
          loadTime: 8000,
          interactionTime: 3000,
          errorCount: 3,
          screenshotPaths: [],
          timestamp: new Date(),
        } as UXMetrics,
      },
    ]

    console.log('🔄 Testing different performance scenarios...\n')

    for (const scenario of testScenarios) {
      console.log(`📊 Testing scenario: ${scenario.name}`)
      console.log('Input metrics:', JSON.stringify(scenario.metrics, null, 2))

      const report = await analyzer.analyzeJourney(`Test Journey - ${scenario.name}`, scenario.metrics)
      
      console.log(`\n✅ Analysis completed for "${scenario.name}"`)
      console.log(`Score: ${report.analysis.score}/100`)
      
      console.log('Insights:')
      report.analysis.insights.forEach((insight, index) => {
        console.log(`  ${index + 1}. ${insight}`)
      })
      
      console.log('Recommendations:')
      report.analysis.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`)
      })

      console.log('\n' + '='.repeat(50) + '\n')
    }

    // Test with comprehensive report generation
    console.log('📄 Generating full report example...')
    const sampleMetrics: UXMetrics = {
      loadTime: 2800,
      interactionTime: 1100,
      errorCount: 0,
      screenshotPaths: ['login.png', 'dashboard.png'],
      timestamp: new Date(),
    }

    const fullReport = await analyzer.analyzeJourney('Sample Login Journey', sampleMetrics)
    
    console.log('\n📋 Complete Report Structure:')
    console.log(JSON.stringify(fullReport, null, 2))

    // Test scoring edge cases
    console.log('\n🧪 Testing edge cases...')
    
    const edgeCases = [
      { name: 'Perfect Performance', loadTime: 500, interactionTime: 200, errorCount: 0 },
      { name: 'Extremely Slow', loadTime: 15000, interactionTime: 5000, errorCount: 0 },
      { name: 'Multiple Errors', loadTime: 2000, interactionTime: 800, errorCount: 5 },
    ]

    for (const edgeCase of edgeCases) {
      const testMetrics: UXMetrics = {
        loadTime: edgeCase.loadTime,
        interactionTime: edgeCase.interactionTime,
        errorCount: edgeCase.errorCount,
        screenshotPaths: ['test.png'],
        timestamp: new Date(),
      }

      const edgeReport = await analyzer.analyzeJourney(edgeCase.name, testMetrics)
      console.log(`${edgeCase.name}: Score ${edgeReport.analysis.score}/100`)
    }

  } catch (error) {
    console.error('❌ Analyzer test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }
  }
}

if (require.main === module) {
  testAnalyzer()
}
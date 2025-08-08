import path from 'path'
import fs from 'fs/promises'
import { JourneyParser } from './journey/parser'
import { BrowserSimulator } from './browser/simulator'
import { UXAnalyzer } from './analysis/analyzer'

async function main() {
  console.log('🚀 Starting POC Journey Analysis')

  try {
    const journeyParser = new JourneyParser()
    const browserSimulator = new BrowserSimulator()
    const uxAnalyzer = new UXAnalyzer()

    const journeyFiles = await fs.readdir('data/journeys')
    const markdownFiles = journeyFiles.filter(file => file.endsWith('.md'))

    if (markdownFiles.length === 0) {
      console.log('No journey files found in data/journeys directory')
      return
    }

    for (const file of markdownFiles) {
      const filePath = path.join('data/journeys', file)
      console.log(`\n📄 Processing journey file: ${file}`)

      try {
        const journey = await journeyParser.parseJourneyFile(filePath)
        console.log(`✅ Parsed journey: ${journey.name}`)

        const metrics = await browserSimulator.simulateJourney(journey)
        console.log(`✅ Simulation completed`)

        const report = await uxAnalyzer.analyzeJourney(journey.name, metrics)
        console.log(`✅ Analysis completed with score: ${report.analysis.score}/100`)

        const reportPath = path.join('data/reports', `${journey.name.replace(/\s+/g, '_')}_report.json`)
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
        console.log(`📊 Report saved to: ${reportPath}`)

        console.log('\n📈 Analysis Summary:')
        console.log(`Score: ${report.analysis.score}/100`)
        console.log('Insights:')
        report.analysis.insights.forEach(insight => console.log(`  • ${insight}`))
        console.log('Recommendations:')
        report.analysis.recommendations.forEach(rec => console.log(`  • ${rec}`))
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error)
      }
    }

    console.log('\n🎉 Analysis complete!')
  } catch (error) {
    console.error('❌ Application error:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
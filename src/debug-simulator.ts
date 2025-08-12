import { AgentCoordinator } from './browser/coordinator'
import { JourneyParser } from './journey/parser'

async function testSimulator() {
  console.log('🎭 Testing Browser Simulator')
  let parser: JourneyParser | undefined
  let coordinator: AgentCoordinator | undefined

  try {
    parser = new JourneyParser()

    console.log('🚀 Starting simulation with test journey:')
    const sampleJourney = await parser.parseJourneyFile('data/journeys/sample-journey.md')
    console.log(JSON.stringify(sampleJourney, null, 2))

    console.log('\n⏳ Running simulation...')
    const startTime = Date.now()

    coordinator = new AgentCoordinator(sampleJourney)
    await coordinator.run()
    const metrics = coordinator.metrics

    const endTime = Date.now()
    console.log(`\n✅ Simulation completed in ${endTime - startTime}ms`)

    console.log('\n📊 Collected UX Metrics:')
    console.log(JSON.stringify(metrics, null, 2))

    console.log('\n📈 Metrics Summary:')
    console.log(`Error Count: ${metrics.errorCount}`)
    console.log(`Screenshots: ${metrics.screenshotPaths.length}`)

    if (metrics.screenshotPaths.length > 0) {
      console.log('\n📷 Screenshot paths:')
      metrics.screenshotPaths.forEach((path, index) => {
        console.log(`${index + 1}. ${path}`)
      })
    }
  } catch (error) {
    console.error('❌ Simulator test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }

    // wait for 5 minutes to debug
    await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000))
  } finally {
    if (parser) {
      await parser.destroy()
    }
    if (coordinator) {
      await coordinator.destroy()
    }
  }
}

if (require.main === module) {
  testSimulator()
}

import { simulateBrowser } from './browser/browser-simulator'

async function testSimulator() {
  console.log('🎭 Testing Browser Simulator')

  try {
    await simulateBrowser()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }
  }
}

// async function testSimulator() {
//   console.log('🎭 Testing Browser Simulator')

//   try {
//     const parser = new JourneyParser()

//     console.log('🚀 Starting simulation with test journey:')
//     const sampleJourney = await parser.parseJourneyFile('data/journeys/sample-journey.md')
//     console.log(JSON.stringify(sampleJourney, null, 2))

//     console.log('\n⏳ Running simulation...')
//     const startTime = Date.now()

//     const coordinator = new AgentCoordinator(sampleJourney)
//     await coordinator.run()
//     const metrics = coordinator.metrics

//     const endTime = Date.now()
//     console.log(`\n✅ Simulation completed in ${endTime - startTime}ms`)

//     console.log('\n📊 Collected UX Metrics:')
//     console.log(JSON.stringify(metrics, null, 2))

//     console.log('\n📈 Metrics Summary:')
//     console.log(`Error Count: ${metrics.errorCount}`)
//     console.log(`Screenshots: ${metrics.screenshotPaths.length}`)

//     if (metrics.screenshotPaths.length > 0) {
//       console.log('\n📷 Screenshot paths:')
//       metrics.screenshotPaths.forEach((path, index) => {
//         console.log(`${index + 1}. ${path}`)
//       })
//     }
//   } catch (error) {
//     console.error('❌ Simulator test failed:', error)
//     if (error instanceof Error) {
//       console.error('Error message:', error.message)
//       console.error('Stack trace:', error.stack)
//     }
//   }
// }

if (require.main === module) {
  testSimulator()
}

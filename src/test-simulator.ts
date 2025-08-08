import { BrowserSimulator } from './browser/simulator'
import { JourneySpec } from './types'

async function testSimulator() {
  console.log('🎭 Testing Browser Simulator')

  try {
    const simulator = new BrowserSimulator()

    // Create a test journey
    const testJourney: JourneySpec = {
      name: 'Test Login Flow',
      description: 'Simple test for browser simulation',
      baseUrl: 'https://example.com',
      credentials: {
        username: 'test@example.com',
        password: 'testpass123',
      },
      userSimulation: {
        userProfile: {
          role: 'User',
          experienceLevel: 'Beginner',
          newTo: ['JavaScript', 'React'],
        },
        goals: ['Complete the login flow', 'Navigate to dashboard'],
        context: ['Using a Windows PC', 'Using Chrome browser'],
      },
      successCriteria: ['Login successfully', 'Navigate to dashboard successfully'],
    }

    console.log('🚀 Starting simulation with test journey:')
    console.log(JSON.stringify(testJourney, null, 2))

    console.log('\n⏳ Running simulation...')
    const startTime = Date.now()

    const metrics = await simulator.simulateJourney(testJourney)

    const endTime = Date.now()
    console.log(`\n✅ Simulation completed in ${endTime - startTime}ms`)

    console.log('\n📊 Collected UX Metrics:')
    console.log(JSON.stringify(metrics, null, 2))

    console.log('\n📈 Metrics Summary:')
    console.log(`Load Time: ${metrics.loadTime}ms`)
    console.log(`Interaction Time: ${metrics.interactionTime}ms`)
    console.log(`Error Count: ${metrics.errorCount}`)
    console.log(`Screenshots: ${metrics.screenshotPaths.length}`)
    console.log(`Timestamp: ${metrics.timestamp.toISOString()}`)

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
  }
}

if (require.main === module) {
  testSimulator()
}

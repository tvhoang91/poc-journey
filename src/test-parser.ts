import path from 'path'
import fs from 'fs/promises'
import { JourneyParser } from './journey/parser'

async function testParser() {
  console.log('🔍 Testing Journey Parser')

  try {
    const parser = new JourneyParser()
    
    // Test with sample journey file
    const journeyPath = path.join('data/journeys/sample-journey.md')
    console.log(`📄 Reading journey file: ${journeyPath}`)
    
    const content = await fs.readFile(journeyPath, 'utf-8')
    console.log('📋 Raw markdown content:')
    console.log('---')
    console.log(content)
    console.log('---')

    console.log('\n🔄 Parsing journey...')
    const journey = await parser.parseJourneyFile(journeyPath)
    
    console.log('✅ Parsed journey successfully!')
    console.log(JSON.stringify(journey, null, 2))
    
    console.log('\n📊 Journey summary:')
    console.log(`Name: ${journey.name}`)
    console.log(`Description: ${journey.description}`)
    console.log(`Base URL: ${journey.baseUrl}`)
    console.log(`Steps: ${journey.steps.length}`)
    
    if (journey.credentials) {
      console.log(`Credentials: ${journey.credentials.username}`)
    }
    
    console.log('\n📝 Steps breakdown:')
    journey.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step.action}${step.selector ? ` (${step.selector})` : ''}${step.text ? ` - "${step.text}"` : ''}${step.url ? ` - ${step.url}` : ''}`)
    })

  } catch (error) {
    console.error('❌ Parser test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }
  }
}

if (require.main === module) {
  testParser()
}
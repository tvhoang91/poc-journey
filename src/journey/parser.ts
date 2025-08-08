import fs from 'fs/promises'
import path from 'path'
import { JourneySpec, JourneySpecSchema } from '../types'

export class JourneyParser {
  async parseJourneyFile(filePath: string): Promise<JourneySpec> {
    const content = await fs.readFile(filePath, 'utf-8')
    const journeyData = this.extractJourneyFromMarkdown(content)
    return JourneySpecSchema.parse(journeyData)
  }

  private extractJourneyFromMarkdown(content: string): unknown {
    const lines = content.split('\n')
    const journeyData: any = {
      steps: [],
    }

    let currentSection = ''
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('# ')) {
        journeyData.name = trimmed.substring(2)
      } else if (trimmed.startsWith('## Description')) {
        currentSection = 'description'
      } else if (trimmed.startsWith('## URL')) {
        currentSection = 'url'
      } else if (trimmed.startsWith('## Credentials')) {
        currentSection = 'credentials'
      } else if (trimmed.startsWith('## Steps')) {
        currentSection = 'steps'
      } else if (currentSection && trimmed) {
        this.parseSection(currentSection, trimmed, journeyData)
      }
    }

    return journeyData
  }

  private parseSection(section: string, line: string, data: any): void {
    switch (section) {
      case 'description':
        data.description = line
        break
      case 'url':
        data.baseUrl = line
        break
      case 'credentials':
        if (line.includes('Username:')) {
          data.credentials = data.credentials || {}
          data.credentials.username = line.split('Username:')[1].trim()
        } else if (line.includes('Password:')) {
          data.credentials = data.credentials || {}
          data.credentials.password = line.split('Password:')[1].trim()
        }
        break
      case 'steps':
        if (line.startsWith('- ')) {
          const stepText = line.substring(2)
          const step = this.parseStepText(stepText)
          if (step) {
            data.steps.push(step)
          }
        }
        break
    }
  }

  private parseStepText(stepText: string): any {
    if (stepText.startsWith('Navigate to ')) {
      return {
        action: 'navigate',
        url: stepText.substring(12),
      }
    } else if (stepText.startsWith('Click ')) {
      return {
        action: 'click',
        selector: stepText.substring(6),
      }
    } else if (stepText.startsWith('Type ')) {
      const parts = stepText.substring(5).split(' in ')
      return {
        action: 'type',
        text: parts[0],
        selector: parts[1],
      }
    } else if (stepText.startsWith('Wait ')) {
      return {
        action: 'wait',
        timeout: parseInt(stepText.substring(5)) * 1000,
      }
    } else if (stepText === 'Take screenshot') {
      return {
        action: 'screenshot',
      }
    }
    
    return null
  }
}
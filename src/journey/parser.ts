import fs from 'fs/promises'
import { JourneySpec, journeySpecSchema } from '../types/journey-schema'

export class JourneyParser {
  async parseJourneyFile(filePath: string): Promise<JourneySpec> {
    const content = await fs.readFile(filePath, 'utf-8')
    const journeyData = this.extractJourneyFromMarkdown(content)
    return journeySpecSchema.parse(journeyData)
  }

  private extractJourneyFromMarkdown(content: string): unknown {
    const lines = content.split('\n')
    const journeyData: any = {
      userSimulation: {
        userProfile: {},
        goals: [],
        context: [],
      },
      successCriteria: [],
    }

    let currentSection = ''
    let currentSubsection = ''

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith('# ')) {
        journeyData.name = trimmed.substring(2)
      } else if (trimmed.startsWith('## ')) {
        currentSection = this.getSectionKey(trimmed)
        currentSubsection = ''
      } else if (trimmed.startsWith('### ')) {
        currentSubsection = this.getSubsectionKey(trimmed)
      } else if (currentSection && trimmed) {
        this.parseSection(currentSection, currentSubsection, trimmed, journeyData)
      }
    }

    return journeyData
  }

  private getSectionKey(header: string): string {
    const sectionMap: { [key: string]: string } = {
      '## Description': 'description',
      '## URL': 'url',
      '## Credentials': 'credentials',
      '## User Simulation': 'userSimulation',
      '## Success Criteria': 'successCriteria',
    }
    return sectionMap[header] || ''
  }

  private getSubsectionKey(header: string): string {
    const subsectionMap: { [key: string]: string } = {
      '### User Profile': 'userProfile',
      '### User Goals': 'goals',
      '### User Context': 'context',
    }
    return subsectionMap[header] || ''
  }

  private parseSection(section: string, subsection: string, line: string, data: any): void {
    switch (section) {
      case 'description':
        if (!data.description) {
          data.description = line
        } else {
          data.description += ' ' + line
        }
        break
      case 'url':
        data.baseUrl = line
        break
      case 'credentials':
        this.parseCredentials(line, data)
        break
      case 'userSimulation':
        this.parseUserSimulation(subsection, line, data)
        break
      case 'successCriteria':
        if (line.startsWith('- ')) {
          data.successCriteria.push(line.substring(2))
        }
        break
    }
  }

  private parseCredentials(line: string, data: any): void {
    if (line.includes('Username:')) {
      data.credentials = data.credentials || {}
      data.credentials.username = line.split('Username:')[1].trim()
    } else if (line.includes('Password:')) {
      data.credentials = data.credentials || {}
      data.credentials.password = line.split('Password:')[1].trim()
    }
  }

  private parseUserSimulation(subsection: string, line: string, data: any): void {
    if (!line.startsWith('- ')) return

    const content = line.substring(2).trim()

    switch (subsection) {
      case 'userProfile':
        this.parseUserProfile(content, data.userSimulation.userProfile)
        break
      case 'goals':
        data.userSimulation.goals.push(content)
        break
      case 'context':
        data.userSimulation.context.push(content)
        break
    }
  }

  private parseUserProfile(content: string, userProfile: any): void {
    if (content.startsWith('Role: ')) {
      userProfile.role = content.substring(6).trim()
    } else if (content.startsWith('Experience Level: ')) {
      userProfile.experienceLevel = content.substring(18).trim()
    } else if (content.startsWith('New to: ')) {
      const newToContent = content.substring(8).trim()
      userProfile.newTo = userProfile.newTo || []
      userProfile.newTo.push(newToContent)
    }
  }

  async destroy() {
    // do nothing
  }
}

// DOM analysis results from local vision model
export interface DOMAnalysis {
  elements: DOMElement[]
  layout: LayoutInfo
  interactiveElements: InteractiveElement[]
  visualState: VisualState
  accessibility: AccessibilityInfo
}

// Supporting types for DOM analysis
export interface DOMElement {
  tagName: string
  selector: string
  text: string
  attributes: Record<string, string>
  bounds: { x: number; y: number; width: number; height: number }
  isVisible: boolean
}

export interface LayoutInfo {
  viewport: { width: number; height: number }
  scrollPosition: { x: number; y: number }
  contentSize: { width: number; height: number }
}

export interface InteractiveElement {
  selector: string
  type: 'button' | 'link' | 'input' | 'select' | 'textarea'
  isClickable: boolean
  isEnabled: boolean
  placeholder?: string
}

export interface VisualState {
  screenshot: string
  colorScheme: 'light' | 'dark'
  animations: boolean
  loadingIndicators: string[]
}

export interface AccessibilityInfo {
  hasAriaLabels: boolean
  headingStructure: string[]
  focusableElements: string[]
  colorContrast: 'good' | 'poor' | 'unknown'
}
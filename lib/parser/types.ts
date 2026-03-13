export type CellType = 'label' | 'input' | 'locked-value' | 'answer-target'

export interface SafeLessonPayload {
  lessonId: string
  lessonSlug: string
  moduleSlug: string
  title: string
  description: string
  objective: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedMinutes: number
  revealAllowed: boolean
  grid: {
    rows: number
    cols: number
    cells: Record<string, {
      value: string
      type: CellType
    }>
  }
  hintCount: number
  walkthroughAvailable: boolean
}

export interface AnswerRule {
  cell: string
  expectedValue: string
  valueType: "text" | "number" | "currency" | "percentage"
  tolerance: number
  explanation?: string
}

export interface ParsedLesson extends SafeLessonPayload {
  answerKey: AnswerRule[]
  hints: Array<{ level: number; hintText: string }>
  walkthrough: Array<{ stepNumber: number; explanation: string }>
  sheetSourceId: string
}

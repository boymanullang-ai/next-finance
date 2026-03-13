import { AnswerRule } from '../parser/types'

export interface GradingResult {
  correct: number
  total: number
  percent: number
  feedback: Array<{ cell: string; ok: boolean; explanation: string }>
  status: 'in_progress' | 'completed'
}

export function gradeAnswers(userCells: Record<string, string>, answerKey: AnswerRule[]): GradingResult {
  let correct = 0
  const total = answerKey.length
  const feedback = []

  for (const rule of answerKey) {
    const userVal = userCells[rule.cell] || ''
    
    // Normalize values
    const normUser = userVal.trim().toLowerCase().replace(/,/g, '')
    const normExpected = rule.expectedValue.trim().toLowerCase().replace(/,/g, '')
    
    let ok = false

    if (rule.valueType === 'number' || rule.valueType === 'currency' || rule.valueType === 'percentage') {
      const numUser = parseFloat(normUser)
      const numExpected = parseFloat(normExpected)
      if (!isNaN(numUser) && !isNaN(numExpected)) {
        if (Math.abs(numUser - numExpected) <= (rule.tolerance || 0)) {
          ok = true
        }
      }
    } else {
      if (normUser === normExpected) {
        ok = true
      }
    }

    if (ok) correct++
    feedback.push({
      cell: rule.cell,
      ok,
      explanation: rule.explanation || '',
    })
  }

  return {
    correct,
    total,
    percent: total > 0 ? Math.round((correct / total) * 100) : 100,
    feedback,
    status: correct === total ? 'completed' : 'in_progress'
  }
}

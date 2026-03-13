import { getSheetsClient } from '@/lib/sheets/client'
import { ParsedLesson, SafeLessonPayload, AnswerRule } from './types'

function cellToIndex(cell: string): { r: number, c: number } {
  const match = cell.match(/^([A-Z]+)(\d+)$/)
  if (!match) return { r: -1, c: -1 }
  const colStr = match[1]
  const rowStr = match[2]
  let c = 0
  for (let i = 0; i < colStr.length; i++) {
    c = c * 26 + colStr.charCodeAt(i) - 64
  }
  return { r: parseInt(rowStr, 10), c }
}

export async function fetchLessonFromSheet(spreadsheetId: string): Promise<ParsedLesson> {
  const sheets = await getSheetsClient()

  const tabs = ['Lesson_Config', 'Student_View', 'Editable_Cells', 'Answer_Key', 'Hints', 'Walkthrough']
  const ranges = tabs.map(t => `'${t}'!A:Z`)

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
  })

  const values = response.data.valueRanges || []

  // Parse Lesson_Config
  const configTab = values[0].values || []
  const config = configTab.reduce((acc: any, row: any[]) => {
    if (row.length >= 2) acc[row[0]] = row[1]
    return acc
  }, {})

  // Parse Editable_Cells
  const editableTab = values[2].values || []
  const editableCells = new Set<string>()
  for (let i = 1; i < editableTab.length; i++) {
    if (editableTab[i][0] && editableTab[i][1]?.toLowerCase() === 'true') {
      editableCells.add(editableTab[i][0])
    }
  }

  // Parse Answer_Key
  const answerTab = values[3].values || []
  const answerKey: AnswerRule[] = []
  const answerCells = new Set<string>()
  for (let i = 1; i < answerTab.length; i++) {
    const row = answerTab[i]
    if (row[0]) {
      answerCells.add(row[0])
      answerKey.push({
        cell: row[0],
        expectedValue: row[1] || '',
        valueType: (row[2] || 'text') as any,
        tolerance: parseFloat(row[3] || '0'),
        explanation: row[4] || '',
      })
    }
  }

  // Parse Student_View
  const studentViewTab = values[1].values || []
  const rowsCount = parseInt(config.rows_count || '10', 10)
  const colsCount = parseInt(config.cols_count || '6', 10)
  
  const cells: Record<string, any> = {}

  for (let r = 0; r < rowsCount; r++) {
    for (let c = 0; c < colsCount; c++) {
      const rowData = studentViewTab[r]
      const cellValue = rowData && rowData.length > c ? rowData[c] : ''
      const colLetter = String.fromCharCode(65 + c)
      const cellRef = `${colLetter}${r + 1}`

      const isEditable = editableCells.has(cellRef)
      const isAnswer = answerCells.has(cellRef)

      let type = 'label'
      if (isEditable && isAnswer) type = 'answer-target'
      else if (isEditable && !isAnswer) type = 'input'
      else if (!isEditable && cellValue) type = 'locked-value'
      
      if (cellValue || isEditable) {
        cells[cellRef] = {
          value: cellValue || '',
          type,
        }
      }
    }
  }

  // Parse Hints
  const hintsTab = values[4].values || []
  const hints = []
  for (let i = 1; i < hintsTab.length; i++) {
    const row = hintsTab[i]
    if (row[0] && row[1]) {
      hints.push({ level: parseInt(row[0], 10), hintText: row[1] })
    }
  }

  // Parse Walkthrough
  const walkthroughTab = values[5].values || []
  const walkthrough = []
  for (let i = 1; i < walkthroughTab.length; i++) {
    const row = walkthroughTab[i]
    if (row[0] && row[1]) {
      walkthrough.push({ stepNumber: parseInt(row[0], 10), explanation: row[1] })
    }
  }

  return {
    lessonId: config.lesson_id,
    lessonSlug: config.lesson_slug,
    moduleSlug: config.module_slug,
    title: config.title,
    description: config.description,
    objective: config.objective,
    difficulty: config.difficulty as any,
    estimatedMinutes: parseInt(config.estimated_minutes, 10),
    revealAllowed: config.reveal_allowed === 'true',
    grid: {
      rows: rowsCount,
      cols: colsCount,
      cells,
    },
    hintCount: hints.length,
    walkthroughAvailable: walkthrough.length > 0,
    answerKey,
    hints,
    walkthrough,
    sheetSourceId: spreadsheetId,
  }
}

export function toSafePayload(lesson: ParsedLesson): SafeLessonPayload {
  const { answerKey, hints, walkthrough, sheetSourceId, ...safe } = lesson
  return safe
}

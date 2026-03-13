import { NextResponse } from 'next/server'
import { mockLesson } from '@/lib/parser/mockLesson'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> }
) {
  const { lessonSlug } = await params;
  // Real implementation: auth protect and fetch key

  try {
    const { answerKey, revealAllowed } = mockLesson

    if (!revealAllowed) {
      return NextResponse.json({ error: 'Reveal not allowed for this lesson' }, { status: 403 })
    }

    const revealedCells: Record<string, string> = {}
    for (const rule of answerKey) {
      revealedCells[rule.cell] = rule.expectedValue
    }

    // Usually record reveal state in db
    // UPDATE lesson_attempts SET solution_revealed = true

    return NextResponse.json({
      revealed: true,
      cells: revealedCells
    })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to reveal answer' }, { status: 500 })
  }
}

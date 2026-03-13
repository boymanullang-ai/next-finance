import { NextResponse } from 'next/server'
import { gradeAnswers } from '@/lib/grading/gradeLogic'
import { mockLesson } from '@/lib/parser/mockLesson'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> }
) {
  const { lessonSlug } = await params;
  // Real implementation: Auth check and fetch answer_key from db/google sheet

  try {
    const body = await request.json()
    const { cells } = body

    if (!cells) {
      return NextResponse.json({ error: 'Missing cells object' }, { status: 400 })
    }

    const { answerKey } = mockLesson
    
    // Grade the answers
    const result = gradeAnswers(cells, answerKey)

    // Log progress in DB:
    // UPDATE lesson_attempts SET last_state_json = ..., latest_score = ..., status = ...

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 })
  }
}

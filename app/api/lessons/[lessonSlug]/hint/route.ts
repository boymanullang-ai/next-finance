import { NextResponse } from 'next/server'
import { mockLesson } from '@/lib/parser/mockLesson'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> }
) {
  const { lessonSlug } = await params;
  try {
    const body = await request.json()
    const currentHintLevel = parseInt(body.currentHintLevel || '0', 10)

    const { hints } = mockLesson

    const nextHintLevel = currentHintLevel + 1
    const hint = hints.find(h => h.level === nextHintLevel)

    if (!hint) {
      return NextResponse.json({ error: 'No more hints available' }, { status: 404 })
    }

    // Usually log to db hint usage
    // UPDATE lesson_plugin_stats

    return NextResponse.json({
      nextHintLevel: hint.level,
      hintText: hint.hintText
    })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process hint' }, { status: 500 })
  }
}

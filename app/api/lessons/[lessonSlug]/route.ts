import { NextResponse } from 'next/server'
import { toSafePayload } from '@/lib/parser/lessonParser'
import { mockLesson } from '@/lib/parser/mockLesson'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> }
) {
  const { lessonSlug } = await params;
  // In a real implementation we would:
  // 1. Check auth using createClient()
  // 2. Look up the lesson by slug in Supabase to get gsheet_source_id
  // 3. If gsheet_source_id is valid, fetch it via fetchLessonFromSheet
  // 4. Return safe payload + progress
  
  // For MVP UI/UX validation, return mock
  const safePayload = toSafePayload(mockLesson)

  // Normally we would also query 'lesson_attempts' table 
  // and attach it to the payload if the user has an existing attempt.

  return NextResponse.json(safePayload)
}

import { createClient } from '@/lib/supabase/server'

export interface AttemptState {
  status: 'not_started' | 'in_progress' | 'completed'
  latest_score: number
  hint_count_used: number
  solution_revealed: boolean
  last_state_json: any
}

export async function getLessonAttempt(lessonId: string): Promise<AttemptState | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Lookup internal UUID for the string lessonId
  const { data: lesson } = await supabase.from('lessons').select('id').eq('lesson_id', lessonId).single()
  if (!lesson) return null

  const { data: attempt } = await supabase
    .from('lesson_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .single()
    
  return attempt as AttemptState | null
}

export async function saveLessonAttempt(lessonId: string, state: Partial<AttemptState>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: lesson } = await supabase.from('lessons').select('id').eq('lesson_id', lessonId).single()
  if (!lesson) return

  const { data: existing } = await supabase
    .from('lesson_attempts')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .single()

  if (existing) {
    await supabase.from('lesson_attempts').update({
      ...state,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id)
  } else {
    await supabase.from('lesson_attempts').insert({
      user_id: user.id,
      lesson_id: lesson.id,
      ...state,
      started_at: new Date().toISOString()
    })
  }
}
